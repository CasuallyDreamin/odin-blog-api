import { describe, it, expect, inject } from "vitest";
import request from "supertest";
import app from "../app.js";

export const projectTests = () => {
  describe("Project Portfolio Module", () => {
    const authCookie = inject("authCookie");
    let sharedProjectId;
    let sharedProjectSlug;

    describe("POST /api/projects", () => {
      it("should create a project with sanitized content and slug", async () => {
        const res = await request(app)
          .post("/api/projects")
          .set("Cookie", authCookie)
          .send({
            title: "New Project",
            content: "<p>Content</p><script>alert(1)</script>"
          });

        expect(res.statusCode).toBe(201);
        expect(res.body.content).toBe("<p>Content</p>");
        expect(res.body.slug).toBe("new-project");
        sharedProjectId = res.body.id;
        sharedProjectSlug = res.body.slug;
      });
    });

    describe("GET /api/projects", () => {
      it("should list projects within the projects wrapper", async () => {
        const res = await request(app).get("/api/projects");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("projects");
        expect(Array.isArray(res.body.projects)).toBe(true);
      });

      it("should find a project by slug", async () => {
        const res = await request(app).get(`/api/projects/${sharedProjectSlug}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(sharedProjectId);
      });
    });

    describe("DELETE /api/projects/:id", () => {
      it("should delete and return a success message", async () => {
        const res = await request(app)
          .delete(`/api/projects/${sharedProjectId}`)
          .set("Cookie", authCookie);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toContain("successfully");
      });
    });
  });
};