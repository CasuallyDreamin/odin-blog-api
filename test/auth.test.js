import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const authTests = () => {
  describe("Authentication Module", () => {
    const authCookie = inject("authCookie");

    describe("POST /api/auth/login", () => {
      it("should reject login with missing credentials", async () => {
        const res = await request(app)
          .post("/api/auth/login")
          .send({});
        
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
      });

      it("should reject login with incorrect password", async () => {
        const res = await request(app)
          .post("/api/auth/login")
          .send({
            email: "admin@test.com",
            password: "wrong-password"
          });
        
        expect(res.statusCode).toBe(401);
      });

      it("should reject login with non-existent email", async () => {
        const res = await request(app)
          .post("/api/auth/login")
          .send({
            email: "fake@test.com",
            password: "password123"
          });
        
        expect(res.statusCode).toBe(401);
      });

      it("should successfully log in and set an httpOnly cookie", async () => {
        const res = await request(app)
          .post("/api/auth/login")
          .send({
            email: "admin@test.com",
            password: "password123"
          });
        
        expect(res.statusCode).toBe(200);
        expect(res.body.ok).toBe(true);
        
        const cookies = res.headers["set-cookie"];
        expect(cookies).toBeDefined();
        expect(cookies[0]).toContain("admin_token");
        expect(cookies[0]).toContain("HttpOnly");
      });
    });

    describe("POST /api/auth/logout", () => {
      it("should clear the admin_token cookie upon logout", async () => {
        const res = await request(app)
          .post("/api/auth/logout")
          .set("Cookie", authCookie);
        
        expect(res.statusCode).toBe(204);
        
        const cookies = res.headers["set-cookie"];
        expect(cookies[0]).toContain("admin_token=;");
      });
    });
  });
};