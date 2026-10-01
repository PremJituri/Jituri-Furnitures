import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, copyFileSync, renameSync, existsSync, mkdirSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');

function getDataDir() {
  return process.env.DATA_DIR ? resolve(process.env.DATA_DIR) : join(rootDir, 'data');
}

function getDbPath() {
  return join(getDataDir(), 'app.db');
}

let sqlJsFactory = null;

async function getSqlJs() {
  if (!sqlJsFactory) {
    sqlJsFactory = await initSqlJs();
  }
  return sqlJsFactory;
}

export function backupDb() {
  const dbPath = getDbPath();
  const dataDir = getDataDir();
  if (existsSync(dbPath)) {
    const backupPath = join(dataDir, 'app.db.bak');
    copyFileSync(dbPath, backupPath);
    return backupPath;
  }
  return null;
}

function persist(db) {
  const dbPath = getDbPath();
  const data = db.export();
  // sql.js resets PRAGMA foreign_keys to 0 on db.export(), so restore it immediately
  db.exec('PRAGMA foreign_keys = ON;');
  const tmpPath = `${dbPath}.tmp`;
  const buf = Buffer.from(data);
  try {
    writeFileSync(tmpPath, buf);
    renameSync(tmpPath, dbPath);
  } catch {
    // Windows file-lock fallback (e.g. transient scanner or handle contention)
    writeFileSync(dbPath, buf);
  }
}

function normalizeParams(params) {
  if (params.length === 0) return [];
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return [...params];
}

function wrap(db, persistFn) {
  return {
    exec(sql) {
      db.exec(sql);
      persistFn();
    },
    prepare(sql) {
      return {
        run(...params) {
          const flat = normalizeParams(params);
          db.run(sql, flat);
          const lastInsertRowid = Number(db.exec('SELECT last_insert_rowid()')[0].values[0][0]);
          const changes = Number(db.exec('SELECT changes()')[0].values[0][0]);
          persistFn();
          return { lastInsertRowid, changes };
        },
        get(...params) {
          const flat = normalizeParams(params);
          const stmt = db.prepare(sql);
          stmt.bind(flat);
          if (!stmt.step()) {
            stmt.free();
            return undefined;
          }
          const row = stmt.getAsObject();
          stmt.free();
          return row;
        },
        all(...params) {
          const flat = normalizeParams(params);
          const stmt = db.prepare(sql);
          stmt.bind(flat);
          const rows = [];
          while (stmt.step()) {
            rows.push(stmt.getAsObject());
          }
          stmt.free();
          return rows;
        },
      };
    },
  };
}

function seedIfNeeded(dbWrapped) {
  const adminRow = dbWrapped.prepare('SELECT COUNT(*) as c FROM admin').get();
  const adminCount = adminRow ? adminRow.c : 0;
  if (adminCount === 0) {
    const initialUser = process.env.INITIAL_ADMIN_USERNAME || 'adminJituri';
    const initialPass = process.env.INITIAL_ADMIN_PASSWORD || 'adminJituri9845258760';
    const hash = bcrypt.hashSync(initialPass, 10);
    dbWrapped.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run(initialUser, hash);
  }

  const albumRow = dbWrapped.prepare('SELECT COUNT(*) as c FROM albums').get();
  const albumCount = albumRow ? albumRow.c : 0;
  if (albumCount === 0) {
    const albumRows = [
      { name: 'Sofa', slug: 'sofa', description: 'Comfortable sofas for your living space.' },
      { name: 'Bed', slug: 'bed', description: 'Quality beds for restful sleep.' },
      { name: 'Dining', slug: 'dining', description: 'Dining tables and chairs.' },
    ];

    const insertAlbum = dbWrapped.prepare(
      'INSERT OR IGNORE INTO albums (name, slug, description) VALUES (?, ?, ?)'
    );
    for (const a of albumRows) {
      insertAlbum.run(a.name, a.slug, a.description);
    }
  }
}

export async function getDb() {
  const SQL = await getSqlJs();
  const dataDir = getDataDir();
  const dbPath = getDbPath();
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  let db;
  if (existsSync(dbPath)) {
    // Automatically create a pre-run backup of the database before opening
    try {
      backupDb();
    } catch {
      /* ignore backup creation error */
    }
    const fileBuffer = readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Strictly enable foreign key constraints via exec
  db.exec('PRAGMA foreign_keys = ON;');

  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  const persistFn = () => persist(db);
  const wrapped = wrap(db, persistFn);
  seedIfNeeded(wrapped);
  persistFn();

  return wrapped;
}

