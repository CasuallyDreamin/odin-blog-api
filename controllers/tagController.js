import { prisma } from "../app.js";

export const getAllTags = async (req, res, next) => {
  try {
    const tags = await prisma.tag.findMany({ include: { posts: true } });
    res.json(tags);
  } catch (err) {
    next(err);
  }
};

export const getTagById = async (req, res, next) => {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: req.params.id },
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
    const tag = await prisma.tag.create({ data: { name } });
    res.status(201).json(tag);
  } catch (err) {
    next(err);
  }
};
