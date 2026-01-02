import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const mediaTests = () => {
  describe("Media Management Module", () => {
    const authCookie = inject("authCookie");
    let sharedMediaId;

    describe("POST /api/media", () => {
      it("should create a media record with valid admin credentials", async () => {
        const payload = {
          filePath: "/uploads/image.jpg",
          mimeType: "image/jpeg",
          altText: "A descriptive alt text"
        };

        const res = await request(app)
          .post("/api/media")
          .set("Cookie", authCookie)
          .send(payload);

        expect(res.statusCode).toBe(201);
        expect(res.body.filePath).toBe(payload.filePath);
        sharedMediaId = res.body.id;
      });

      it("should return 400 if an invalid postId is provided", async () => {
        const res = await request(app)
          .post("/api/media")
          .set("Cookie", authCookie)
          .send({
            filePath: "/test.png",
            mimeType: "image/png",
            postId: "00000000-0000-0000-0000-000000000000"
          });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Invalid postId");
      });
    });

    describe("GET /api/media", () => {
      it("should retrieve a raw list of all media assets", async () => {
        const res = await request(app).get("/api/media");
        
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
      });

      it("should fetch a specific media record by ID", async () => {
        const res = await request(app).get(`/api/media/${sharedMediaId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(sharedMediaId);
      });
    });
  });
};