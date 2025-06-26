
require('dotenv').config();
const express = require('express');
console.log("ENV USER:", process.env.DB_USER);
const cors = require('cors');
const connectToDatabase = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());

let db;

app.get('/api/users', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, firstname, lastname, email, phone, room FROM mikrotik');
    res.json(rows);
  } catch (err) {
    console.error("Query failed:", err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


(async () => {
  db = await connectToDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
})();
