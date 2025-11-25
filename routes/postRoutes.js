import express from "express";
import { getPosts, getPostBySlug , createPost, deletePost, updatePost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:slug", getPostBySlug);
router.delete("/:id", deletePost);
router.put("/:id", updatePost);
router.post("/", createPost);

export default router;