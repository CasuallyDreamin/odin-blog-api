import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const archiveTests = () => {
  describe("Archive Module", () => {
    const authCookie = inject("authCookie");

    it("should prepare content for the archive", async () => {
      await request(app)
        .post("/api/posts")
        .set("Cookie", authCookie)
        .send({ title: "Archive Post", content: "Body", published: true });
    });

    describe("GET /api/archives", () => {
      it("should retrieve a unified list of items publicly", async () => {
        const res = await request(app).get("/api/archives");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("items");
        expect(Array.isArray(res.body.items)).toBe(true);
      });

      it("should contain correctly normalized fields", async () => {
        const res = await request(app).get("/api/archives");
        
        if (res.body.items.length > 0) {
          const item = res.body.items[0];
          expect(item).toHaveProperty("type");
          expect(item).toHaveProperty("url");
          expect(item).toHaveProperty("date");
          expect(Array.isArray(item.tags)).toBe(true);
          expect(Array.isArray(item.categories)).toBe(true);
        }
      });

      it("should handle empty database gracefully", async () => {
        const res = await request(app).get("/api/archives");
        expect(res.statusCode).toBe(200);
        expect(res.body.items).toBeDefined();
      });
    });
  });
};