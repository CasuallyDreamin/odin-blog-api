import { prisma } from "../app.js";

export const getAllPostViews = async (req, res, next) => {
  try {
    const views = await prisma.postView.findMany();
    res.json(views);
  } catch (err) {
    next(err);
  }
};

export const getPostViewById = async (req, res, next) => {
  try {
    const view = await prisma.postView.findUnique({ where: { id: req.params.id } });
    if (!view) return res.status(404).json({ error: "Post view not found" });
    res.json(view);
  } catch (err) {
    next(err);
  }
};

export const createPostView = async (req, res, next) => {
  try {
    const { postId, ipHash, userAgent } = req.body;

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentView = await prisma.postView.findFirst({
      where: {
        postId,
        ipHash,
        date: { gte: oneHourAgo },
      },
    });

    if (recentView) return res.status(200).json(recentView);

    const view = await prisma.postView.create({
      data: { postId, ipHash, userAgent },
    });

    res.status(201).json(view);
  } catch (err) {
    next(err);
  }
};
