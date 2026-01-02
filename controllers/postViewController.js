import { prisma } from "../prisma/client.js";

export const getAllPostViews = async (req, res, next) => {
  try {
    const [totalPosts, totalViews, viewsByDay] = await Promise.all([
      prisma.post.count(),
      prisma.postView.count(),
      prisma.postView.groupBy({
        by: ['date'],
        _count: { id: true },
        orderBy: { date: 'asc' }
      })
    ]);

    res.json({
      totalPosts,
      totalViews,
      viewsPerDay: viewsByDay.map(v => ({
        date: v.date,
        _count: { id: v._count.id }
      }))
    });
  } catch (err) {
    next(err);
  }
};
export const getPostViewById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const views = await prisma.postView.findMany({
      where: { postId: id }
    });

    res.json({
      postId: id,
      views: views.length,
      viewsPerDay: [] 
    });
  } catch (err) {
    next(err);
  }
};

export const createPostView = async (req, res, next) => {
  try {
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ error: "Post ID is required" });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newView = await prisma.postView.create({
      data: {
        postId,
        date: today
      }
    });

    res.status(201).json(newView);
  } catch (err) {
    next(err);
  }
};