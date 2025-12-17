import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getPosts, getPostBySlug , createPost, deletePost, updatePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.delete("/:id", requireAdmin, deletePost);
router.put("/:id", requireAdmin, updatePost);
router.post("/", requireAdmin, createPost);

export default router;