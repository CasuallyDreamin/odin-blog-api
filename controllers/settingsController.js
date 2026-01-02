import { prisma } from "../prisma/client.js";

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
    const fields = [
      'blogName', 'tagline', 'logoUrl', 'theme', 
      'postsPerPage', 'seoTitle', 'seoDescription', 'socialLinks'
    ];
    
    const data = {};
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        data[field] = field === 'postsPerPage' ? Number(req.body[field]) : req.body[field];
      }
    });

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