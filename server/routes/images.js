import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';
import { requireAuth } from '../middleware/auth.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 50 },
});

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 85;

export function createImagesRouter(db, uploadsDir) {
  const router = Router();

  function deleteImageFile(filename) {
    const p = join(uploadsDir, filename);
    if (existsSync(p)) {
      try {
        unlinkSync(p);
      } catch {
        /* ignore */
      }
    }
  }

  function refreshCoverIfNeeded(albumId, deletedFilename) {
    const album = db.prepare('SELECT cover_image FROM albums WHERE id = ?').get(albumId);
    if (!album) return;
    if (album.cover_image !== deletedFilename) return;
    const next = db
      .prepare('SELECT filename FROM images WHERE album_id = ? ORDER BY created_at DESC LIMIT 1')
      .get(albumId);
    db.prepare('UPDATE albums SET cover_image = ? WHERE id = ?').run(next ? next.filename : null, albumId);
  }

  async function processAndSave(buffer, originalName) {
    const id = randomUUID();
    const filename = `${id}.jpg`;
    const outPath = join(uploadsDir, filename);
    await sharp(buffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outPath);
    return { filename, originalName: originalName || filename };
  }

  router.delete('/bulk', requireAuth, (req, res) => {
    const ids = req.body?.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'ids array required' });
    }
    const numeric = ids.map(Number).filter((n) => Number.isInteger(n));
    if (numeric.length === 0) {
      return res.status(400).json({ error: 'No valid ids' });
    }

    const placeholders = numeric.map(() => '?').join(',');
    const rows = db.prepare(`SELECT id, album_id, filename FROM images WHERE id IN (${placeholders})`).all(...numeric);

    for (const row of rows) {
      deleteImageFile(row.filename);
      db.prepare('DELETE FROM images WHERE id = ?').run(row.id);
      refreshCoverIfNeeded(row.album_id, row.filename);
    }

    res.json({ deleted: rows.length });
  });

  router.post('/upload', requireAuth, upload.array('images', 50), async (req, res) => {
    const albumId = Number(req.body.albumId);
    if (!Number.isInteger(albumId)) {
      return res.status(400).json({ error: 'albumId is required' });
    }
    const album = db.prepare('SELECT id, cover_image FROM albums WHERE id = ?').get(albumId);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }
    const files = req.files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No image files provided' });
    }

    const inserted = [];
    try {
      for (const file of files) {
        if (!file.mimetype || !file.mimetype.startsWith('image/')) {
          continue;
        }
        const { filename, originalName } = await processAndSave(file.buffer, file.originalname);
        const info = db
          .prepare('INSERT INTO images (album_id, filename, original_name) VALUES (?, ?, ?)')
          .run(albumId, filename, originalName);
        if (!album.cover_image) {
          db.prepare('UPDATE albums SET cover_image = ? WHERE id = ?').run(filename, albumId);
          album.cover_image = filename;
        }
        inserted.push({
          id: info.lastInsertRowid,
          album_id: albumId,
          filename,
          original_name: originalName,
          url: `/uploads/${filename}`,
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to process images' });
    }

    res.status(201).json({ images: inserted });
  });

  router.delete('/:id', requireAuth, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    const row = db.prepare('SELECT id, album_id, filename FROM images WHERE id = ?').get(id);
    if (!row) {
      return res.status(404).json({ error: 'Image not found' });
    }
    deleteImageFile(row.filename);
    db.prepare('DELETE FROM images WHERE id = ?').run(id);
    refreshCoverIfNeeded(row.album_id, row.filename);
    res.status(204).send();
  });

  return router;
}
