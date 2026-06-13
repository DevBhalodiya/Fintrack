@echo off
REM FinTrack Backend Quick Setup Script for Windows

echo.
echo ========================================
echo FinTrack Backend Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/4] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Checking .env file...
if not exist .env (
    echo Creating .env file from template...
    (
        echo PORT=5000
        echo MONGO_URI=mongodb+srv://your_username:your_password@cluster0.mongodb.net/fintrack?retryWrites=true^&w=majority
        echo JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
    ) > .env
    echo Created .env file. Please update it with your MongoDB connection string!
) else (
    echo .env file already exists
)

echo.
echo [3/4] Setup complete!
echo.
echo [4/4] Next steps:
echo.
echo 1. Update .env with your MongoDB Atlas connection string
echo    - Go to https://www.mongodb.com/cloud/atlas
echo    - Create a cluster and get your connection string
echo    - Replace MONGO_URI in .env
echo.
echo 2. Start the server:
echo    - Development: npm run dev
echo    - Production: npm start
echo.
echo 3. Test the API:
echo    - Import FinTrack-Backend-API.postman_collection.json into Postman
echo    - Or use curl commands from TESTING-CURL.md
echo.
echo 4. Read the README.md for full API documentation
echo.
echo ========================================
pause
