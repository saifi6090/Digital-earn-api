const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: 'postgres://frankfurt:P6ROik1jn232QPYNfiN9P8iwrekgroq5@dpg-d50osmhr0fns73904lf0-a/digitalearn',
  ssl: { rejectUnauthorized: false } 
});

app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.send('✅ Server is LIVE and Database is CONNECTED!');
  } catch (err) {
    res.status(500).send('❌ Database Connection Error');
  }
});

app.listen(port, () => console.log(`Running on ${port}`));
