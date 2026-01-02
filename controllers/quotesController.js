import { prisma } from "../prisma/client.js";
import { sanitizeHtml } from '../utils/sanitize.js';
import { Prisma } from "@prisma/client";

export const getQuotes = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10, sort = "desc" } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const categoryList = category ? category.split(',').map(c => c.trim()) : [];

    const filters = {
      AND: [
        categoryList.length ? { categories: { some: { name: { in: categoryList } } } } : {},
        search ? { content: { contains: search, mode: "insensitive" } } : {},
      ],
    };

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where: filters,
        include: { categories: true },
        orderBy: { createdAt: sort.toLowerCase() === "asc" ? "asc" : "desc" },
        skip,
        take: parseInt(limit),
      }),
      prisma.quote.count({ where: filters }),
    ]);

    res.json({
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      quotes,
    });
  } catch (err) {
    next(err);
  }
};

export const createQuote = async (req, res, next) => {
  try {
    const { content, author = '', categoryIds = [] } = req.body;
    if (!content) return res.status(400).json({ error: "Quote content is required" });

    const safeContent = sanitizeHtml(content);

    const quote = await prisma.quote.create({
      data: {
        content: safeContent,
        author,
        categories: { connect: categoryIds.map(id => ({ id })) },
      },
      include: { categories: true }
    });

    res.status(201).json(quote);
  } catch (err) {
    next(err);
  }
};

export const getQuoteById = async (req, res, next) => {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: req.params.id },
      include: { categories: true }
    });
    if (!quote) return res.status(404).json({ error: "Quote not found" });
    res.json(quote);
  } catch (err) {
    next(err);
  }
};

export const updateQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, author = '', categoryIds = [] } = req.body;

    if (!content) return res.status(400).json({ error: "Content is required" });

    const safeContent = sanitizeHtml(content);

    const updated = await prisma.quote.update({
      where: { id },
      data: {
        content: safeContent,
        author,
        categories: { set: categoryIds.map(id => ({ id })) }
      },
      include: { categories: true }
    });

    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Quote not found" });
    }
    next(err);
  }
};

export const deleteQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.quote.delete({ where: { id } });
    res.status(200).json({ message: "Quote deleted successfully" });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
      return res.status(404).json({ error: "Quote not found" });
    }
    next(err);
  }
};