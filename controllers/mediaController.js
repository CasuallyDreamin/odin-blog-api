import { prisma } from "../app.js";

export const getAllMedia = async (req, res, next) => {
  try {
    const media = await prisma.media.findMany({
      include: { post: true },
    });
    res.json(media);
  } catch (err) {
    next(err);
  }
};

export const getMediaById = async (req, res, next) => {
  try {
    const media = await prisma.media.findUnique({
      where: { id: req.params.id },
      include: { post: true },
    });
    if (!media) return res.status(404).json({ error: "Media not found" });
    res.json(media);
  } catch (err) {
    next(err);
  }
};

export const createMedia = async (req, res, next) => {
  try {
    const { filePath, mimeType, altText, postId } = req.body;

    if (postId) {
      const postExists = await prisma.post.findUnique({ where: { id: postId } });
      if (!postExists) return res.status(400).json({ error: "Invalid postId" });
    }

    const media = await prisma.media.create({
      data: { filePath, mimeType, altText, postId },
    });
    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
};
