import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { prisma } from "./prisma/client.js";
import request from "supertest";
import app from "./app.js";

import { authTests } from "./test/auth.test.js";
import { categoryTests } from "./test/categories.test.js";
import { postTests } from "./test/posts.test.js";
import { tagTests } from "./test/tags.test.js";
import { commentTests } from "./test/comments.test.js";
import { projectTests } from "./test/projects.test.js";
import { quoteTests } from "./test/quotes.test.js";
import { mediaTests } from "./test/medias.test.js";
import { settingTests } from "./test/settings.test.js";
import { contactTests } from "./test/contact.test.js";
import { archiveTests } from "./test/archives.test.js";
import { postViewTests } from "./test/postViews.test.js";

describe("Sintopia API - Full System Integration", () => {
  
  beforeAll(async () => {
    await prisma.post.deleteMany();
    await prisma.category.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.project.deleteMany();
    await prisma.quote.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should verify API health and database connectivity", async () => {
    const res = await request(app).get("/api/");
    expect(res.statusCode).toBe(200);
    expect(res.body.online).toBe(true);
  });

  authTests();
  categoryTests();
  tagTests();
  postTests();
  commentTests();
  projectTests();
  quoteTests();
  mediaTests();
  settingTests();
  contactTests();
  archiveTests();
  postViewTests();
});