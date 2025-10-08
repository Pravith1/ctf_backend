// Dependencies
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

// Internal modules
const connectDB = require('./utils/db');
const { initializeSocket } = require('./controllers/leaderController');

// Route imports
const adminRoutes = require('./Routes/adminRoutes');
const authRoutes = require('./Routes/authRoute');
const leaderboardRoutes = require('./Routes/leaderboardRoutes');
const submissionRoutes = require('./Routes/submissionRoutes');

// App setup
const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});
app.get('/api/cleanup', async (req, res) => {
  // perform cleanup logic here
  res.json({ message: 'Cleanup done' });
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/submission', submissionRoutes);

// Initialize Socket.IO for leaderboard
initializeSocket(io);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`🔗 User connected: ${socket.id}`);
  
  socket.emit('welcome', { message: 'Connected to CTF Leaderboard!' });
  
  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Database connection and server start
connectDB().then(() => {
  server.listen(process.env.PORT || 5000, (err) => {
    if (!err) {
      console.log(`🚀 Server is running on http://localhost:${process.env.PORT || 5000}`);
      console.log(`⚡ WebSocket server ready for real-time leaderboard!`);
    } else {
      console.log('❌ Failed to start the server:', err);
    }
  });
}).catch((error) => {
  console.error('❌ Database connection failed:', error);
  process.exit(1);
});