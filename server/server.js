const express  = require('express');
const cors     = require('cors');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const { v4: uuid } = require('uuid');

const app        = express();
const PORT       = 3500;
const JWT_SECRET = 'dev‑replace‑me';

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Simple in‑memory “DB”
const users    = [];
const families = {};   // families[userId] = [ member, … ]

// Helper: issue a JWT
function makeToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

// Auth middleware
function auth(req, res, next) {
  const authHdr = req.headers.authorization || '';
  const [, token] = authHdr.split(' ');
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

/* ---------- AUTH ROUTES ---------- */
app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  if (users.find(u => u.email === email)) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = { id: uuid(), email, firstName, lastName, hash };
  users.push(user);

  // ← re‑initialize their family array here
  families[user.id] = [];

  const token = makeToken(user);
  res
    .status(201)
    .json({ token, user: { id: user.id, email, firstName, lastName } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.hash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = makeToken(user);
  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
});

/* ---------- FAMILY ROUTES ---------- */

// GET all members
app.get('/api/family', auth, (req, res) => {
  res.json(families[req.user.id] || []);
});

// CREATE a new member
app.post('/api/family', auth, (req, res) => {
  const {
    name,
    birthDate,
    spouseName = null,
    childrenNames = [],
    location = '',
    occupation = '',
  } = req.body;

  if (!name || !birthDate) {
    return res
      .status(400)
      .json({ message: 'Name and birthDate are required' });
  }

  if (!families[req.user.id]) {
    families[req.user.id] = [];
  }

  const member = {
    id: uuid(),
    name,
    birthDate,
    spouseName,
    childrenNames,
    location,
    occupation,
    createdAt: new Date().toISOString(),
  };

  families[req.user.id].push(member);
  res.status(201).json(member);
});

// UPDATE an existing member
app.put('/api/family/:id', auth, (req, res) => {
  const userFam = families[req.user.id] || [];
  const idx     = userFam.findIndex(m => m.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ message: 'Member not found' });
  }

  userFam[idx] = { ...userFam[idx], ...req.body };
  res.json(userFam[idx]);
});

/* ---------- EMAIL + PDF DEMO (unchanged) ---------- */

app.post('/api/email/send', auth, (req, res) => {
  console.log(`[EMAIL] from ${req.user.email}`, req.body);
  res.json({ message: 'Email (stub) sent' });
});

app.post('/api/convert', auth, (req, res) => {
  res.type('application/pdf').send(Buffer.from('%PDF-1.4\n%Mock\n'));
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`✅ API running on http://localhost:${PORT}`);
});
