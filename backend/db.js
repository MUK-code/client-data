const mysql = require('mysql2/promise');
require('dotenv').config();

let connection;

async function connectToDatabase() {
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });
    console.log("MySQL Connected (async/await)");
    return connection;
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
}

module.exports = connectToDatabase;
