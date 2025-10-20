import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        categories: true,
        tags: true,
        comments: true,
        media: true,
        views: true,
      },
    });
    console.log("Posts fetched successfully:");
    console.log(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
