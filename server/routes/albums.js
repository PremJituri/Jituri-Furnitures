import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function uniqueSlug(db, base, excludeId = null) {
  let slug = base || 'album';
  let n = 0;
  while (true) {
    const row = excludeId
      ? db.prepare('SELECT id FROM albums WHERE slug = ? AND id != ?').get(slug, excludeId)
      : db.prepare('SELECT id FROM albums WHERE slug = ?').get(slug);
    if (!row) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}

export function createAlbumsRouter(db, uploadsDir) {
  const router = Router();

  router.get('/', (_req, res) => {
    const rows = db.prepare('SELECT id, name, slug, description, cover_image, created_at FROM albums ORDER BY name').all();
    res.json(rows.map((a) => ({ ...a, coverUrl: a.cover_image ? `/uploads/${a.cover_image}` : null })));
  });

  router.get('/:slug', (req, res) => {
    const album = db
      .prepare('SELECT id, name, slug, description, cover_image, created_at FROM albums WHERE slug = ?')
      .get(req.params.slug);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    const images = db
      .prepare(
        'SELECT id, filename, original_name, created_at FROM images WHERE album_id = ? ORDER BY created_at DESC'
      )
      .all(album.id);
    res.json({
      ...album,
      coverUrl: album.cover_image ? `/uploads/${album.cover_image}` : null,
      images: images.map((img) => ({
        ...img,
        url: `/uploads/${img.filename}`,
      })),
    });
  });

  router.post('/', requireAuth, (req, res) => {
    const { name, description } = req.body || {};
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const base = slugify(name.trim());
    const slug = uniqueSlug(db, base);
    try {
      const info = db
        .prepare('INSERT INTO albums (name, slug, description) VALUES (?, ?, ?)')
        .run(name.trim(), slug, description || null);
      const row = db.prepare('SELECT id, name, slug, description, cover_image, created_at FROM albums WHERE id = ?').get(info.lastInsertRowid);
      res.status(201).json({ ...row, coverUrl: null });
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        return res.status(409).json({ error: 'An album with this name already exists' });
      }
      throw e;
    }
  });

  router.put('/:id', requireAuth, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const existing = db.prepare('SELECT id, name, slug FROM albums WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Album not found' });
    }
    const { name, description } = req.body || {};
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name cannot be empty' });
      }
      const base = slugify(name.trim());
      const slug = uniqueSlug(db, base, id);
      try {
        db.prepare('UPDATE albums SET name = ?, slug = ?, description = COALESCE(?, description) WHERE id = ?').run(
          name.trim(),
          slug,
          description !== undefined ? description : null,
          id
        );
      } catch (e) {
        if (e.code === 'SQLITE_CONSTRAINT_UNIQUE') {
          return res.status(409).json({ error: 'An album with this name already exists' });
        }
        throw e;
      }
    } else if (description !== undefined) {
      db.prepare('UPDATE albums SET description = ? WHERE id = ?').run(description, id);
    } else {
      return res.status(400).json({ error: 'No fields to update' });
    }
    const row = db.prepare('SELECT id, name, slug, description, cover_image, created_at FROM albums WHERE id = ?').get(id);
    res.json({
      ...row,
      coverUrl: row.cover_image ? `/uploads/${row.cover_image}` : null,
    });
  });

  router.delete('/:id', requireAuth, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const imgs = db.prepare('SELECT filename FROM images WHERE album_id = ?').all(id);
    for (const { filename } of imgs) {
      const p = join(uploadsDir, filename);
      if (existsSync(p)) {
        try {
          unlinkSync(p);
        } catch {
          /* ignore */
        }
      }
    }
    const info = db.prepare('DELETE FROM albums WHERE id = ?').run(id);
    if (info.changes === 0) {
      return res.status(404).json({ error: 'Album not found' });
    }
    res.status(204).send();
  });

  return router;
}
