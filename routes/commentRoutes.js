import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { 
  getAllComments,
  deleteComment,
  createComment,
  setStatus
} from "../controllers/commentController.js"; 

const router = express.Router();

router.post("/", createComment);
router.get("/", getAllComments); 
router.delete("/:id", requireAdmin,deleteComment); 
router.put("/:id/status", requireAdmin, setStatus);

export default router;

