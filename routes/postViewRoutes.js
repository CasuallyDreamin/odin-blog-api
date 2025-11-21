import express from "express";
import { getAllPostViews, getPostViewById, createPostView } from "../controllers/postViewController.js";

const router = express.Router();

router.get("/", getAllPostViews);
router.get("/:slug", getPostViewById);
router.post("/", createPostView);

export default router;
