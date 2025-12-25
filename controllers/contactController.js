import { prisma } from "../prisma/client.js";

export const submitMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required." });
    }

    const newMessage = await prisma.contactMessage.create({
      data: { name, email, subject, message }
    });

    res.status(201).json({ message: "Message sent successfully", data: newMessage });
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [messages, total] = await Promise.all([
      prisma.contactMessage.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.contactMessage.count()
    ]);

    res.json({
      messages,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true }
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: "Message deleted" });
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await prisma.contactMessage.count({
      where: { isRead: false }
    });
    res.json({ count: count });
  } catch (err) {
    next(err);
  }
};