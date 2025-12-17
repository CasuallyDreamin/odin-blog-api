import { prisma } from "../prisma/client.js";

export const getPostAnalytics = async (req, res, next) => {
  try {
    const postId = req.params.id;

    const views = await prisma.postView.count({ where: { postId } });

    const viewsPerDay = await prisma.postView.groupBy({
      by: ['date'],
      where: { postId, date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      _count: { id: true },
    });

    res.json({ postId, views, viewsPerDay });
  } catch (err) {
    next(err);
  }
};

export const getOverallAnalytics = async (req, res, next) => {
  try {
    const totalViews = await prisma.postView.count();
    const totalPosts = await prisma.post.count();

    const viewsPerDay = await prisma.postView.groupBy({
      by: ['date'],
      where: { date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
      _count: { id: true },
    });

    res.json({ totalPosts, totalViews, viewsPerDay });
  } catch (err) {
    next(err);
  }
};
