import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const tagTests = () => {
  describe("Tag Management Module", () => {
    const authCookie = inject("authCookie");
    let sharedTagId;

    describe("POST /api/tags", () => {
      it("should create a new tag with valid admin credentials", async () => {
        const res = await request(app)
          .post("/api/tags")
          .set("Cookie", authCookie)
          .send({ name: `TestTag-${Date.now()}` });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        sharedTagId = res.body.id;
      });

      it("should prevent creating a duplicate tag name", async () => {
        const name = "UniqueTag";
        await request(app)
          .post("/api/tags")
          .set("Cookie", authCookie)
          .send({ name });

        const res = await request(app)
          .post("/api/tags")
          .set("Cookie", authCookie)
          .send({ name });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toContain("already exists");
      });
    });

    describe("GET /api/tags", () => {
      it("should retrieve a list within the tags wrapper", async () => {
        const res = await request(app).get("/api/tags");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("tags");
        expect(Array.isArray(res.body.tags)).toBe(true);
        expect(res.body).toHaveProperty("totalPages");
      });

      it("should fetch a specific tag by its ID", async () => {
        const res = await request(app).get(`/api/tags/${sharedTagId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(sharedTagId);
      });
    });
  });
};