import { prisma } from "../app.js";

export const getSettings = async (req, res, next) => {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "singleton" } });
    res.json(settings);
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const { theme, blogName, defaultLanguage } = req.body;
    const settings = await prisma.settings.update({
      where: { id: "singleton" },
      data: { theme, blogName, defaultLanguage },
    });
    res.json(settings);
  } catch (err) {
    next(err);
  }
};
