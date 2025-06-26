const path = require('path');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectToDatabase = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// ✅ Serve static files from public folder
app.use(express.static(path.join(__dirname, '../public')));

let db;

// ✅ API route
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, firstname, lastname, email, phone, room FROM mikrotik');
    res.json(rows);
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ Catch-all: send index.html for all other routes (important for frontend)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// ✅ Start the server
(async () => {
  db = await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on ${PORT}`);
  });
})();
