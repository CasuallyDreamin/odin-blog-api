import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { getAllMedia, getMediaById, createMedia, updateMedia, deleteMedia } from "../controllers/mediaController.js";

const router = express.Router();

router.get("/", getAllMedia);

router.post("/", requireAdmin,createMedia);
router.get("/:id", getMediaById);

router.put("/:id", requireAdmin, updateMedia);
router.delete("/:id", requireAdmin, deleteMedia);

export default router;
