# FinTrack - Personal Finance Tracker

A full-stack personal finance management web application built with React.js frontend and Node.js/Express backend.

## Project Structure

```
fintrack/
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Top navigation bar with logout
│   │   ├── Sidebar.js          # Left sidebar with navigation
│   │   └── PrivateRoute.js     # Protected route wrapper
│   ├── pages/
│   │   ├── Login.js            # Login page
│   │   ├── Register.js         # Registration page
│   │   ├── Dashboard.js        # Main dashboard
│   │   ├── Transactions.js     # Transaction management
│   │   └── Reports.js          # Financial reports
│   ├── context/
│   │   └── AuthContext.js      # Authentication context & state
│   ├── utils/
│   │   └── api.js              # Axios API client with interceptors
│   ├── App.js                  # Main app component with routing
│   ├── index.css               # Global styles & Tailwind directives
│   └── index.js                # React entry point
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── .env.local                  # Environment variables
└── package.json                # Dependencies
```

## Tech Stack

### Frontend
- **React.js** - UI library
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **Chart.js & react-chartjs-2** - Data visualization

## Features

### Authentication
- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Protected routes (Private Route wrapper)
- ✅ Automatic logout on token expiration
- ✅ Local storage persistence

### User Interface
- ✅ Responsive Navbar with user info and logout
- ✅ Collapsible Sidebar with navigation
- ✅ Professional Tailwind CSS styling
- ✅ Loading states and error handling

### Pages
- ✅ **Dashboard** - Overview of financial summary
- ✅ **Transactions** - Add and view transactions
- ✅ **Reports** - Financial analytics and reports
- ✅ **Login** - Authentication page
- ✅ **Register** - New user signup

## Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd fintrack
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The app will open at `http://localhost:3000`

## Available Scripts

- **`npm start`** - Run development server
- **`npm run build`** - Build for production
- **`npm test`** - Run tests
- **`npm run eject`** - Eject from Create React App (irreversible)

## Configuration

### Environment Variables

Edit `.env.local` to configure:

```
REACT_APP_API_URL=http://localhost:5000/api
```

## Next Steps

1. **Backend Setup** - Set up Node.js/Express server with authentication
2. **Database** - Configure MongoDB and Mongoose models
3. **API Integration** - Connect frontend to backend endpoints
4. **Charts** - Implement data visualization with Chart.js
5. **Features** - Add transaction filtering, categories, budgets

## License

MIT License - Feel free to use this project for learning purposes.
