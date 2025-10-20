import request from "supertest";
import { prisma } from "./app.js";
import app from "./app.js";

let testPostId, testCategoryId, testTagId, testMediaId, testCommentId, testPostViewId;

describe("Sintopia API", () => {
  afterAll(async () => {
    if (testPostViewId) await prisma.postView.delete({ where: { id: testPostViewId } });
    if (testMediaId) await prisma.media.delete({ where: { id: testMediaId } });
    if (testCommentId) await prisma.comment.delete({ where: { id: testCommentId } });
    if (testPostId) await prisma.post.delete({ where: { id: testPostId } });
    if (testCategoryId) await prisma.category.delete({ where: { id: testCategoryId } });
    if (testTagId) await prisma.tag.delete({ where: { id: testTagId } });
    await prisma.$disconnect();
  });

  it("should create a category", async () => {
    const res = await request(app).post("/api/categories").send({ name: "TestCategory" });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("TestCategory");
    testCategoryId = res.body.id;
  });

  it("should get all categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.categories || res.body)).toBe(true);
  });

  it("should create a tag", async () => {
    const res = await request(app).post("/api/tags").send({ name: "TestTag" });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("TestTag");
    testTagId = res.body.id;
  });

  it("should get all tags", async () => {
    const res = await request(app).get("/api/tags");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.tags || res.body)).toBe(true);
  });

  it("should create a post", async () => {
    const postData = {
      title: "Test Post",
      layout: { div: { p: "test" } },
      published: true,
      categoryIds: [testCategoryId],
      tagIds: [testTagId],
    };
    const res = await request(app).post("/api/posts").send(postData);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe("Test Post");
    testPostId = res.body.id;
  });

  it("should get all posts", async () => {
    const res = await request(app).get("/api/posts");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.posts || res.body)).toBe(true);
  });

  it("should get a post by ID", async () => {
    const res = await request(app).get(`/api/posts/${testPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(testPostId);
  });

  it("should create a comment", async () => {
    const res = await request(app)
      .post("/api/comments")
      .send({ author: "Tester", body: "Test comment", postId: testPostId });
    expect(res.statusCode).toBe(201);
    expect(res.body.body).toBe("Test comment");
    testCommentId = res.body.id;
  });

  it("should create media", async () => {
    const res = await request(app)
      .post("/api/medias")
      .send({ filePath: "/test.jpg", mimeType: "image/jpeg", postId: testPostId });
    expect(res.statusCode).toBe(201);
    testMediaId = res.body.id;
  });

  it("should create a post view", async () => {
    const res = await request(app)
      .post("/api/postViews")
      .send({ postId: testPostId, ipHash: "abc123", userAgent: "Jest" });
    expect(res.statusCode).toBe(201);
    testPostViewId = res.body.id;
  });

  it("should get post analytics", async () => {
    const res = await request(app).get(`/api/analytics/${testPostId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.postId).toBe(testPostId);
  });

  it("should get overall analytics", async () => {
    const res = await request(app).get("/api/analytics");
    expect(res.statusCode).toBe(200);
    expect(res.body.totalPosts).toBeGreaterThanOrEqual(1);
  });
});
