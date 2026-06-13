# FinTrack Backend - Complete Implementation Guide

## 📋 Overview

This is a complete backend implementation for the FinTrack Personal Finance Tracker application built with:
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure Summary

```
server/
├── config/
│   └── db.js                           # MongoDB connection configuration
├── models/
│   ├── User.js                         # User schema
│   └── Transaction.js                  # Transaction schema
├── controllers/
│   ├── authController.js               # Register & Login logic
│   └── transactionController.js        # Transaction CRUD & Summary logic
├── middleware/
│   └── authMiddleware.js               # JWT token verification
├── routes/
│   ├── auth.js                         # Auth endpoints
│   └── transactions.js                 # Transaction endpoints
├── server.js                           # Express app setup
├── package.json                        # Dependencies & scripts
├── .env                                # Environment variables
├── .gitignore                          # Git ignore file
├── README.md                           # Full documentation
├── TESTING-CURL.md                     # cURL testing examples
├── QUICK-START.md                      # This file
├── FinTrack-Backend-API.postman_collection.json  # Postman collection
├── setup.bat                           # Windows setup script
└── setup.sh                            # Linux/Mac setup script
```

## ⚡ Quick Start

### Step 1: Prerequisites
- Node.js v14+ installed
- MongoDB Atlas account (free tier available)
- Postman or cURL for testing

### Step 2: Clone & Install

```bash
cd server
npm install
```

### Step 3: Configure Environment

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/fintrack
JWT_SECRET=your_secret_key_here
```

**Get MongoDB URI:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create cluster
3. Connect → Copy connection string
4. Update `MONGO_URI` in `.env`

### Step 4: Start Server

**Development (auto-reload):**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server runs on `http://localhost:5000`

### Step 5: Test API

**Option A: Postman (Recommended)**
1. Open Postman
2. File → Import → Select `FinTrack-Backend-API.postman_collection.json`
3. Click "Register" request, send
4. Copy token from response
5. Set token in Variables tab: `token` = `your_token_here`
6. Test other endpoints

**Option B: cURL**
See `TESTING-CURL.md` for all cURL examples

## 🔑 Key Features Implemented

### Authentication (✅ Complete)
- ✅ User Registration with email validation
- ✅ User Login with password verification
- ✅ JWT token generation (7-day expiry)
- ✅ Password hashing (bcryptjs, salt 10)
- ✅ Token verification middleware

### Transactions (✅ Complete)
- ✅ Create income/expense transactions
- ✅ Get all user transactions
- ✅ Get transaction summary (income/expense/balance)
- ✅ Update transactions
- ✅ Delete transactions
- ✅ User-specific access control

### Security (✅ Complete)
- ✅ JWT-based authorization
- ✅ CORS configured for frontend
- ✅ Password hashing with bcryptjs
- ✅ Input validation with express-validator
- ✅ Authorization middleware
- ✅ User ownership verification

### Error Handling (✅ Complete)
- ✅ Consistent JSON error responses
- ✅ Validation error messages
- ✅ Try-catch blocks in all controllers
- ✅ Proper HTTP status codes
- ✅ Descriptive error messages

## 🛣️ API Endpoints Summary

### Auth Endpoints
| Method | Route | Auth | Purpose |
|--------|-------|------|---------|
| POST | `/api/auth/register` | ❌ | Create new user account |
| POST | `/api/auth/login` | ❌ | Login user & get token |

### Transaction Endpoints (All require JWT)
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/summary` | Get income/expense summary |
| POST | `/api/transactions` | Create transaction |
| PUT | `/api/transactions/:id` | Update transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |

### Health
| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/health` | Check if server is running |

## 📊 Database Schemas

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,          // User's full name
  email: String,         // Unique, lowercase
  password: String,      // Hashed
  createdAt: Date        // Auto-generated
}
```

### Transaction Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,      // Reference to User
  type: String,          // 'income' or 'expense'
  category: String,      // e.g., "Salary", "Groceries"
  amount: Number,        // Must be positive
  description: String,   // Optional notes
  date: Date,            // Transaction date
  createdAt: Date        // Auto-generated
}
```

## 🧪 Testing Workflow

### 1. Register User
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": "...", "name": "John Doe", "email": "john@example.com" }
  }
}
```

### 2. Login User
```bash
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as register (returns token)
```

### 3. Create Transaction
```bash
POST /api/transactions
Headers: Authorization: Bearer <token>
{
  "type": "income",
  "category": "Salary",
  "amount": 5000,
  "description": "Monthly salary",
  "date": "2024-01-15"
}

Response:
{
  "success": true,
  "data": { "_id": "...", "type": "income", ... }
}
```

### 4. Get Summary
```bash
GET /api/transactions/summary
Headers: Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "income": 5000,
    "expense": 150,
    "balance": 4850
  }
}
```

## 🔒 Authentication Flow

1. **Register/Login** → Get JWT token
2. **Include token** in Authorization header: `Bearer <token>`
3. **Middleware verifies** token using `JWT_SECRET`
4. **Request proceeds** with `req.user` containing decoded data
5. **Token expires** after 7 days (user must login again)

## 🚨 Common Issues & Solutions

### MongoDB Connection Failed
- ✅ Check `MONGO_URI` is correct in `.env`
- ✅ Whitelist your IP in MongoDB Atlas (IP Whitelist tab)
- ✅ Ensure cluster is running
- ✅ Check username/password for special characters

### "No authorization token provided"
- ✅ Include `Authorization` header with value `Bearer <token>`
- ✅ Token must be from register or login response

### "Invalid token"
- ✅ Check token is complete (not truncated)
- ✅ Check token hasn't expired (7 days)
- ✅ Check `JWT_SECRET` matches server

### "Email already exists"
- ✅ Use a different email or delete user from MongoDB

### Port 5000 already in use
- ✅ Change PORT in `.env` file
- ✅ Or kill process: `lsof -i :5000` → `kill -9 <PID>`

## 📦 Dependencies Explained

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^4.18.2 | Web framework |
| mongoose | ^8.0.3 | MongoDB ODM |
| bcryptjs | ^2.4.3 | Password hashing |
| jsonwebtoken | ^9.1.2 | JWT tokens |
| cors | ^2.8.5 | Cross-origin requests |
| dotenv | ^16.3.1 | Environment variables |
| express-validator | ^7.0.0 | Input validation |
| nodemon | ^3.0.2 | Dev auto-reload |

## 🚀 Next Steps

### Immediate
- [ ] Update MongoDB connection string
- [ ] Test all endpoints with Postman
- [ ] Connect React frontend to APIs

### Short-term
- [ ] Add token refresh mechanism
- [ ] Implement pagination for transactions
- [ ] Add filtering by category/date range
- [ ] Add sorting options

### Medium-term
- [ ] Email verification on signup
- [ ] Password reset functionality
- [ ] Google OAuth integration
- [ ] Transaction export (CSV/PDF)

### Long-term
- [ ] Rate limiting
- [ ] API versioning
- [ ] Logging system
- [ ] Performance optimization
- [ ] Production deployment
- [ ] Mobile app backend

## 🔗 Frontend Integration

In your React frontend, use:

```javascript
const API_URL = 'http://localhost:5000/api';

// Register
async function register(name, email, password) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return response.json();
}

// Login
async function login(email, password) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.data.token); // Save token
  return data;
}

// Get transactions
async function getTransactions() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/transactions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

## 📚 Documentation Files

- **README.md** - Full API documentation
- **TESTING-CURL.md** - cURL command examples
- **QUICK-START.md** - This file
- **FinTrack-Backend-API.postman_collection.json** - Postman requests

## ❓ FAQ

**Q: How do I change the JWT expiry time?**
A: In `authController.js`, change `expiresIn: '7d'` to desired duration

**Q: How do I add more transaction categories?**
A: Transaction schema allows any string for category - customize in frontend

**Q: Can I deploy this to production?**
A: Yes! See deployment guides for Heroku, AWS Lambda, Google Cloud, Azure

**Q: How do I reset a user's password?**
A: Feature not yet implemented. See "Next Steps" section

**Q: Can multiple users use the same email?**
A: No - email has unique constraint in User schema

## 📞 Support & Resources

- Express.js Docs: https://expressjs.com/
- MongoDB Docs: https://docs.mongodb.com/
- JWT Docs: https://jwt.io/
- Mongoose Docs: https://mongoosejs.com/
- bcryptjs Docs: https://github.com/dcodeIO/bcrypt.js

## ✅ Checklist Before Going Live

- [ ] Update JWT_SECRET to strong random string
- [ ] Update CORS origin if frontend deployed elsewhere
- [ ] Enable MongoDB IP whitelist properly
- [ ] Test all endpoints thoroughly
- [ ] Set up logging system
- [ ] Add rate limiting middleware
- [ ] Implement input sanitization
- [ ] Add request validation
- [ ] Set up error monitoring
- [ ] Configure HTTPS
- [ ] Prepare deployment strategy
- [ ] Document API for team

---

**Happy coding! 🎉**

For questions or issues, refer to the README.md or TESTING-CURL.md files.
