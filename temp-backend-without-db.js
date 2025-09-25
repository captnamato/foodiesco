const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS setup
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Temporary routes without database
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Foodies API is running (No Database)!',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/recipes', (req, res) => {
  res.status(200).json({
    success: true,
    data: [
      {
        id: 1,
        title: "Sample Recipe",
        description: "This is a sample recipe for testing",
        ingredients: ["ingredient 1", "ingredient 2"]
      }
    ],
    message: "Sample data - MongoDB not connected yet"
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} (No Database)`);
});