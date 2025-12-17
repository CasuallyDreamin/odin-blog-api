import express from "express";
import { login, logout } from "../controllers/authController.js";
import { validate } from "../middleware/validate.js";

const router = express.Router();

router.post(
  "/login",
  validate({
    email: "email|required",
    password: "string|required",
  }),
  login
);

router.post("/logout", logout);

export default router;
