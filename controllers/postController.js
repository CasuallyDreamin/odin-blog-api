import { prisma } from "../app.js";
import { sanitizeHtml } from '../utils/sanitize.js'; 

function slugify(text) {
  return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-')
}

// Function to find a unique slug, handling conflicts
async function findUniqueSlug(title, currentId = null) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });

    if (!existing) {
      return slug;
    }

    // If the existing post is the one we are currently updating, the slug is still unique for this post.
    if (existing.id === currentId) {
      return slug;
    }
    
    // If the existing post is a different post, try a new slug.
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const { category, tag, search, page = 1, limit = 10, sort = "desc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const categoryList = category ? category.split(',').map(c => c.trim()) : [];
    const tagList = tag ? tag.split(',').map(t => t.trim()) : [];

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
          ? { 
              OR: [
                  { title: { contains: search, mode: "insensitive" } },
                  { content: { contains: search, mode: "insensitive" } },
              ],
            }
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

export const createPost = async (req, res, next) => {
  try {
    const { 
      title, 
      content,
      published = false, 
      categoryIds = [], 
      tagIds = [] 
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const safeContent = sanitizeHtml(content);

    // Use the robust slug function for creation
    const slug = await findUniqueSlug(title);

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content: safeContent,
        published,
        categories: {
          connect: categoryIds.map((id) => ({ id }))
        },
        tags: {
          connect: tagIds.map((id) => ({ id }))
        }
      },
      include: {
        categories: true,
        tags: true,
        comments: true,
        media: true,
        views: true
      }
    });

    return res.status(201).json(post);

  } catch (err) {
    console.error(err);
    return next(err);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      published,
      categoryIds = [],
      tagIds = [],
    } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required for update" });
    }

    const postExists = await prisma.post.findUnique({ where: { id } });
    if (!postExists) return res.status(404).json({ error: "Post not found" });

    const safeContent = sanitizeHtml(content);

    let newSlug = postExists.slug;
    if (title !== postExists.title) {
        newSlug = await findUniqueSlug(title, id);
    }

    const updateData = {
        title,
        slug: newSlug,
        content: safeContent,
        published: published,
        categories: { set: categoryIds.map((id) => ({ id })) },
        tags: { set: tagIds.map((id) => ({ id })) },
    };

    const updatedPost = await prisma.post.update({
      where: { id },
      data: updateData,
      include: {
        categories: true,
        tags: true,
        comments: true,
        media: true,
        views: true
      }
    });

    return res.status(200).json(updatedPost);

  } catch (err) {
    console.error(err);
    return next(err);
  }
};


export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const postExists = await prisma.post.findUnique({ where: { id } });
    if (!postExists) return res.status(404).json({ error: "Post not found" });

    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};