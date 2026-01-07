import express from 'express';
import { getStats } from './statsController.js';

const router = express.Router();

router.get('/', getStats);

export default router;
