import { basename, resolve, sep } from 'path';
import { existsSync, unlinkSync } from 'fs';

/**
 * Safely resolves an image filename within the uploads directory,
 * preventing any path traversal.
 * @param {string} uploadsDir
 * @param {string} filename
 * @returns {string|null} Resolved safe path or null if invalid/traversal
 */
export function safeImagePath(uploadsDir, filename) {
  if (typeof filename !== 'string') return null;
  // Outright reject any path traversal patterns or directory separators
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return null;
  }
  const cleanName = basename(filename).trim();
  if (!cleanName || cleanName === '.' || cleanName === '..') return null;
  const fullPath = resolve(uploadsDir, cleanName);
  if (!fullPath.startsWith(resolve(uploadsDir) + sep)) return null;
  return fullPath;
}

/**
 * Deletes an image file from disk only if no remaining record in the
 * images table references it.
 * @param {object} db
 * @param {string} uploadsDir
 * @param {string} filename
 * @returns {boolean} True if file was unlinked, false otherwise
 */
export function deleteImageFileIfUnreferenced(db, uploadsDir, filename) {
  if (!filename) return false;
  const remaining = db.prepare('SELECT COUNT(*) as c FROM images WHERE filename = ?').get(filename);
  if (!remaining || remaining.c === 0) {
    const p = safeImagePath(uploadsDir, filename);
    if (p && existsSync(p)) {
      try {
        unlinkSync(p);
        return true;
      } catch {
        /* ignore deletion errors */
      }
    }
  }
  return false;
}
