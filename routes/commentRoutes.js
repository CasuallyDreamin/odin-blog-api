import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { 
  getAllComments,
  deleteComment,
  createComment,
  setStatus,
  getPendingCommentsCount
} from "../controllers/commentController.js"; 

const router = express.Router();

router.post("/", createComment);

router.get("/", getAllComments);
router.get("/count/pending", requireAdmin, getPendingCommentsCount);

router.delete("/:id", requireAdmin,deleteComment); 
router.put("/:id/status", requireAdmin, setStatus);

export default router;

