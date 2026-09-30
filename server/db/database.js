import initSqlJs from 'sql.js';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const dataDir = join(rootDir, 'data');
const dbPath = join(dataDir, 'app.db');

let sqlJsFactory = null;

async function getSqlJs() {
  if (!sqlJsFactory) {
    sqlJsFactory = await initSqlJs();
  }
  return sqlJsFactory;
}

function persist(db) {
  const data = db.export();
  writeFileSync(dbPath, Buffer.from(data));
}

function normalizeParams(params) {
  if (params.length === 0) return [];
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return [...params];
}

function wrap(db, persistFn) {
  return {
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
  const row = dbWrapped.prepare('SELECT COUNT(*) as c FROM admin').get();
  const adminCount = row ? row.c : 0;
  if (adminCount === 0) {
    const hash = bcrypt.hashSync('adminJituri9845258760', 10);
    dbWrapped.prepare('INSERT INTO admin (username, password) VALUES (?, ?)').run('adminJituri', hash);
  }

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

export async function getDb() {
  const SQL = await getSqlJs();
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  let db;
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run('PRAGMA foreign_keys = ON');

  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
  db.exec(schema);

  const persistFn = () => persist(db);
  const wrapped = wrap(db, persistFn);
  seedIfNeeded(wrapped);
  persistFn();

  return wrapped;
}
