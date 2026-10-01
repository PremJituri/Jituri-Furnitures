import express from 'express';
import cors from 'cors';
import { mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getDb } from './db/database.js';
import { createAuthRouter } from './routes/auth.js';
import { createAlbumsRouter } from './routes/albums.js';
import { createImagesRouter } from './routes/images.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const uploadsDir = join(__dirname, 'uploads');
const dataDir = join(__dirname, 'data');

// Load .env automatically if present (native Node.js 20.12+ / 24+)
if (typeof process.loadEnvFile === 'function') {
  for (const envPath of [join(rootDir, '.env'), join(__dirname, '.env')]) {
    if (existsSync(envPath)) {
      try {
        process.loadEnvFile(envPath);
      } catch {
        /* ignore parse errors or already loaded */
      }
    }
  }
}

for (const dir of [dataDir, uploadsDir]) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

const PORT = Number(process.env.PORT) || 3001;

// Configure CORS allowed origins
function getAllowedOrigins() {
  if (process.env.CLIENT_ORIGIN) {
    return process.env.CLIENT_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  }
  if (process.env.NODE_ENV === 'production') {
    return []; // in production, default to same-origin only unless CLIENT_ORIGIN specified
  }
  return ['http://localhost:5173', 'http://127.0.0.1:5173'];
}

async function main() {
  // Validate JWT secret early so server fails fast if misconfigured in production
  import('./middleware/auth.js').then((m) => m.getJwtSecret()).catch((err) => {
    console.error(err.message);
    process.exit(1);
  });

  const db = await getDb();
  const app = express();

  // Basic security hardening
  app.disable('x-powered-by');
  app.use((_req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  const allowedOrigins = getAllowedOrigins();
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. same-origin, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error('Blocked by CORS policy'));
      },
      credentials: true,
    })
  );

  app.use(express.json({ limit: '1mb' }));

  app.use(
    '/uploads',
    express.static(uploadsDir, {
      dotfiles: 'ignore',
      etag: true,
      maxAge: '7d',
      immutable: true,
    })
  );

  const authRouter = createAuthRouter(db);
  const albumsRouter = createAlbumsRouter(db, uploadsDir);
  const imagesRouter = createImagesRouter(db, uploadsDir);

  app.use('/api/auth', authRouter);
  app.use('/api/albums', albumsRouter);
  app.use('/api/images', imagesRouter);

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  const clientDist = join(__dirname, '..', 'client', 'dist');
  if (process.env.NODE_ENV === 'production' && existsSync(clientDist)) {
    app.use(
      express.static(clientDist, {
        dotfiles: 'ignore',
        etag: true,
        maxAge: '1h',
        setHeaders: (res, filePath) => {
          if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          } else if (filePath.includes('assets')) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
        },
      })
    );
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(join(clientDist, 'index.html'));
    });
  }

  // Centralized error handling middleware
  app.use((err, _req, res, _next) => {
    if (err.message === 'Blocked by CORS policy') {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
    const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 600 ? err.status : 500;
    // Log error internally, never expose stack traces to client
    if (status >= 500) {
      console.error('[Server Error]', err.message);
    }
    const responseMsg = status < 500 || process.env.NODE_ENV !== 'production'
      ? err.message || 'Request failed'
      : 'Internal server error';
    res.status(status).json({ error: responseMsg });
  });

  const server = app.listen(PORT);

  server.on('listening', () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(
        `\nPort ${PORT} is already in use (another process is listening).\n` +
          `Stop the other server (often a previous \`node server.js\` or \`npm run dev\`), or use a different port:\n` +
          `  PowerShell:  $env:PORT=3002; npm run start --prefix server\n` +
          `Find PID on Windows:  Get-NetTCPConnection -LocalPort ${PORT} | Select-Object OwningProcess\n` +
          `Stop process:          Stop-Process -Id <PID> -Force\n`
      );
      process.exit(1);
      return;
    }
    console.error(err);
    process.exit(1);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
