import express from 'express';
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
router.post('/', createQuote);
router.put('/:id', updateQuote);
router.delete('/:id', deleteQuote);

export default router;
