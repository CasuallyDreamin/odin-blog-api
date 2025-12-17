import express from 'express';
import { requireAdmin } from '../middleware/auth.js';
import {
  getProjects,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectsController.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);
router.post('/', requireAdmin, createProject);
router.put('/:id', requireAdmin, updateProject);
router.delete('/:id', requireAdmin, deleteProject);

export default router;
