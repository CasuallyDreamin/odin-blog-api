import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getAllTags, getTagById, createTag } from "../controllers/tagController.js";

const router = express.Router();

router.get("/", getAllTags);
router.get("/:id", getTagById);
router.post("/", requireAdmin,createTag);

export default router;
