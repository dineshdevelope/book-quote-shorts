import express from 'express';
import {
  getQuotes,
  getQuote,
  createQuote,
  updateQuote,
  deleteQuote,
  likeQuote,
  getQuoteStats
} from '../controllers/quoteController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateQuote } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(getQuotes)
  .post(protect, authorize('admin'), validateQuote, createQuote);

router.route('/stats')
  .get(protect, authorize('admin'), getQuoteStats);

router.route('/:id')
  .get(getQuote)
  .put(protect, authorize('admin'), validateQuote, updateQuote)
  .delete(protect, authorize('admin'), deleteQuote);

router.route('/:id/like')
  .post(protect, likeQuote);

export default router;