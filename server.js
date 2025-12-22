const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: 'postgres://frankfurt:P6ROik1jn232QPYNfiN9P8iwrekgroq5@dpg-d50osmhr0fns73904lf0-a/digitalearn',
  ssl: { rejectUnauthorized: false } 
});

app.use(express.json());

// FIXED LINE: This tells the server to look deeper into your double folder
app.use(express.static(path.join(__dirname, 'public', 'public')));

app.post('/register', async (req, res) => {
  const { email } = req.body;
  try {
    const newUser = await pool.query('INSERT INTO users (email, balance) VALUES ($1, $2) RETURNING *', [email, 0.00]);
    res.json(newUser.rows[0]);
  } catch (err) { res.status(400).send("Error"); }
});

app.post('/earn', async (req, res) => {
  const { email, amount } = req.body;
  try {
    const updated = await pool.query('UPDATE users SET balance = balance + $1 WHERE email = $2 RETURNING *', [amount, email]);
    res.json(updated.rows[0]);
  } catch (err) { res.status(500).send("Error"); }
});

// FIXED LINE: Points exactly to public/public/index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'public', 'index.html'));
});

app.listen(port, () => console.log(`Server running on ${port}`));
