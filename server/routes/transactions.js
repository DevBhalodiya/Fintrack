const express = require('express');
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Get all transactions
router.get('/', transactionController.getTransactions);

// Get transaction summary
router.get('/summary', transactionController.getTransactionSummary);

// Create transaction
router.post(
  '/',
  [
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be either "income" or "expense"'),
    body('category').trim().notEmpty().withMessage('Category is required'),
    body('amount')
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
    body('description').optional().trim(),
  ],
  transactionController.createTransaction
);

// Update transaction
router.put(
  '/:id',
  [
    body('type')
      .optional()
      .isIn(['income', 'expense'])
      .withMessage('Type must be either "income" or "expense"'),
    body('category').optional().trim().notEmpty(),
    body('amount')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Amount must be a positive number'),
    body('description').optional().trim(),
  ],
  transactionController.updateTransaction
);

// Delete transaction
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
