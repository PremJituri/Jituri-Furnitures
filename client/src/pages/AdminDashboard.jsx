import { useCallback, useEffect, useState } from 'react';
import { api } from '../api.js';
import { compressImageFile } from '../utils/imageCompress.js';

export default function AdminDashboard() {
  const [albums, setAlbums] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const selectedAlbum = albums.find((a) => a.id === selectedId);

  const loadAlbums = useCallback(async () => {
    const data = await api('/api/albums');
    setAlbums(Array.isArray(data) ? data : []);
    return data;
  }, []);

  const loadAlbumDetail = useCallback(async (slug) => {
    if (!slug) {
      setImages([]);
      return;
    }
    const data = await api(`/api/albums/${encodeURIComponent(slug)}`);
    setImages(data.images || []);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await loadAlbums();
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        if (list.length) {
          setSelectedId((prev) => prev ?? list[0].id);
        }
      } catch (e) {
        if (!cancelled) setErr(e.message || 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [loadAlbums]);

  useEffect(() => {
    if (!selectedAlbum) return;
    setRenameValue(selectedAlbum.name);
    loadAlbumDetail(selectedAlbum.slug);
    setSelectedIds(new Set());
  }, [selectedId, selectedAlbum?.slug, loadAlbumDetail, selectedAlbum]);

  async function handleCreateAlbum(e) {
    e.preventDefault();
    setErr('');
    setMsg('');
    if (!newAlbumName.trim()) return;
    try {
      await api('/api/albums', {
        method: 'POST',
        body: JSON.stringify({ name: newAlbumName.trim(), description: newAlbumDesc.trim() || undefined }),
      });
      setNewAlbumName('');
      setNewAlbumDesc('');
      const data = await loadAlbums();
      const list = Array.isArray(data) ? data : [];
      if (list.length) setSelectedId(list[list.length - 1].id);
      setMsg('Album created.');
    } catch (e) {
      setErr(e.data?.error || e.message);
    }
  }

  async function handleRename(e) {
    e.preventDefault();
    if (!selectedAlbum || !renameValue.trim()) return;
    setErr('');
    setMsg('');
    try {
      await api(`/api/albums/${selectedAlbum.id}`, {
        method: 'PUT',
        body: JSON.stringify({ name: renameValue.trim() }),
      });
      await loadAlbums();
      setMsg('Album updated.');
    } catch (e) {
      setErr(e.data?.error || e.message);
    }
  }

  async function handleDeleteAlbum() {
    if (!selectedAlbum) return;
    if (!window.confirm(`Delete album “${selectedAlbum.name}” and all its photos? This cannot be undone.`)) {
      return;
    }
    setErr('');
    setMsg('');
    try {
      await api(`/api/albums/${selectedAlbum.id}`, { method: 'DELETE' });
      const data = await loadAlbums();
      const list = Array.isArray(data) ? data : [];
      setSelectedId(list[0]?.id ?? null);
      setImages([]);
      setMsg('Album deleted.');
    } catch (e) {
      setErr(e.data?.error || e.message);
    }
  }

  function toggleSelect(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    if (selectedIds.size === images.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(images.map((i) => i.id)));
    }
  }

  async function handleDeleteSelected() {
    const ids = [...selectedIds];
    if (ids.length === 0) return;
    if (!window.confirm(`Delete ${ids.length} selected photo(s)?`)) return;
    setErr('');
    setMsg('');
    try {
      await api('/api/images/bulk', {
        method: 'DELETE',
        body: JSON.stringify({ ids }),
      });
      setSelectedIds(new Set());
      if (selectedAlbum) await loadAlbumDetail(selectedAlbum.slug);
      await loadAlbums();
      setMsg('Photos deleted.');
    } catch (e) {
      setErr(e.data?.error || e.message);
    }
  }

  async function handleDeleteOne(id) {
    if (!window.confirm('Delete this photo?')) return;
    setErr('');
    try {
      await api(`/api/images/${id}`, { method: 'DELETE' });
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      if (selectedAlbum) await loadAlbumDetail(selectedAlbum.slug);
      await loadAlbums();
      setMsg('Photo deleted.');
    } catch (e) {
      setErr(e.data?.error || e.message);
    }
  }

  async function uploadFiles(fileList) {
    if (!selectedAlbum || !fileList?.length) return;
    setUploading(true);
    setErr('');
    setMsg('');
    try {
      const files = Array.from(fileList);
      const processed = [];
      for (const f of files) {
        if (!f.type.startsWith('image/')) continue;
        try {
          processed.push(await compressImageFile(f));
        } catch {
          processed.push(f);
        }
      }
      if (processed.length === 0) {
        setErr('No valid images to upload.');
        return;
      }
      const fd = new FormData();
      fd.append('albumId', String(selectedAlbum.id));
      for (const file of processed) {
        fd.append('images', file);
      }
      await api('/api/images/upload', { method: 'POST', body: fd });
      await loadAlbumDetail(selectedAlbum.slug);
      await loadAlbums();
      setMsg('Upload complete.');
    } catch (e) {
      setErr(e.data?.error || e.message);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    uploadFiles(e.dataTransfer.files);
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-lg text-dark/60 sm:px-6">Loading…</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-3xl font-bold text-dark">Admin dashboard</h1>
      <p className="mt-2 text-lg text-dark/65">Manage albums and photos. Buttons are large for easy use.</p>

      {(msg || err) && (
        <div className="mt-6 rounded-2xl border border-dark/10 bg-white p-4 text-lg">
          {msg && <p className="text-accent">{msg}</p>}
          {err && <p className="text-red-600">{err}</p>}
        </div>
      )}

      <section className="mt-10 rounded-2xl bg-white p-6 shadow-lg shadow-blue-500/10">
        <h2 className="text-xl font-semibold text-dark">Albums</h2>
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end">
          <label className="flex-1 text-base font-medium text-dark">
            Choose album
            <select
              value={selectedId ?? ''}
              onChange={(e) => setSelectedId(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-dark/15 px-4 py-4 text-lg"
            >
              {albums.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <form onSubmit={handleCreateAlbum} className="mt-8 grid gap-4 border-t border-dark/10 pt-8 md:grid-cols-2">
          <div>
            <label className="block text-base font-medium text-dark">New album name</label>
            <input
              value={newAlbumName}
              onChange={(e) => setNewAlbumName(e.target.value)}
              className="mt-2 w-full rounded-xl border border-dark/15 px-4 py-4 text-lg"
              placeholder="e.g. Office"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-dark">Description (optional)</label>
            <input
              value={newAlbumDesc}
              onChange={(e) => setNewAlbumDesc(e.target.value)}
              className="mt-2 w-full rounded-xl border border-dark/15 px-4 py-4 text-lg"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-2xl bg-primary py-5 text-xl font-semibold text-white shadow-lg shadow-blue-500/20 md:w-auto md:px-12"
            >
              Create Album
            </button>
          </div>
        </form>

        {selectedAlbum && (
          <form onSubmit={handleRename} className="mt-8 flex flex-col gap-4 border-t border-dark/10 pt-8 sm:flex-row sm:items-end">
            <label className="flex-1 text-base font-medium text-dark">
              Rename album
              <input
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                className="mt-2 w-full rounded-xl border border-dark/15 px-4 py-4 text-lg"
              />
            </label>
            <button
              type="submit"
              className="rounded-2xl bg-accent py-5 px-8 text-xl font-semibold text-white shadow-lg shadow-teal-500/20"
            >
              Save name
            </button>
            <button
              type="button"
              onClick={handleDeleteAlbum}
              className="rounded-2xl border-2 border-red-200 bg-red-50 py-5 px-8 text-xl font-semibold text-red-700"
            >
              Delete Album
            </button>
          </form>
        )}
      </section>

      {selectedAlbum && (
        <section className="mt-10 rounded-2xl bg-white p-6 shadow-lg shadow-blue-500/10">
          <h2 className="text-xl font-semibold text-dark">Photos in “{selectedAlbum.name}”</h2>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`mt-6 rounded-2xl border-2 border-dashed px-6 py-16 text-center transition-colors ${
              dragOver ? 'border-primary bg-primary/5' : 'border-dark/20 bg-surface'
            }`}
          >
            <p className="text-lg text-dark/80">Drag and drop photos here, or use the button below.</p>
            <label className="mt-6 inline-block">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => uploadFiles(e.target.files)}
              />
              <span className="inline-flex cursor-pointer rounded-2xl bg-primary px-10 py-5 text-xl font-semibold text-white shadow-lg shadow-blue-500/20">
                Upload Photos
              </span>
            </label>
            {uploading && <p className="mt-4 text-lg text-dark/60">Uploading…</p>}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={selectAll}
              className="rounded-xl border border-dark/15 px-6 py-3 text-lg font-medium text-dark"
            >
              {selectedIds.size === images.length ? 'Clear selection' : 'Select all'}
            </button>
            <button
              type="button"
              onClick={handleDeleteSelected}
              disabled={selectedIds.size === 0}
              className="rounded-2xl bg-red-600 px-8 py-5 text-xl font-semibold text-white shadow-lg disabled:opacity-40"
            >
              Delete Selected ({selectedIds.size})
            </button>
          </div>

          {images.length === 0 ? (
            <p className="mt-8 text-center text-lg text-dark/55">No photos yet. Upload some above.</p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="overflow-hidden rounded-2xl border border-dark/10 bg-surface shadow-md"
                >
                  <div className="relative aspect-[4/3] bg-dark/5">
                    <img src={img.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                    <label className="absolute left-3 top-3 flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-lg shadow">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(img.id)}
                        onChange={() => toggleSelect(img.id)}
                        className="h-5 w-5"
                      />
                      Select
                    </label>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm text-dark/70">{img.original_name || img.filename}</p>
                    <button
                      type="button"
                      onClick={() => handleDeleteOne(img.id)}
                      className="mt-3 w-full rounded-xl border border-red-200 py-3 text-base font-semibold text-red-700"
                    >
                      Delete this photo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
