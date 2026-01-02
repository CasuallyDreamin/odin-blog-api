import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const postTests = () => {
  describe("Post Management Module", () => {
    const authCookie = inject("authCookie");
    
    let sharedPostId;
    let sharedPostSlug;
    let sharedCategoryId;

    it("should prepare a category for relation tests", async () => {
      const res = await request(app)
        .post("/api/categories")
        .set("Cookie", authCookie)
        .send({ name: `Post-Category-${Date.now()}` });
      
      sharedCategoryId = res.body.id;
      expect(sharedCategoryId).toBeDefined();
    });

    describe("POST /api/posts", () => {
      it("should reject creation without authentication", async () => {
        const res = await request(app)
          .post("/api/posts")
          .send({ title: "Unauthenticated", content: "..." });
        
        expect(res.statusCode).toBe(401);
      });

      it("should reject creation with missing required fields", async () => {
        const res = await request(app)
          .post("/api/posts")
          .set("Cookie", authCookie)
          .send({ title: "Only Title" });
        
        expect(res.statusCode).toBe(400);
      });

      it("should create a post, generate a slug, and sanitize content", async () => {
        const payload = {
          title: "The Ultimate Vitest Guide",
          content: "<h1>Hello</h1><script>alert('xss')</script><p>World</p>",
          published: true,
          categoryIds: [sharedCategoryId]
        };

        const res = await request(app)
          .post("/api/posts")
          .set("Cookie", authCookie)
          .send(payload);

        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe(payload.title);
        expect(res.body.slug).toBe("the-ultimate-vitest-guide");
        
        expect(res.body.content).not.toContain("<script>");
        expect(res.body.categories).toHaveLength(1);
        
        sharedPostId = res.body.id;
        sharedPostSlug = res.body.slug;
      });
    });

    describe("GET /api/posts", () => {
      it("should fetch a paginated list of posts", async () => {
        const res = await request(app).get("/api/posts?page=1&limit=5");
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.posts)).toBe(true);
        expect(res.body.total).toBeGreaterThanOrEqual(1);
      });

      it("should fetch a single post by its slug", async () => {
        const res = await request(app).get(`/api/posts/${sharedPostSlug}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(sharedPostId);
      });

      it("should return 404 for a non-existent slug", async () => {
        const res = await request(app).get("/api/posts/this-slug-does-not-exist");
        expect(res.statusCode).toBe(404);
      });
    });

    describe("PUT /api/posts/:id", () => {
      it("should update post content and reflect changes", async () => {
        const updatePayload = {
          title: "Updated Vitest Guide",
          content: "New Content",
          published: false
        };

        const res = await request(app)
          .put(`/api/posts/${sharedPostId}`)
          .set("Cookie", authCookie)
          .send(updatePayload);

        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(updatePayload.title);
        expect(res.body.published).toBe(false);
      });

      it("should update the slug if the title changes", async () => {
        const res = await request(app)
          .put(`/api/posts/${sharedPostId}`)
          .set("Cookie", authCookie)
          .send({ title: "Brand New Title", content: "Same content" });

        expect(res.body.slug).toBe("brand-new-title");
        sharedPostSlug = res.body.slug;
      });
    });

    describe("DELETE /api/posts/:id", () => {
      it("should reject deletion without admin cookie", async () => {
        const res = await request(app).delete(`/api/posts/${sharedPostId}`);
        expect(res.statusCode).toBe(401);
      });

      it("should successfully delete the post", async () => {
        const res = await request(app)
          .delete(`/api/posts/${sharedPostId}`)
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(200);

        const verify = await request(app).get(`/api/posts/${sharedPostSlug}`);
        expect(verify.statusCode).toBe(404);
      });
    });
  });
};