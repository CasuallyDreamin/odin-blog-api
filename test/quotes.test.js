import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const quoteTests = () => {
  describe("Quote Management Module", () => {
    const authCookie = inject("authCookie");
    let sharedQuoteId;

    describe("POST /api/quotes", () => {
      it("should create a new quote and sanitize content", async () => {
        const payload = {
          content: "<blockquote>Success is not final</blockquote>",
          author: "Winston Churchill"
        };

        const res = await request(app)
          .post("/api/quotes")
          .set("Cookie", authCookie)
          .send(payload);

        expect(res.statusCode).toBe(201);
        expect(res.body.content).toBe("<blockquote>Success is not final</blockquote>");
        sharedQuoteId = res.body.id;
      });

      it("should reject creation if content is missing", async () => {
        const res = await request(app)
          .post("/api/quotes")
          .set("Cookie", authCookie)
          .send({ author: "No Content" });

        expect(res.statusCode).toBe(400);
      });
    });

    describe("GET /api/quotes", () => {
      it("should retrieve all quotes within the quotes wrapper", async () => {
        const res = await request(app).get("/api/quotes");
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("quotes");
        expect(Array.isArray(res.body.quotes)).toBe(true);
      });

      it("should fetch a specific quote by ID", async () => {
        const res = await request(app).get(`/api/quotes/${sharedQuoteId}`);
        
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(sharedQuoteId);
      });
    });

    describe("PUT /api/quotes/:id", () => {
      it("should update a quote and return 200", async () => {
        const res = await request(app)
          .put(`/api/quotes/${sharedQuoteId}`)
          .set("Cookie", authCookie)
          .send({ 
            content: "Updated Content",
            author: "New Author" 
          });

        expect(res.statusCode).toBe(200);
        expect(res.body.author).toBe("New Author");
      });
    });

    describe("DELETE /api/quotes/:id", () => {
      it("should delete the quote and return success message", async () => {
        const res = await request(app)
          .delete(`/api/quotes/${sharedQuoteId}`)
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toContain("successfully");
      });
    });
  });
};