# FinTrack Backend API

Personal Finance Tracker Backend - Complete Node.js/Express API with JWT Authentication and MongoDB.

## Project Structure

```
/server
├── /models
│   ├── User.js              # User data model
│   └── Transaction.js       # Transaction data model
├── /routes
│   ├── auth.js              # Authentication routes
│   └── transactions.js      # Transaction CRUD routes
├── /controllers
│   ├── authController.js    # Auth business logic (register, login)
│   └── transactionController.js  # Transaction business logic
├── /middleware
│   └── authMiddleware.js    # JWT verification middleware
├── /config
│   └── db.js                # MongoDB connection config
├── server.js                # Express app setup & server start
├── package.json             # Dependencies
├── .env                     # Environment variables
└── FinTrack-Backend-API.postman_collection.json  # Postman collection
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. MongoDB Setup

1. Create a MongoDB Atlas account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get your connection string
3. Update the `MONGO_URI` in `.env` with your connection string

### 3. Configure Environment Variables

Edit `.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/fintrack?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 4. Start the Server

Development (with nodemon auto-reload):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server runs on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Register User
- **Route:** `POST /auth/register`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

#### 2. Login User
- **Route:** `POST /auth/login`
- **Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Transaction Endpoints (All require Authentication)

**Authorization Header:** `Bearer <your_jwt_token>`

#### 3. Get All Transactions
- **Route:** `GET /transactions`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "type": "income",
      "category": "Salary",
      "amount": 5000,
      "description": "Monthly salary",
      "date": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-16T10:00:00.000Z"
    }
  ]
}
```

#### 4. Get Transaction Summary
- **Route:** `GET /transactions/summary`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "message": "Transaction summary retrieved successfully",
  "data": {
    "income": 5000,
    "expense": 150,
    "balance": 4850
  }
}
```

#### 5. Create Transaction
- **Route:** `POST /transactions`
- **Headers:** 
  - `Authorization: Bearer <token>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "type": "expense",
  "category": "Groceries",
  "amount": 150,
  "description": "Weekly groceries",
  "date": "2024-01-16"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "type": "expense",
    "category": "Groceries",
    "amount": 150,
    "description": "Weekly groceries",
    "date": "2024-01-16T00:00:00.000Z",
    "createdAt": "2024-01-16T10:05:00.000Z"
  }
}
```

#### 6. Update Transaction
- **Route:** `PUT /transactions/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (Any fields you want to update)
```json
{
  "amount": 200,
  "description": "Updated description"
}
```
- **Response:**
```json
{
  "success": true,
  "message": "Transaction updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "type": "expense",
    "category": "Groceries",
    "amount": 200,
    "description": "Updated description",
    "date": "2024-01-16T00:00:00.000Z",
    "createdAt": "2024-01-16T10:05:00.000Z"
  }
}
```

#### 7. Delete Transaction
- **Route:** `DELETE /transactions/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

### Health Check Endpoint

#### 8. Health Check
- **Route:** `GET /health`
- **Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

## Testing with Postman

1. **Import Collection:**
   - Open Postman
   - Click "Import" → Select `FinTrack-Backend-API.postman_collection.json`

2. **Test Flow:**
   - Register a new user (POST /auth/register)
   - Copy the JWT token from the response
   - Set the token in Postman variables: In the collection, go to Variables tab and paste the token in the `token` variable
   - Create a transaction (POST /transactions) - paste your JWT token in the Authorization header
   - Get all transactions (GET /transactions)
   - Get summary (GET /transactions/summary)
   - Update transaction (PUT /transactions/:id)
   - Delete transaction (DELETE /transactions/:id)

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

### Common Error Responses:

- **400 Bad Request:** Invalid input or validation errors
- **401 Unauthorized:** Missing or invalid JWT token
- **403 Forbidden:** Unauthorized access to resource
- **404 Not Found:** Resource not found
- **500 Server Error:** Internal server error

## Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcryptjs (salt rounds: 10)
- ✅ Email validation
- ✅ CORS configured for frontend (http://localhost:3000)
- ✅ Input validation with express-validator
- ✅ Token expiration (7 days)
- ✅ Bearer token extraction from Authorization header
- ✅ User-specific transaction access (users can only access their own transactions)

## Required Environment Variables

```env
PORT                 - Server port (default: 5000)
MONGO_URI           - MongoDB connection string
JWT_SECRET          - Secret key for JWT signing
```

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date (default: now)
}
```

### Transaction Model
```javascript
{
  userId: ObjectId (reference to User),
  type: String (enum: ['income', 'expense']),
  category: String (required),
  amount: Number (required, positive),
  description: String (optional),
  date: Date (default: now),
  createdAt: Date (default: now)
}
```

## Dependencies

- **express:** Web framework
- **mongoose:** MongoDB object modeling
- **bcryptjs:** Password hashing
- **jsonwebtoken:** JWT token generation and verification
- **cors:** Cross-origin resource sharing
- **dotenv:** Environment variable management
- **express-validator:** Input validation and sanitization
- **nodemon:** Development auto-reload (dev dependency)

## Next Steps

1. Connect the frontend React app to these APIs
2. Implement token refresh mechanism
3. Add pagination to transactions list
4. Add filtering and sorting capabilities
5. Implement rate limiting for security
6. Add email verification
7. Add password reset functionality
8. Deploy to production (Heroku, AWS, Azure, etc.)

## Notes

- Make sure MongoDB connection string is correct in `.env`
- Change `JWT_SECRET` to a strong random string in production
- Update CORS origin if frontend is deployed elsewhere
- Test all endpoints before integrating with frontend
