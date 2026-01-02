import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const settingTests = () => {
  describe("System Settings Module", () => {
    const authCookie = inject("authCookie");

    describe("GET /api/settings", () => {
      it("should retrieve system settings publicly", async () => {
        const res = await request(app).get("/api/settings");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("id", "singleton");
      });
    });

    describe("PUT /api/settings", () => {
      it("should update site configuration and coerce numbers", async () => {
        const updatePayload = {
          blogName: "Sintopia Premium",
          postsPerPage: "20",
          theme: "dark"
        };

        const res = await request(app)
          .put("/api/settings")
          .set("Cookie", authCookie)
          .send(updatePayload);

        expect(res.statusCode).toBe(200);
        expect(res.body.blogName).toBe("Sintopia Premium");
        expect(res.body.postsPerPage).toBe(20);
      });

      it("should persist complex JSON data like social links", async () => {
        const socialLinks = { twitter: "@sintopia" };

        const res = await request(app)
          .put("/api/settings")
          .set("Cookie", authCookie)
          .send({ socialLinks });

        expect(res.statusCode).toBe(200);
        expect(res.body.socialLinks).toEqual(socialLinks);
      });
    });
  });
};