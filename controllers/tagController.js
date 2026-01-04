import { prisma } from "../prisma/client.js";

export const getAllTags = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    const where = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const total = await prisma.tag.count({ where });

    const tags = await prisma.tag.findMany({
      where,
      include: { posts: true },
      skip: (page - 1) * limit,
      take: limit,

      // TAG HAS NO createdAt — order by name instead
      orderBy: { name: "asc" },
    });

    res.json({
      tags,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const getTagById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: { posts: true },
    });

    if (!tag) return res.status(404).json({ error: "Tag not found" });

    res.json(tag);
  } catch (err) {
    next(err);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Tag name is required" });
    }

    const exists = await prisma.tag.findFirst({
      where: { name: { equals: name.trim(), mode: "insensitive" } },
    });

    if (exists) {
      return res.status(400).json({ error: "Tag already exists" });
    }

    const tag = await prisma.tag.create({
      data: { name: name.trim() },
    });

    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.tag.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};