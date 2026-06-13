const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { getDb } = require('../config/db');

// Register Controller
exports.register = async (req, res) => {
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

    const { name, email, password } = req.body;
    const emailLower = email.toLowerCase();

    const db = getDb();
    const usersRef = db.collection('users');

    // Check if user already exists
    const existing = await usersRef.where('email', '==', emailLower).limit(1).get();
    if (!existing.empty) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }

    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in Firestore
    const docRef = await usersRef.add({
      name,
      email: emailLower,
      password: hashedPassword,
      createdAt: new Date(),
    });

    // Generate JWT token
    const payload = {
      userId: docRef.id,
      email: emailLower,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: docRef.id,
          name,
          email: emailLower,
        },
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
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

    const { email, password } = req.body;
    const emailLower = email.toLowerCase();

    const db = getDb();
    const usersRef = db.collection('users');

    // Find user by email
    const snapshot = await usersRef.where('email', '==', emailLower).limit(1).get();
    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const payload = {
      userId: userDoc.id,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: userDoc.id,
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};
