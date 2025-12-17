import express from "express";
import { getAllTags, getTagById, createTag } from "../controllers/tagController.js";

const router = express.Router();

router.get("/", getAllTags);
router.post("/", createTag);
router.get("/:id", getTagById);

export default router;
