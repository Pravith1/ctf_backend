const express = require('express');
const connectDB = require('./utils/db');
require('dotenv').config();
const adminRoutes = require('./Routes/adminRoutes');
const cookieParser = require('cookie-parser');

const app = express();
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000', // your frontend URL
    credentials: true // This is important for cookies
}));
// Basic middleware
app.use(express.json());
app.use(cookieParser());
app.use('/admin', adminRoutes);


// Auth routes
const authRoutes = require('./Routes/authRoute');
app.use('/auth', authRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, (err) => {
    if (!err) {
      console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);
    } else {
      console.log('Failed to start the server:', err);
    }
  });
}).catch((error) => {
  console.error('Database connection failed:', error);
  process.exit(1);
});