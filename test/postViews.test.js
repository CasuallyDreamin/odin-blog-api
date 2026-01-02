import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const postViewTests = () => {
  let sharedPostId; 

  describe("Post Analytics Module", () => {
    const authCookie = inject("authCookie");

    it("should prepare a post for analytics tracking", async () => {
      const res = await request(app)
        .post("/api/posts")
        .set("Cookie", authCookie)
        .send({
          title: "Analytics Test",
          content: "Content",
          published: true,
          slug: "analytics-test-" + Date.now()
        });
      
      sharedPostId = res.body.id;
      expect(sharedPostId).toBeDefined();
    });

    describe("POST /api/postViews", () => {
      it("should record a new view and return 201", async () => {
        const res = await request(app)
          .post("/api/postViews")
          .send({ postId: sharedPostId });

        expect(res.statusCode).toBe(201);
        expect(res.body.postId).toBe(sharedPostId);
      });
    });

    describe("GET /api/postViews (Overall Stats)", () => {
      it("should retrieve global analytics including total views and post count", async () => {
        const res = await request(app).get("/api/postViews");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("totalPosts");
        expect(res.body).toHaveProperty("totalViews");
        expect(Array.isArray(res.body.viewsPerDay)).toBe(true);
      });
    });

    describe("GET /api/postViews/:id (Specific Post Stats)", () => {
      it("should retrieve view data for a specific postId", async () => {
        const res = await request(app).get(`/api/postViews/${sharedPostId}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.postId).toBe(sharedPostId);
        expect(res.body).toHaveProperty("views");
      });
    });
  });
};