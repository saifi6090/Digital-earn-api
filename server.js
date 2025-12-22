const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 1. Database Connection
const pool = new Pool({
  connectionString: 'postgres://frankfurt:P6ROik1jn232QPYNfiN9P8iwrekgroq5@dpg-d50osmhr0fns73904lf0-a/digitalearn',
  ssl: { rejectUnauthorized: false } 
});

// 2. Middleware
app.use(express.json());
// This tells the server to serve files from the main (root) folder
app.use(express.static(__dirname)); 

// 3. The Home Route
// This sends your index.html to the browser when you visit the link
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. The Earning Logic
app.post('/earn', async (req, res) => {
  const { email, amount } = req.body;
  try {
    // This updates the balance in your PostgreSQL database
    const updated = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE email = $2 RETURNING *',
      [amount, email]
    );

    if (updated.rows.length === 0) {
      // If user doesn't exist yet, create them
      const newUser = await pool.query(
        'INSERT INTO users (email, balance) VALUES ($1, $2) RETURNING *',
        [email, amount]
      );
      return res.json(newUser.rows[0]);
    }

    res.json(updated.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// 5. Start the Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
