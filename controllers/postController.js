import { prisma } from "../app.js";

export const getPosts = async (req, res, next) => {
  try {
    const { category, tag, search, page = 1, limit = 10, sort = "desc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Support multiple categories/tags as comma-separated values
    const categoryList = category ? category.split(',').map(c => c.trim()) : [];
    const tagList = tag ? tag.split(',').map(t => t.trim()) : [];

    // Build filter
    const filters = {
      published: true,
      AND: [
        categoryList.length
          ? { categories: { some: { name: { in: categoryList } } } }
          : {},
        tagList.length
          ? { tags: { some: { name: { in: tagList } } } }
          : {},
        search
          ? { title: { contains: search, mode: "insensitive" } }
          : {},
      ],
    };

    const [posts, totalPosts] = await Promise.all([
      prisma.post.findMany({
        where: filters,
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
      }),
      prisma.post.count({ where: filters }),
    ]);

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

export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: req.params.slug },
      include: {
        categories: true,
        tags: true,
        comments: true,
        media: true,
        views: true,
      },
    });

    if (!post)
      return res.status(404).json({ error: "Post not found" });

    res.json(post);

  } catch (err) {
    next(err);
  }
};

function slugify(text) {
  return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-')
}

export const createPost = async (req, res, next) => {
  try {
    const { title, layout, published, categoryIds = [], tagIds = [] } = req.body;
    const slug = slugify(title);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        layout,
        published,
        categories: { connect: categoryIds.map(id => ({ id })) },
        tags: { connect: tagIds.map(id => ({ id })) },
      },
      include: { categories: true, tags: true, comments: true, media: true, views: true },
    });
    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Optional: check if post exists first
    const postExists = await prisma.post.findUnique({ where: { id } });
    if (!postExists) return res.status(404).json({ error: "Post not found" });

    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};
