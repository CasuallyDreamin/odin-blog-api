import express from "express";
import { getComments, getCommentById, createComment } from "../controllers/commentController.js";

const router = express.Router();

router.get("/", getComments);
router.get("/:slug", getCommentById);
router.post("/", createComment);

export default router;
