const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// 1. Connection to your Database
const pool = new Pool({
  connectionString: 'postgres://frankfurt:P6ROik1jn232QPYNfiN9P8iwrekgroq5@dpg-d50osmhr0fns73904lf0-a/digitalearn',
  ssl: { rejectUnauthorized: false } 
});

// 2. Settings
app.use(express.json());
app.use(express.static('public')); // This looks for your index.html

// 3. The "Register" Route
app.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    const newUser = await pool.query('INSERT INTO users (email, balance) VALUES ($1, $2) RETURNING *', [email, 0.00]);
    res.json(newUser.rows[0]);
  } catch (err) { res.status(400).send("Error"); }
});

// 4. The "Earn" Route
app.post('/earn', async (req, res) => {
  const { email, amount } = req.body;
  try {
    const updated = await pool.query('UPDATE users SET balance = balance + $1 WHERE email = $2 RETURNING *', [amount, email]);
    res.json(updated.rows[0]);
  } catch (err) { res.status(500).send("Error"); }
});

// 5. The "Dashboard" Route (Forces the HTML to show)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`Server running on ${port}`));
