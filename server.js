const express = require('express');
const { Pool } = require('pg');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Database Connection
const pool = new Pool({
  connectionString: 'postgres://frankfurt:P6ROik1jn232QPYNfiN9P8iwrekgroq5@dpg-d50osmhr0fns73904lf0-a/digitalearn',
  ssl: { rejectUnauthorized: false } 
});

app.use(express.json());
app.use(express.static(__dirname)); 

// 1. THE MAIN DASHBOARD ROUTE
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. THE EARNING ROUTE
app.post('/earn', async (req, res) => {
  const { email, amount } = req.body;
  try {
    const updated = await pool.query(
      'UPDATE users SET balance = balance + $1 WHERE email = $2 RETURNING *',
      [amount, email]
    );
    res.json(updated.rows[0] || { balance: amount });
  } catch (err) {
    res.status(500).json({ error: "Database Error" });
  }
});

// 3. SAFETY ROUTE (To test if the server is awake)
app.get('/test', (req, res) => {
  res.send("Server is running perfectly!");
});

app.listen(port, () => {
  console.log(`Server is live on port ${port}`);
});
