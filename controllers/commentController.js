import { prisma } from "../app.js";

export const getComments = async (req, res, next) => {
  try {
    const comments = await prisma.comment.findMany();
    res.json(comments);
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
