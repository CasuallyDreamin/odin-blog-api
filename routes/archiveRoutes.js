import express from 'express';
import { getArchive } from '../controllers/archiveController.js';

const router = express.Router();

router.get('/', getArchive);

export default router;
