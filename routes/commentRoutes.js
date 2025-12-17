import express from "express";
import { 
  getAllComments,
  deleteComment,
  createComment,
  setStatus
} from "../controllers/commentController.js"; 

const router = express.Router();

router.post("/", createComment);
router.get("/", getAllComments); 
router.delete("/:id", deleteComment); 
router.put("/:id/status", setStatus);

export default router;

