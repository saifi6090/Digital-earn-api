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

// This tells the server to allow access to ALL these folders just in case
app.use(express.static(path.join(__dirname)));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'public')));

// THE FORCE ROUTE: If someone goes to your link, search every folder for index.html
app.get('/', (req, res) => {
  const possiblePaths = [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'public', 'index.html'),
    path.join(__dirname, 'public', 'public', 'index.html')
  ];

  // Try to find the file in any of those locations
  for (let p of possiblePaths) {
    if (require('fs').existsSync(p)) {
      return res.sendFile(p);
    }
  }
  res.status(404).send("File still not found. Check GitHub file names!");
});

app.listen(port, () => console.log(`Server running on ${port}`));
