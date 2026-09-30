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
const uploadsDir = join(__dirname, 'uploads');
const dataDir = join(__dirname, 'data');

for (const dir of [dataDir, uploadsDir]) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

const PORT = Number(process.env.PORT) || 3001;
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

async function main() {
  const db = await getDb();
  const app = express();

  app.use(
    cors({
      origin: process.env.NODE_ENV === 'production' ? true : clientOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: '2mb' }));

  app.use('/uploads', express.static(uploadsDir));

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
    app.use(express.static(clientDist));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
        return next();
      }
      res.sendFile(join(clientDist, 'index.html'));
    });
  }

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
