/* server.js */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuid } = require('uuid');

const app  = express();
const PORT = 3500;
const JWT_SECRET = 'dev‑replace‑me';   // move to env var in prod

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ------------ Faux “database” -------------
// key = userId, value = array of family members
// each member = {
//   id: string,
//   name: string,
//   birthDate: string,      // ISO format
//   spouseId: string|null,  // member.id of spouse
//   childrenIds: string[],  // array of member.id
//   location?: string,
//   occupation?: string
// }
const users = []; 
const families = {};   // key = userId, value = array of family members:

// Helper: issue JWT
const makeToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

// Middleware: verify JWT
const auth = (req, res, next) => {
  const authHdr = req.headers.authorization || '';
  const [, token] = authHdr.split(' ');
  if (!token) return res.status(401).json({ message: 'Missing token' });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid / expired token' });
  }
};

/* ---------- AUTH ROUTES ---------- */
app.post('/api/auth/register', async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  if (users.find(u => u.email === email))
    return res.status(409).json({ message: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  const user = { id: uuid(), email, firstName, lastName, hash };
  users.push(user);
  families[user.id] = [];                 // initialise empty family list

  const token = makeToken(user);
  res.status(201).json({ token, user: { id: user.id, email, firstName, lastName } });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.hash)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = makeToken(user);
  res.json({ token, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } });
});

/* ---------- FAMILY ROUTES ---------- */
app.get('/api/family', auth, (req, res) => {
  const userFam = families[req.user.id] || [];
  res.json(userFam);
});

app.post('/api/family', auth, (req, res) => {
  const {
    name,
    birthDate,
    spouseId = null,
    childrenIds = [],
    location = '',
    occupation = ''
  } = req.body;

  if (!name || !birthDate) {
    return res.status(400).json({ message: 'Name and birthDate are required' });
  }

  // validate references against this user's existing members
  const userFam = families[req.user.id];
  const exists = id => userFam.some(m => m.id === id);

  if (spouseId && !exists(spouseId)) {
    return res.status(400).json({ message: 'Invalid spouseId' });
  }
  for (let c of childrenIds) {
    if (!exists(c)) {
      return res.status(400).json({ message: `Child ${c} not found` });
    }
  }

      const member = {
        id: uuid(),
        name,
        birthDate,
        spouseId,
        childrenIds,
        location,
        occupation,
        createdAt: new Date().toISOString()
  };

  userFam.push(member);
  res.status(201).json(member);
});


app.put('/api/family/:id', auth, (req, res) => {
  const userFam = families[req.user.id];
  const idx = userFam.findIndex(m => m.id === req.params.id);
  if (idx < 0) {
    return res.status(404).json({ message: 'Member not found' });
  }

  // Merge incoming fields over the existing member
  const updated = {
    ...userFam[idx],
    ...req.body
  };
  userFam[idx] = updated;

  res.json(updated);
});


app.put('/api/family/:id', auth, (req, res) => {
  const userFam = families[req.user.id];
  const idx = userFam.findIndex(m => m.id === req.params.id);
  if (idx < 0) return res.status(404).json({ message: 'Member not found' });

  const updated = { ...userFam[idx], ...req.body };
  userFam[idx] = updated;
  res.json(updated);
});


/* ---------- EMAIL + PDF DEMO ---------- */
app.post('/api/email/send', auth, (req, res) => {
  console.log(`[EMAIL] from ${req.user.email}`, req.body);
  res.json({ message: 'Email (stub) sent' });
});

app.post('/api/convert', auth, (req, res) => {
  res.type('application/pdf').send(Buffer.from('%PDF-1.4\n%Mock\n'));
});

/* ---------- START ---------- */
app.listen(PORT, () => console.log(`✅ API on http://localhost:${PORT}`));
