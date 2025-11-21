import express from "express";
import { getAllCategories, getCategoryById, createCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:slug", getCategoryById);
router.post("/", createCategory);

export default router;
