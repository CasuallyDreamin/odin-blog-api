import express from "express";
import { requireAdmin } from "../middleware/auth.js";
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById); 
router.post("/", requireAdmin, createCategory);
router.put("/:id", requireAdmin,updateCategory); 
router.delete("/:id", requireAdmin, deleteCategory); 

export default router;