import { prisma } from "../app.js";

const createDefaultSettings = () => {
  return prisma.settings.create({
    data: {
      id: "singleton",
      blogName: "My Awesome Blog",
      tagline: "The best place for news.",
      postsPerPage: 10,
      theme: "default",
    },
  });
};

export const getSettings = async (req, res, next) => {
  try {
    let settings = await prisma.settings.findUnique({ where: { id: "singleton" } });

    if (!settings) {
      settings = await createDefaultSettings();
    }

    res.json(settings);
  } catch (err) {
    next(err);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    const {
      blogName,
      tagline,
      logoUrl,
      theme,
      postsPerPage,
      seoTitle,
      seoDescription,
      socialLinks,
    } = req.body;

    const data = {
      blogName,
      tagline,
      logoUrl,
      theme,
      postsPerPage: Number(postsPerPage),
      seoTitle,
      seoDescription,
      socialLinks,
    };

    const settings = await prisma.settings.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });

    res.json(settings);
  } catch (err) {
    next(err);
  }
};