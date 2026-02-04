import { prisma } from "../prisma/client.js";

export async function getStats(req, res) {
  try {
    const [
      totalPosts,
      totalComments,
      totalCategories,
      totalTags,
      totalQuotes,
      totalProjects,
      totalContacts
    ] = await Promise.all([
      prisma.post.count(),
      prisma.comment.count(),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.quote.count(),
      prisma.project.count(),
      prisma.contactMessage.count()
    ]);

    return res.json({
      posts: totalPosts,
      comments: totalComments,
      categories: totalCategories,
      tags: totalTags,
      quotes: totalQuotes,
      projects: totalProjects,
      contacts: totalContacts
    });
  } catch (err) {
    console.error('Stats fetch failed:', err);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}
