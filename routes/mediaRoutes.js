import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getAllMedia, getMediaById, createMedia } from "../controllers/mediaController.js";

const router = express.Router();

router.get("/", getAllMedia);
router.get("/:slug", getMediaById);
router.post("/", requireAdmin,createMedia);

export default router;
