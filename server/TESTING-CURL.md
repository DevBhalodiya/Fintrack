# API Testing Guide with cURL

## Prerequisites
- Server running on http://localhost:5000
- cURL installed (comes with most systems)

## 1. Health Check
```bash
curl -X GET http://localhost:5000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

## 2. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Save the token for next requests!**

## 3. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65a1b2c3d4e5f6g7h8i9j0k1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

## 4. Create Income Transaction

Replace `YOUR_TOKEN` with the token from register/login response:

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "income",
    "category": "Salary",
    "amount": 5000,
    "description": "Monthly salary",
    "date": "2024-01-15"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Transaction created successfully",
  "data": {
    "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
    "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
    "type": "income",
    "category": "Salary",
    "amount": 5000,
    "description": "Monthly salary",
    "date": "2024-01-15T00:00:00.000Z",
    "createdAt": "2024-01-16T10:00:00.000Z"
  }
}
```

## 5. Create Expense Transaction

```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "expense",
    "category": "Groceries",
    "amount": 150,
    "description": "Weekly groceries",
    "date": "2024-01-16"
  }'
```

## 6. Get All Transactions

```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Transactions retrieved successfully",
  "data": [
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k2",
      "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "type": "income",
      "category": "Salary",
      "amount": 5000,
      "description": "Monthly salary",
      "date": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-16T10:00:00.000Z"
    },
    {
      "_id": "65a1b2c3d4e5f6g7h8i9j0k3",
      "userId": "65a1b2c3d4e5f6g7h8i9j0k1",
      "type": "expense",
      "category": "Groceries",
      "amount": 150,
      "description": "Weekly groceries",
      "date": "2024-01-16T00:00:00.000Z",
      "createdAt": "2024-01-16T10:05:00.000Z"
    }
  ]
}
```

## 7. Get Transaction Summary

```bash
curl -X GET http://localhost:5000/api/transactions/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
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

## 8. Update Transaction

Replace `TRANSACTION_ID` with the transaction ID from response:

```bash
curl -X PUT http://localhost:5000/api/transactions/TRANSACTION_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 200,
    "description": "Updated description"
  }'
```

## 9. Delete Transaction

```bash
curl -X DELETE http://localhost:5000/api/transactions/TRANSACTION_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

## Error Examples

### Invalid Email (Register)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "invalid-email",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "type": "field",
      "value": "invalid-email",
      "msg": "Please provide a valid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Password Too Short (Register)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "123"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "type": "field",
      "value": "123",
      "msg": "Password must be at least 6 characters long",
      "path": "password",
      "location": "body"
    }
  ]
}
```

### Invalid Credentials (Login)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

### Missing Authorization Header
```bash
curl -X GET http://localhost:5000/api/transactions
```

**Response:**
```json
{
  "success": false,
  "message": "No authorization token provided"
}
```

### Invalid Token Format
```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: InvalidToken"
```

**Response:**
```json
{
  "success": false,
  "message": "Invalid authorization header format. Use \"Bearer token\""
}
```

## Testing Workflow

1. **First, check if server is running:**
   ```bash
   curl -X GET http://localhost:5000/health
   ```

2. **Register a user and copy the token:**
   ```bash
   # Save token in a variable for reuse
   TOKEN=$(curl -X POST http://localhost:5000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "testpass123"
     }' | jq -r '.data.token')
   ```

3. **Use the token for subsequent requests:**
   ```bash
   curl -X POST http://localhost:5000/api/transactions \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer $TOKEN" \
     -d '{
       "type": "income",
       "category": "Freelance",
       "amount": 1000,
       "description": "Freelance project"
     }'
   ```

## Notes

- Replace `YOUR_TOKEN` with actual JWT token from register/login response
- Replace `TRANSACTION_ID` with actual transaction ID from response
- Use `jq` command to parse JSON responses (install with: `npm install -g jq` on Windows using chocolatey or WSL)
- All dates should be in ISO 8601 format or parseable by JavaScript Date()
- Transaction amounts must be positive numbers
- Transaction types are limited to "income" or "expense"
