import { prisma } from "../prisma/client.js";
import { sanitizeHtml } from '../utils/sanitize.js';

function slugify(text) {
  return text.toLowerCase().trim().replace(/[\s\W-]+/g, '-')
}

async function findUniqueProjectSlug(title, currentId = null) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });

    if (!existing) return slug;
    if (existing.id === currentId) return slug;

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export const getProjects = async (req, res, next) => {
  try {
    const { category, tag, search, page = 1, limit = 10, sort = "desc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const categoryList = category ? category.split(',').map(c => c.trim()) : [];
    const tagList = tag ? tag.split(',').map(t => t.trim()) : [];

    const filters = {
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
                { description: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
      ],
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where: filters,
        include: {
          categories: true,
          tags: true,
          media: true
        },
        orderBy: {
          createdAt: sort.toLowerCase() === "asc" ? "asc" : "desc",
        },
        skip,
        take: parseInt(limit),
      }),
      prisma.project.count({ where: filters }),
    ]);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      projects,
    });
  } catch (err) {
    next(err);
  }
};

export const getProjectBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) return res.status(400).json({ error: "Slug is required" });

    const project = await prisma.project.findFirst({
      where: { slug },
      include: {
        categories: true,
        tags: true,
        media: true,
      },
    });

    if (!project) {
      console.warn(`Project not found for slug: ${slug}`);
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description = '',
      content = '',
      published = false,
      categoryIds = [],
      tagIds = []
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const safeDescription = sanitizeHtml(description);
    const safeContent = sanitizeHtml(content);
    const slug = await findUniqueProjectSlug(title);

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description: safeDescription,
        content: safeContent,
        published,
        categories: { connect: categoryIds.map(id => ({ id })) },
        tags: { connect: tagIds.map(id => ({ id })) },
      },
      include: {
        categories: true,
        tags: true,
        media: true
      }
    });

    return res.status(201).json(project);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      description = '',
      content = '',
      published,
      categoryIds = [],
      tagIds = []
    } = req.body;

    const projectExists = await prisma.project.findUnique({ where: { id }});
    if (!projectExists) return res.status(404).json({ error: "Project not found" });

    if (!title) return res.status(400).json({ error: "Title is required" });

    const safeDescription = sanitizeHtml(description);
    const safeContent = sanitizeHtml(content);

    let newSlug = projectExists.slug;
    if (title !== projectExists.title) {
      newSlug = await findUniqueProjectSlug(title, id);
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        title,
        slug: newSlug,
        description: safeDescription,
        content: safeContent,
        published,
        categories: { set: categoryIds.map(id => ({ id })) },
        tags: { set: tagIds.map(id => ({ id })) },
      },
      include: {
        categories: true,
        tags: true,
        media: true
      }
    });

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const exists = await prisma.project.findUnique({ where: { id }});
    if (!exists) return res.status(404).json({ error: "Project not found" });

    await prisma.project.delete({ where: { id }});
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};
