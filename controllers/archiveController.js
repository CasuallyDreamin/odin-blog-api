import { prisma } from "../prisma/client.js";

function normalizePost(p) {
  return {
    id: p.id,
    type: 'post',
    title: p.title,
    url: `/posts/${p.slug}`,
    date: p.createdAt,
    tags: (p.tags || []).map(t => t.name),
    raw: p
  };
}

function normalizeProject(p) {
  return {
    id: p.id,
    type: 'project',
    title: p.title,
    url: `/projects/${p.slug}`,
    date: p.createdAt,
    tags: (p.tags || []).map(t => t.name),
    raw: p
  };
}

function normalizeQuote(q) {
  return {
    id: q.id,
    type: 'quote',
    title: q.content.length > 80 ? q.content.substring(0, 80) + '…' : q.content,
    url: `/quotes/${q.id}`,
    date: q.createdAt,
    tags: (q.tags || []).map(t => t.name),
    raw: q
  };
}

export const getArchive = async (req, res, next) => {
  try {
    const { limit = 1000, page = 1 } = req.query;
    const take = Math.min(parseInt(limit) || 1000, 5000);
    const skip = (parseInt(page) - 1) * take;

    const [posts, projects, quotes] = await Promise.all([
      prisma.post.findMany({ where: {}, include: { tags: true }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.project.findMany({ where: {}, include: { tags: true }, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.quote.findMany({ where: {}, include: { tags: true }, orderBy: { createdAt: 'desc' }, skip, take })
    ]);

    const normalized = [
      ...posts.map(normalizePost),
      ...projects.map(normalizeProject),
      ...quotes.map(normalizeQuote)
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json({
      total: normalized.length,
      items: normalized
    });
  } catch (err) {
    next(err);
  }
};
