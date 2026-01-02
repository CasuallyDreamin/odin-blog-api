import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const commentTests = () => {
  describe("Comment Management Module", () => {
    const authCookie = inject("authCookie");
    
    let sharedCommentId;
    let sharedPostId;

    it("should prepare a post to comment on", async () => {
      const res = await request(app)
        .post("/api/posts")
        .set("Cookie", authCookie)
        .send({
          title: "Comment Test Post",
          content: "Post body content",
          published: true
        });
      
      sharedPostId = res.body.id;
      expect(sharedPostId).toBeDefined();
    });

    describe("POST /api/comments", () => {
      it("should allow public users to post a comment", async () => {
        const payload = {
          body: "This is a test comment",
          author: "John Doe",
          authorEmail: "john@example.com",
          postId: sharedPostId
        };

        const res = await request(app)
          .post("/api/comments")
          .send(payload);

        expect(res.statusCode).toBe(201);
        expect(res.body.body).toBe(payload.body);
        expect(res.body.isApproved).toBe(false);
        sharedCommentId = res.body.id;
      });

      it("should fail if postId is invalid", async () => {
        const res = await request(app)
          .post("/api/comments")
          .send({
            body: "Ghost comment",
            author: "Lost",
            postId: "00000000-0000-0000-0000-000000000000"
          });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
      });
    });

    describe("GET /api/comments", () => {
      it("should retrieve comments within the wrapper object", async () => {
        const res = await request(app).get("/api/comments");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("comments");
        expect(Array.isArray(res.body.comments)).toBe(true);
      });

      it("should return the count of pending comments for Admin", async () => {
        const res = await request(app)
          .get("/api/comments/count/pending")
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("count");
      });
    });

    describe("PUT /api/comments/:id/status", () => {
      it("should allow Admin to approve a comment using boolean field", async () => {
        const res = await request(app)
          .put(`/api/comments/${sharedCommentId}/status`)
          .set("Cookie", authCookie)
          .send({ isApproved: true });

        expect(res.statusCode).toBe(200);
        expect(res.body.isApproved).toBe(true);
      });
    });

    describe("DELETE /api/comments/:id", () => {
      it("should delete a comment and return 204", async () => {
        const res = await request(app)
          .delete(`/api/comments/${sharedCommentId}`)
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(204);
      });
    });
  });
};