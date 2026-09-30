import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getJwtSecret, requireAuth } from '../middleware/auth.js';

export function createAuthRouter(db) {
  const router = Router();

  router.post('/login', (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }
    const row = db.prepare('SELECT id, username, password FROM admin WHERE username = ?').get(username);
    if (!row || !bcrypt.compareSync(password, row.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { sub: row.id, username: row.username },
      getJwtSecret(),
      { expiresIn: '7d' }
    );
    res.json({ token, username: row.username });
  });

  router.get('/verify', requireAuth, (req, res) => {
    res.json({ valid: true, username: req.admin.username });
  });

  return router;
}
