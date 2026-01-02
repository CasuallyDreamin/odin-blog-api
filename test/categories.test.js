import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const categoryTests = () => {
  describe("Category Management Module", () => {
    const authCookie = inject("authCookie");
    let sharedCategoryId;

    describe("POST /api/categories", () => {
      it("should reject creation for unauthenticated users", async () => {
        const res = await request(app)
          .post("/api/categories")
          .send({ name: "Unauthenticated" });
        
        expect(res.statusCode).toBe(401);
      });

      it("should create a new category and return 201", async () => {
        const res = await request(app)
          .post("/api/categories")
          .set("Cookie", authCookie)
          .send({ name: `Dev-${Date.now()}` });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        sharedCategoryId = res.body.id;
      });

      it("should fail when creating a duplicate category name", async () => {
        const name = "Unique-Name";
        await request(app)
          .post("/api/categories")
          .set("Cookie", authCookie)
          .send({ name });

        const res = await request(app)
          .post("/api/categories")
          .set("Cookie", authCookie)
          .send({ name });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
      });
    });

    describe("GET /api/categories", () => {
      it("should retrieve categories within the wrapper object", async () => {
        const res = await request(app).get("/api/categories");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("categories");
        expect(Array.isArray(res.body.categories)).toBe(true);
        expect(res.body).toHaveProperty("total");
      });

      it("should retrieve a single category by ID", async () => {
        const res = await request(app).get(`/api/categories/${sharedCategoryId}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(sharedCategoryId);
      });
    });

    describe("PUT /api/categories/:id", () => {
      it("should update a category name", async () => {
        const res = await request(app)
          .put(`/api/categories/${sharedCategoryId}`)
          .set("Cookie", authCookie)
          .send({ name: "Updated Name", id: sharedCategoryId });

        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Updated Name");
      });

      it("should return error when updating non-existent category", async () => {
        const res = await request(app)
          .put("/api/categories/00000000-0000-0000-0000-000000000000")
          .set("Cookie", authCookie)
          .send({ name: "Ghost" });

        expect(res.statusCode).toBeGreaterThanOrEqual(400);
      });
    });

    describe("DELETE /api/categories/:id", () => {
      it("should delete the category and return 204", async () => {
        const res = await request(app)
          .delete(`/api/categories/${sharedCategoryId}`)
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(204);

        const verify = await request(app).get(`/api/categories/${sharedCategoryId}`);
        expect(verify.statusCode).toBe(404);
      });
    });
  });
};