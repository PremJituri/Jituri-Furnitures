import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { safeImagePath, deleteImageFileIfUnreferenced } from '../utils/fileHelper.js';

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

  router.get('/', (_req, res, next) => {
    try {
      const rows = db.prepare('SELECT id, name, slug, description, cover_image, created_at FROM albums ORDER BY name').all();
      res.json(rows.map((a) => ({ ...a, coverUrl: a.cover_image ? `/uploads/${a.cover_image}` : null })));
    } catch (err) {
      next(err);
    }
  });

  router.get('/:slug', (req, res, next) => {
    try {
      const slug = typeof req.params.slug === 'string' ? req.params.slug.trim() : '';
      if (!slug) {
        return res.status(400).json({ error: 'Slug is required' });
      }

      const album = db
        .prepare('SELECT id, name, slug, description, cover_image, created_at FROM albums WHERE slug = ?')
        .get(slug);
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
    } catch (err) {
      next(err);
    }
  });

  router.post('/', requireAuth, (req, res, next) => {
    try {
      const { name, description } = req.body || {};
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
      }
      const cleanName = name.trim();
      if (cleanName.length > 100) {
        return res.status(400).json({ error: 'Name must not exceed 100 characters' });
      }

      if (description !== undefined && description !== null && typeof description !== 'string') {
        return res.status(400).json({ error: 'Description must be a string' });
      }
      const cleanDesc = typeof description === 'string' ? description.trim() : null;
      if (cleanDesc && cleanDesc.length > 1000) {
        return res.status(400).json({ error: 'Description must not exceed 1000 characters' });
      }

      const base = slugify(cleanName);
      const slug = uniqueSlug(db, base);

      const info = db
        .prepare('INSERT INTO albums (name, slug, description) VALUES (?, ?, ?)')
        .run(cleanName, slug, cleanDesc);
      const row = db.prepare('SELECT id, name, slug, description, cover_image, created_at FROM albums WHERE id = ?').get(info.lastInsertRowid);
      res.status(201).json({ ...row, coverUrl: null });
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE' || (e.message && e.message.toLowerCase().includes('unique'))) {
        return res.status(409).json({ error: 'An album with this name already exists' });
      }
      next(e);
    }
  });

  router.put('/:id', requireAuth, (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
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
        const cleanName = name.trim();
        if (cleanName.length > 100) {
          return res.status(400).json({ error: 'Name must not exceed 100 characters' });
        }

        if (description !== undefined && description !== null && typeof description !== 'string') {
          return res.status(400).json({ error: 'Description must be a string' });
        }
        const cleanDesc = typeof description === 'string' ? description.trim() : (description === null ? null : undefined);
        if (cleanDesc && cleanDesc.length > 1000) {
          return res.status(400).json({ error: 'Description must not exceed 1000 characters' });
        }

        const base = slugify(cleanName);
        const slug = uniqueSlug(db, base, id);
        db.prepare('UPDATE albums SET name = ?, slug = ?, description = COALESCE(?, description) WHERE id = ?').run(
          cleanName,
          slug,
          cleanDesc !== undefined ? cleanDesc : null,
          id
        );
      } else if (description !== undefined) {
        if (description !== null && typeof description !== 'string') {
          return res.status(400).json({ error: 'Description must be a string' });
        }
        const cleanDesc = typeof description === 'string' ? description.trim() : null;
        if (cleanDesc && cleanDesc.length > 1000) {
          return res.status(400).json({ error: 'Description must not exceed 1000 characters' });
        }
        db.prepare('UPDATE albums SET description = ? WHERE id = ?').run(cleanDesc, id);
      } else {
        return res.status(400).json({ error: 'No fields to update' });
      }

      const row = db.prepare('SELECT id, name, slug, description, cover_image, created_at FROM albums WHERE id = ?').get(id);
      res.json({
        ...row,
        coverUrl: row.cover_image ? `/uploads/${row.cover_image}` : null,
      });
    } catch (e) {
      if (e.code === 'SQLITE_CONSTRAINT_UNIQUE' || (e.message && e.message.toLowerCase().includes('unique'))) {
        return res.status(409).json({ error: 'An album with this name already exists' });
      }
      next(e);
    }
  });

  router.delete('/:id', requireAuth, (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid id' });
      }

      const existing = db.prepare('SELECT id, name FROM albums WHERE id = ?').get(id);
      if (!existing) {
        return res.status(404).json({ error: 'Album not found' });
      }

      // Collect all images in the album before deletion
      const imgs = db.prepare('SELECT filename FROM images WHERE album_id = ?').all(id);

      // Explicitly delete child image records to guarantee no orphaned rows
      db.prepare('DELETE FROM images WHERE album_id = ?').run(id);

      // Delete the album record
      db.prepare('DELETE FROM albums WHERE id = ?').run(id);

      // Physically delete image files ONLY if no other image record references them
      for (const { filename } of imgs) {
        deleteImageFileIfUnreferenced(db, uploadsDir, filename);

        // Refresh cover image in any other albums if they pointed to this file
        const affectedAlbums = db.prepare('SELECT id FROM albums WHERE cover_image = ?').all(filename);
        for (const alb of affectedAlbums) {
          const nextCover = db
            .prepare('SELECT filename FROM images WHERE album_id = ? ORDER BY created_at DESC LIMIT 1')
            .get(alb.id);
          db.prepare('UPDATE albums SET cover_image = ? WHERE id = ?').run(nextCover ? nextCover.filename : null, alb.id);
        }
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}

