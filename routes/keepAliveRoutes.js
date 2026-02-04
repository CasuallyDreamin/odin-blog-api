import express from 'express';
import { keepAlive } from '../controllers/keepAliveController.js';

const router = express.Router();

router.get('/', keepAlive);

export default router;
