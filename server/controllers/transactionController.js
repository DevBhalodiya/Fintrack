const { validationResult } = require('express-validator');
const { getDb } = require('../config/db');

// Get all transactions for a user
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const db = getDb();
    const snapshot = await db
      .collection('transactions')
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();

    const transactions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    res.status(200).json({
      success: true,
      message: 'Transactions retrieved successfully',
      data: transactions,
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions',
      error: error.message,
    });
  }
};

// Create a new transaction
exports.createTransaction = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array(),
      });
    }

    const { type, category, amount, description, date } = req.body;
    const userId = req.user.userId;

    const db = getDb();
    const docRef = await db.collection('transactions').add({
      userId,
      type,
      category,
      amount: Number(amount),
      description: description || '',
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    });

    const created = await docRef.get();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { id: docRef.id, ...created.data() },
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating transaction',
      error: error.message,
    });
  }
};

// Update a transaction
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const db = getDb();
    const docRef = db.collection('transactions').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const existing = docSnap.data();
    if (existing.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction',
      });
    }

    // Prepare update payload
    const updatePayload = { ...req.body };
    if (updatePayload.date) updatePayload.date = new Date(updatePayload.date);

    await docRef.update(updatePayload);
    const updated = await docRef.get();

    res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: { id: updated.id, ...updated.data() },
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating transaction',
      error: error.message,
    });
  }
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const db = getDb();
    const docRef = db.collection('transactions').doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    const existing = docSnap.data();
    if (existing.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction',
      });
    }

    await docRef.delete();

    res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting transaction',
      error: error.message,
    });
  }
};

// Get transaction summary (total income/expense)
exports.getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user.userId;

    const db = getDb();
    const snapshot = await db.collection('transactions').where('userId', '==', userId).get();

    let income = 0;
    let expense = 0;

    snapshot.forEach((doc) => {
      const data = doc.data();
      const amt = Number(data.amount) || 0;
      if (data.type === 'income') income += amt;
      else if (data.type === 'expense') expense += amt;
    });

    res.status(200).json({
      success: true,
      message: 'Transaction summary retrieved successfully',
      data: {
        income,
        expense,
        balance: income - expense,
      },
    });
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching summary',
      error: error.message,
    });
  }
};
