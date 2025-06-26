const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();
const connectToDatabase = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Serve static frontend from "public" folder
app.use(express.static(path.join(__dirname, '../public')));

let db;

// API endpoint
app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, firstname, lastname, email, phone, room FROM mikrotik');
    res.json(rows);
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ✅ No wildcard route needed unless you're using React Router
(async () => {
  db = await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
