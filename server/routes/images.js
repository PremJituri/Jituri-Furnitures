import { Router } from 'express';
import multer from 'multer';
import sharp from 'sharp';
import { randomUUID } from 'crypto';
import { basename } from 'path';
import { requireAuth } from '../middleware/auth.js';
import { safeImagePath, deleteImageFileIfUnreferenced } from '../utils/fileHelper.js';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 25 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error('INVALID_FILE_TYPE');
      err.code = 'INVALID_FILE_TYPE';
      cb(err);
    }
  },
});

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 85;

function sanitizeOriginalName(rawName) {
  if (typeof rawName !== 'string') return 'image.jpg';
  const clean = basename(rawName)
    .replace(/[^\w\s.-]/gi, '')
    .trim()
    .slice(0, 150);
  return clean || 'image.jpg';
}

export function createImagesRouter(db, uploadsDir) {
  const router = Router();

  function deleteImageFile(filename) {
    deleteImageFileIfUnreferenced(db, uploadsDir, filename);
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
    // Validate image buffer headers/metadata with sharp
    const meta = await sharp(buffer).metadata();
    if (!meta || !meta.format) {
      throw new Error('Corrupted or unsupported image file');
    }

    const id = randomUUID();
    const filename = `${id}.jpg`;
    const outPath = safeImagePath(uploadsDir, filename);
    if (!outPath) {
      throw new Error('Invalid upload destination');
    }

    await sharp(buffer)
      .rotate()
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toFile(outPath);

    return { filename, originalName: sanitizeOriginalName(originalName) };
  }

  router.delete('/bulk', requireAuth, (req, res, next) => {
    try {
      const ids = req.body?.ids;
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ error: 'ids array required' });
      }
      if (ids.length > 100) {
        return res.status(400).json({ error: 'Cannot delete more than 100 images at once' });
      }
      const numeric = ids.map(Number).filter((n) => Number.isInteger(n) && n > 0);
      if (numeric.length === 0) {
        return res.status(400).json({ error: 'No valid ids provided' });
      }

      const placeholders = numeric.map(() => '?').join(',');
      const rows = db.prepare(`SELECT id, album_id, filename FROM images WHERE id IN (${placeholders})`).all(...numeric);

      for (const row of rows) {
        db.prepare('DELETE FROM images WHERE id = ?').run(row.id);
        deleteImageFile(row.filename);
        refreshCoverIfNeeded(row.album_id, row.filename);
      }

      res.json({ deleted: rows.length });
    } catch (err) {
      next(err);
    }
  });

  router.post(
    '/upload',
    requireAuth,
    (req, res, next) => {
      upload.array('images', 25)(req, res, (err) => {
        if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File size exceeds maximum limit of 15MB' });
          }
          if (err.code === 'LIMIT_FILE_COUNT' || err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({ error: 'Exceeded maximum of 25 files per upload' });
          }
          if (err.message === 'INVALID_FILE_TYPE' || err.code === 'INVALID_FILE_TYPE') {
            return res.status(400).json({ error: 'Only JPEG, PNG, WebP, and AVIF images are allowed' });
          }
          return res.status(400).json({ error: err.message || 'File upload error' });
        }
        next();
      });
    },
    async (req, res, next) => {
      try {
        const albumId = Number(req.body.albumId);
        if (!Number.isInteger(albumId) || albumId <= 0) {
          return res.status(400).json({ error: 'Valid albumId is required' });
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
        for (const file of files) {
          try {
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
          } catch (fileErr) {
            console.error('Skipping invalid file:', file.originalname, fileErr.message);
          }
        }

        if (inserted.length === 0) {
          return res.status(400).json({ error: 'No valid image files could be processed' });
        }

        res.status(201).json({ images: inserted });
      } catch (err) {
        next(err);
      }
    }
  );

  router.delete('/:id', requireAuth, (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ error: 'Invalid id' });
      }
      const row = db.prepare('SELECT id, album_id, filename FROM images WHERE id = ?').get(id);
      if (!row) {
        return res.status(404).json({ error: 'Image not found' });
      }
      db.prepare('DELETE FROM images WHERE id = ?').run(id);
      deleteImageFile(row.filename);
      refreshCoverIfNeeded(row.album_id, row.filename);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  });

  return router;
}

