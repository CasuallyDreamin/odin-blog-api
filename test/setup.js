import request from "supertest";
import bcrypt from "bcrypt";
import app from "../app.js";
import { prisma } from "../prisma/client.js";

export async function setup({ provide }) {
  const TEST_ADMIN = {
    email: "admin@test.com",
    password: "password123"
  };

  const hashedPassword = await bcrypt.hash(TEST_ADMIN.password, 10);
  
  await prisma.admin.upsert({
    where: { email: TEST_ADMIN.email },
    update: {},
    create: {
      id: "test-admin-uuid",
      email: TEST_ADMIN.email,
      password: hashedPassword,
      secret: "test-system-secret"
    },
  });

  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
  
  const cookie = loginRes.headers["set-cookie"];

  provide('authCookie', cookie);

  return async () => {
    await prisma.$disconnect();
  };
}