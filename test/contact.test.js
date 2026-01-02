import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const contactTests = () => {
  describe("Contact & Messaging Module", () => {
    const authCookie = inject("authCookie");
    let sharedMessageId;

    describe("POST /api/contact", () => {
      it("should allow a public user to submit a contact message", async () => {
        const payload = {
          name: "Client Name",
          email: "client@example.com",
          subject: "Project Inquiry",
          message: "I would like to discuss a new project."
        };

        const res = await request(app)
          .post("/api/contact")
          .send(payload);

        expect(res.statusCode).toBe(201);
        expect(res.body.data.name).toBe(payload.name);
        expect(res.body.data.isRead).toBe(false);
        sharedMessageId = res.body.data.id;
      });

      it("should reject submissions with missing required fields", async () => {
        const res = await request(app)
          .post("/api/contact")
          .send({
            name: "User",
            email: "only-email@test.com"
            // Missing message
          });

        expect(res.statusCode).toBe(400);
      });
    });

    describe("GET /api/contact (Admin)", () => {
      it("should retrieve all contact messages within the messages wrapper", async () => {
        const res = await request(app)
          .get("/api/contact")
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("messages");
        expect(Array.isArray(res.body.messages)).toBe(true);
      });

      it("should retrieve the unread messages count", async () => {
        const res = await request(app)
          .get("/api/contact/unread/count")
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("count");
      });
    });

    describe("PATCH & DELETE Operations", () => {
      it("should mark a message as read", async () => {
        const res = await request(app)
          .patch(`/api/contact/${sharedMessageId}/read`)
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.isRead).toBe(true);
      });

      it("should delete a contact message and return success message", async () => {
        const res = await request(app)
          .delete(`/api/contact/${sharedMessageId}`)
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Message deleted");
      });
    });
  });
};