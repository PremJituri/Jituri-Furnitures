import jwt from 'jsonwebtoken';

const DEV_DEFAULT_SECRET = 'jituri-dev-secret-change-in-production';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is required in production.');
    }
    return DEV_DEFAULT_SECRET;
  }
  if (
    process.env.NODE_ENV === 'production' &&
    (secret === DEV_DEFAULT_SECRET || secret === 'change-me-in-production')
  ) {
    throw new Error('FATAL: JWT_SECRET must be changed from the default value in production.');
  }
  return secret;
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = header.slice(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const payload = jwt.verify(token, getJwtSecret());
    if (!payload || !payload.sub || !payload.username) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    req.admin = { id: payload.sub, username: payload.username };
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

