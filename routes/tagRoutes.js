import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { 
    getAllTags,
    getTagById, 
    createTag, 
    deleteTag } from "../controllers/tagController.js";

const router = express.Router();

router.get("/", getAllTags);
router.get("/:id", getTagById);

router.post("/", requireAdmin, createTag);

router.delete("/:id", requireAdmin, deleteTag)
;
export default router;
