const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

let dbInstance = null;

const connectDB = () => {
  try {
    let serviceAccount;

    if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
      // Resolve relative paths against the current working directory
      const rawPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
      const resolvedPath = path.isAbsolute(rawPath)
        ? rawPath
        : path.join(process.cwd(), rawPath);

      if (!fs.existsSync(resolvedPath)) {
        console.error(
          `Firebase service account file not found at ${resolvedPath}.\nSet FIREBASE_SERVICE_ACCOUNT_PATH to the correct path (absolute or relative to server working directory), or use FIREBASE_SERVICE_ACCOUNT with the JSON contents.`
        );
        process.exit(1);
      }

      serviceAccount = require(resolvedPath);
    } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      console.error('FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT env var is required');
      process.exit(1);
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    dbInstance = admin.firestore();
    console.log('Firebase initialized');
    return dbInstance;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    process.exit(1);
  }
};

const getDb = () => {
  if (!dbInstance) {
    throw new Error('Firestore not initialized. Call connectDB() first.');
  }
  return dbInstance;
};

module.exports = { connectDB, getDb };
