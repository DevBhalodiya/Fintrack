# Environment Variables Documentation (Firebase)

## Template: .env

```env
# Server Configuration
PORT=5000

# Firebase service account JSON file path (recommended)
# Example: FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json

# Alternatively, set the full JSON contents in an env var (less recommended)
# FIREBASE_SERVICE_ACCOUNT={...JSON string...}

# JWT Configuration
# Use a strong random string for production
# You can generate one with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

## Variable Descriptions

### PORT
- **Type:** Number
- **Default:** 5000
- **Description:** The port on which the Express server will listen
- **Example:** `PORT=3001` (if port 5000 is already in use)

### FIREBASE_SERVICE_ACCOUNT_PATH
- **Type:** String (file path)
- **Default:** None (required)
- **Description:** Path to the Firebase service account JSON file downloaded from the Firebase Console. The server will load this file to initialize the Firebase Admin SDK.

### FIREBASE_SERVICE_ACCOUNT
- **Type:** String (JSON)
- **Default:** None
- **Description:** Instead of a file path, you can paste the entire service account JSON into this environment variable. This is less recommended but supported for some deployment environments.

### JWT_SECRET
- **Type:** String
- **Default:** None (required)
- **Description:** Secret key used to sign JWT tokens
- **Security Note:** Should be a long, random string for production

## Setup Instructions (Firebase)

1. **Create .env file in `/server` directory:**
   ```bash
   # Linux / macOS
   touch server/.env

   # Windows (PowerShell)
   ni server/.env
   ```

2. **Get a Firebase service account JSON:**
   - Go to https://console.firebase.google.com
   - Select your project (or create a new one)
   - Open Project Settings (gear icon) → Service accounts
   - Click "Generate new private key" and download the JSON file
   - Save the JSON in the server folder (e.g. `server/serviceAccountKey.json`) and set `FIREBASE_SERVICE_ACCOUNT_PATH` accordingly

   Alternatively, copy the JSON contents and set `FIREBASE_SERVICE_ACCOUNT` to the JSON string (escape newlines as needed).

3. **Set `JWT_SECRET`**
   - Generate a secure key:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```

4. **Start the server:**
   ```bash
   cd server
   npm install
   npm start
   # Should see: "Firebase initialized" and "Server running on port 5000"
   ```

## Example `.env` File

```env
PORT=5000
FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
JWT_SECRET=f4d3c1b5a9e8f7d2c3b1a9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d
```

## Security Notes

- ⚠️ **Never commit service account JSON or `.env` to version control**
- ⚠️ **Don't share `JWT_SECRET`** with anyone
- ⚠️ **Use environment-specific secrets** (different for dev, staging, prod)

## Troubleshooting

- If you see `FIREBASE_SERVICE_ACCOUNT_PATH or FIREBASE_SERVICE_ACCOUNT env var is required`, ensure your `.env` contains one of those variables and points to a valid JSON file or JSON string.
- If the server cannot authenticate with Firebase, re-download the service account JSON from the Firebase Console and verify the path.

---

For more information, see:
- README.md - Full API documentation
- QUICK-START.md - Quick setup guide
- server.js - How environment variables are used
