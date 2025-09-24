import { body, validationResult } from 'express-validator';

export const validateQuote = [
  body('quote')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Quote must be between 1 and 500 characters'),
  body('bookTitle')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Book title must be between 1 and 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author name must be between 1 and 100 characters'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];