require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');

// Initialize Firebase / Firestore before loading routes
connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const transactionRoutes = require('./routes/transactions');

// Create Express app
const app = express();

// Middleware
const allowedOrigins = new Set([
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://[::1]:3000',
  'http://[::1]:3001',
]);

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (e.g., curl, Postman)
      if (!origin) return callback(null, true);

      // direct match against known allowed origins
      if (allowedOrigins.has(origin)) return callback(null, true);

      // be permissive for common local development hostnames + ports
      try {
        const parsed = new URL(origin);
        const hostname = parsed.hostname;
        const port = parsed.port || (parsed.protocol === 'https:' ? '443' : '80');

        const localHostnames = new Set(['localhost', '127.0.0.1', '::1']);
        const allowedLocalPorts = new Set(['3000', '3001']);

        // Allow localhost variants on dev ports
        if (localHostnames.has(hostname) && allowedLocalPorts.has(port)) {
          console.log(`Allowed CORS origin (localhost): ${origin}`);
          return callback(null, true);
        }

        // Allow common private LAN IP ranges on dev ports (e.g., 192.168.x.x, 10.x.x.x, 172.16-31.x.x)
        const isPrivateIp = /^(10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.)/.test(hostname);
        if (isPrivateIp && allowedLocalPorts.has(port)) {
          console.log(`Allowed CORS origin (private LAN): ${origin}`);
          return callback(null, true);
        }
      } catch (e) {
        // ignore parse errors
      }

      // Do not throw here; deny CORS and log for debugging instead
      console.warn('Blocked CORS origin:', origin);
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Free the port or set a different PORT in server/.env or your environment.`);
    console.error('To find and kill the process on Windows:');
    console.error('  1) netstat -ano | findstr :5000');
    console.error('  2) taskkill /PID <pid> /F');
    process.exit(1);
  }
  console.error('Server error:', err);
  process.exit(1);
});
