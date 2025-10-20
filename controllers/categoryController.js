import { prisma } from "../app.js";

export const getAllCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "asc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const categories = await prisma.category.findMany({
      include: { posts: true },
      orderBy: {
        name: sort.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip,
      take: parseInt(limit),
    });

    const totalCategories = await prisma.category.count();

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
