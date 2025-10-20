import { prisma } from "../app.js";

export const getPosts = async (req, res, next) => {
  try {
    const { category, tag, search, page = 1, limit = 10, sort = "desc" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await prisma.post.findMany({
      where: {
        AND: [
          category
            ? { categories: { some: { name: { equals: category } } } }
            : {},
          tag
            ? { tags: { some: { name: { equals: tag } } } }
            : {},
          search
            ? { title: { contains: search, mode: "insensitive" } }
            : {},
        ],
      },
      include: {
        categories: true,
        tags: true,
        comments: true,
        media: true,
        views: true,
      },
      orderBy: {
        createdAt: sort.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip,
      take: parseInt(limit),
    });

    const totalPosts = await prisma.post.count({
      where: {
        AND: [
          category
            ? { categories: { some: { name: { equals: category } } } }
            : {},
          tag
            ? { tags: { some: { name: { equals: tag } } } }
            : {},
          search
            ? { title: { contains: search, mode: "insensitive" } }
            : {},
        ],
      },
    });

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalPosts,
      posts,
    });
  } catch (err) {
    next(err);
  }
};

export const getPostById = async (req, res, next) => {
    try {
        const post = await prisma.post.findUnique({
            where: { id: req.params.id },
            include: {
                categories: true,
                tags: true,
                comments: true,
                media: true,
                views: true,
            },
        });
        if (!post) return res.status(404).json({ error: "Post not found"});
        res.json(post);
        
    }   catch(err)  {
        next(err);
    }
};

export const createPost = async (req, res, next) => {
    try {
        const { title,
                layout,
                published,
                categoryIds = [],
                tagIds = []
        } = req.body;

        const post = await prisma.post.create({
            data: {
                title,
                layout,
                published,
                categories: { connect: categoryIds.map(id => ({ id })) },
                tags: { connect: tagIds.map(id => ({ id })) },
            },
        });
        res.status(201).json(post);
    }   catch (err) {
        next(err);
    }
};

