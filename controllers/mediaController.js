import { prisma } from "../prisma/client.js";

export const getAllMedia = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { altText: { contains: search, mode: "insensitive" } },
            { filePath: { contains: search, mode: "insensitive" } },
            { mimeType: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [media, total] = await Promise.all([
      prisma.media.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.media.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      data: media,
      totalPages,
      currentPage: page,
      totalItems: total,
    });
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

    if (postId) {
      const postExists = await prisma.post.findUnique({
        where: { id: postId }
      });

      if (!postExists) {
        return res.status(400).json({ error: "Invalid postId" });
      }
    }

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

export const deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await prisma.media.delete({
      where: { id },
    });
    res.status(200).json({ success: true, deleted });
  } catch (err) {
    next(err);
  }
};

export const updateMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { altText } = req.body;

    const updated = await prisma.media.update({
      where: { id },
      data: { altText },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
};