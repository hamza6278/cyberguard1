const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '399216@qwerty%6',
  database: 'demo',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.post('/login', (req, res) => {
  const { full_name, password } = req.body;
  const query = `SELECT * FROM tech_info WHERE full_name = '${full_name}' AND password = '${password}'`;
  console.log('Query:', query); // Log the query

  db.query(
    'SELECT * FROM tech_info WHERE full_name = ? AND password = ?',
    [full_name, password],
    (err, results) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        return;
      }

      if (results.length > 0) {
        res.status(200).json({ success: true });
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    }
  );
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
