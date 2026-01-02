import { prisma } from "../prisma/client.js";
import { Prisma } from "@prisma/client";

export const getAllCategories = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort = "asc", search = "" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const whereClause = search
      ? { name: { contains: search, mode: "insensitive" } }
      : {};

    const categoriesWithCount = await prisma.category.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        _count: {
          select: { 
            posts: true,
            projects: true,
            quotes: true 
          },
        },
      },
      orderBy: {
        name: sort.toLowerCase() === "asc" ? "asc" : "desc",
      },
      skip,
      take: parseInt(limit),
    });

    const categories = categoriesWithCount.map(c => ({
        id: c.id,
        name: c.name,
        postCount: c._count.posts,
        projectCount: c._count.projects,
        quoteCount: c._count.quotes
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
      include: { 
        posts: true,
        projects: true,
        quotes: true 
      },
    });
    
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    
    res.json(category);
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const category = await prisma.category.create({ 
      data: { name } 
    });
    
    res.status(201).json(category);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return res.status(400).json({ error: "Category name already exists" });
    }
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { name },
    });
    
    res.json(category);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        return res.status(400).json({ error: "Category name already exists" });
      }
      if (err.code === "P2025") {
        return res.status(404).json({ error: "Category not found" });
      }
    }
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
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
      return res.status(404).json({ error: "Category not found" });
    }
    next(err);
  }
};