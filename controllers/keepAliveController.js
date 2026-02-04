import { prisma } from "../prisma/client.js";

export async function keepAlive(req, res) {
  try {
    const testRecord = await prisma.post.findFirst({
      select: { id: true },
    });

    res.json({
      success: true,
      message: 'DB is awake!',
      dbSample: testRecord || null,
    });
  } catch (err) {
    console.error('Keep-alive error:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to ping DB',
    });
  }
}
