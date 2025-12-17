import express from 'express';
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
router.post('/', createProject);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router;
