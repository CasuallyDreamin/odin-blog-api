import express from 'express';
import { 
  submitMessage, 
  getMessages, 
  markAsRead, 
  deleteMessage 
} from '../controllers/contactController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', submitMessage);

router.get('/', requireAdmin, getMessages);
router.patch('/:id/read', requireAdmin, markAsRead);
router.delete('/:id', requireAdmin, deleteMessage);

export default router;