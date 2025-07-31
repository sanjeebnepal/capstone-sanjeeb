const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // Changed here for container
const db = require('./db'); // promise-based db module
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
  console.log('Register request body:', req.body); // Debug log
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields (username, password, email) are required' });
  }

  try {
    const existing = await db.query('SELECT id FROM userdatabase WHERE username = @param0', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO userdatabase (username, password, email) VALUES (@param0, @param1, @param2)',
      [username, passwordHash, email]
    );

    res.json({ success: true });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  console.log('Login request body:', req.body); // Debug log
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const rows = await db.query('SELECT * FROM userdatabase WHERE username = @param0', [username]);
    const user = rows[0];
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/user', async (req, res) => {
  try {
    const rows = await db.query('SELECT TOP 1 * FROM userdatabase');
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No user found' });
    }
    const user = rows[0];
    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.error('User fetch error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Backend running on http://0.0.0.0:${PORT}`);
});
