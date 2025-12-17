import express from 'express';
import { requireAdmin } from '../middleware/auth.js';
import {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote
} from '../controllers/quotesController.js';

const router = express.Router();

router.get('/', getQuotes);
router.get('/:id', getQuoteById);
router.post('/', requireAdmin, createQuote);
router.put('/:id', updateQuote);
router.delete('/:id', deleteQuote);

export default router;
