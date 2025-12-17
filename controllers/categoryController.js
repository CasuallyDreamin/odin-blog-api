import { prisma } from "../app.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "asc", search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Define the where clause for search and filtering
    const whereClause = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const categoriesWithCount = await prisma.category.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: {
        name: sort.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip,
      take: parseInt(limit),
    });

    // Format the data to match the frontend Category type structure (adding postCount)
    const categories = categoriesWithCount.map(c => ({
        id: c.id,
        name: c.name,
        postCount: c._count.posts,
    }));

    const totalCategories = await prisma.category.count({ where: whereClause });

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total: totalCategories,
      categories,
    });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: { posts: true },
    });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name, id } = req.body;
    
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name, id },
    });
    
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    await prisma.category.delete({
      where: { id: req.params.id },
    });
    
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};