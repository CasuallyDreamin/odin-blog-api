import { prisma } from "../prisma/client.js";

export const getAllMedia = async (req, res, next) => {
  try {
    const media = await prisma.media.findMany();
    res.json(media);
  } catch (err) {
    next(err);
  }
};

export const getMediaById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const media = await prisma.media.findUnique({
      where: { id }
    });
    if (!media) return res.status(404).json({ error: "Media not found" });
    res.json(media);
  } catch (err) {
    next(err);
  }
};
export const createMedia = async (req, res, next) => {
  try {
    const { filePath, mimeType, altText, postId, projectId } = req.body;

    // 1. Check if the Post exists (if a postId was provided)
    if (postId) {
      const postExists = await prisma.post.findUnique({
        where: { id: postId }
      });

      // 2. If it doesn't exist, return 400 and stop here
      if (!postExists) {
        return res.status(400).json({ error: "Invalid postId" });
      }
    }

    // 3. If we get here, either postId is valid or it wasn't provided at all
    // Prisma will now generate the new Media 'id' automatically
    const media = await prisma.media.create({
      data: { 
        filePath, 
        mimeType, 
        altText,
        postId: postId || null,
        projectId: projectId || null
      },
    });

    res.status(201).json(media);
  } catch (err) {
    next(err);
  }
};