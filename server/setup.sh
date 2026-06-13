#!/bin/bash

# FinTrack Backend Quick Setup Script for Linux/Mac

echo ""
echo "========================================"
echo "FinTrack Backend Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[1/4] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo ""
echo "[2/4] Checking .env file..."
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cat > .env << EOF
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/fintrack?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
EOF
    echo "Created .env file. Please update it with your MongoDB connection string!"
else
    echo ".env file already exists"
fi

echo ""
echo "[3/4] Setup complete!"
echo ""
echo "[4/4] Next steps:"
echo ""
echo "1. Update .env with your MongoDB Atlas connection string"
echo "   - Go to https://www.mongodb.com/cloud/atlas"
echo "   - Create a cluster and get your connection string"
echo "   - Replace MONGO_URI in .env"
echo ""
echo "2. Start the server:"
echo "   - Development: npm run dev"
echo "   - Production: npm start"
echo ""
echo "3. Test the API:"
echo "   - Import FinTrack-Backend-API.postman_collection.json into Postman"
echo "   - Or use curl commands from TESTING-CURL.md"
echo ""
echo "4. Read the README.md for full API documentation"
echo ""
echo "========================================"
