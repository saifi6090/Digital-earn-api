const express = require('express');
const { Pool } = require('pg');
const app = express();
app.use(express.static('public'));
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: 'postgres://frankfurt:P6ROik1jn232QPYNfiN9P8iwrekgroq5@dpg-d50osmhr0fns73904lf0-a/digitalearn',
  ssl: { rejectUnauthorized: false } 
});

app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.status(500).send('❌ Database Connection Error');
  }
});

app.listen(port, () => console.log(`Running on ${port}`));
// --- Line 21 Starts Here ---
app.use(express.json());

// REGISTER: Create a new user
app.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    const newUser = await pool.query(
      'INSERT INTO users (email, balance) VALUES ($1, $2) RETURNING *',
      [email, 0.00]
    );
    res.json({ message: "User created!", user: newUser.rows[0] });
  } catch (err) {
    res.status(400).send("Email already exists or error.");
  }
});

// EARN: Add money to balance
app.post('/earn', async (req, res) => {
  const { email, amount } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE email = $2 RETURNING *',
      [amount, email]
    );
    res.json({ message: "Earned!", balance: updated.rows[0].balance });
  } catch (err) {
    res.status(500).send("Error adding money.");
  }
});
