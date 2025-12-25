import { prisma } from "../prisma/client.js";

export const getAllComments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "desc", status = "pending", search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const statusFilter = status === 'pending' ? { isApproved: false } : 
                         status === 'approved' ? { isApproved: true } : {};
    
    const searchFilter = search ? {
      OR: [
        { author: { contains: search, mode: "insensitive" } },
        { body: { contains: search, mode: "insensitive" } },
      ],
    } : {};
    
    const whereClause = { ...statusFilter, ...searchFilter };
    
    const comments = await prisma.comment.findMany({
      where: whereClause,
      select: {
        id: true,
        author: true,
        body: true,
        createdAt: true,
        isApproved: true,
        post: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: sort.toLowerCase() === "asc" ? "asc" : "desc" },
      skip,
      take: parseInt(limit),
    });

    const totalComments = await prisma.comment.count({ where: whereClause });

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalComments,
      comments,
    });
  } catch (err) { next(err); }
};

export const getPendingCommentsCount = async (req, res, next) => {
  try {
    const count = await prisma.comment.count({
      where: { isApproved: false },
    });
    res.json({ pendingCount: count });
  } catch (err) {
    next(err);
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: req.params.id },
    });
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    res.json(comment);
  } catch (err) {
    next(err);
  }
};

export const setStatus = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const comment = await prisma.comment.update({
      where: { id: req.params.id },
      data: { isApproved },
    });
    res.json(comment);
  } catch (err) { next(err); }
};

export const createComment = async (req, res, next) => {
  try {
    const { author, authorEmail, body, postId } = req.body;
    const comment = await prisma.comment.create({
      data: { author, authorEmail, body, postId },
    });
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};


export const deleteComment = async (req, res, next) => {
  try {
    await prisma.comment.delete({
      where: { id: req.params.id },
    });
    res.status(204).send();
  } catch (err) { next(err); }
};