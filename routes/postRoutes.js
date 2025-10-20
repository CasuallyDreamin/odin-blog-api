import express from "express";
import { getPosts, getPostById, createPost } from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", createPost);

export default router;