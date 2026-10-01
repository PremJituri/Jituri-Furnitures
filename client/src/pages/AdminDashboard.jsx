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
  }, [selectedId, selectedAlbum?.slug, loadAlbumDetail]);

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
      setMsg('Album created successfully.');
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
      setMsg('Album updated successfully.');
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
      setMsg('Upload completed successfully.');
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
      <div className="mx-auto max-w-[1200px] px-4 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#0B1B2B] border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-[#4A5D73]">Loading admin dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header Banner (--bg-sage) */}
      <section className="border-b border-[#D3E2F0] bg-[#EEF5FC] -mt-[92px] md:-mt-[108px] pt-[116px] md:pt-[140px] pb-12 md:pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <span className="inline-flex items-center rounded-full bg-[#5BBBF7] px-3 py-1 text-xs font-semibold text-[#0B1B2B]">
            Catalog Management
          </span>
          <h1 className="editorial-h1 mt-3">Admin Dashboard</h1>
          <p className="editorial-body mt-2">
            Create collections, upload high-resolution images, and organize showroom albums.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        {(msg || err) && (
          <div
            className={`mb-8 rounded-[4px] border p-4 text-sm font-medium ${
              err
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-[#5BBBF7] bg-[#EEF5FC] text-[#0B1B2B]'
            }`}
          >
            {msg && <p>{msg}</p>}
            {err && <p>{err}</p>}
          </div>
        )}

        {/* Section: Albums */}
        <section className="rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-soft">
          <div className="flex items-center justify-between border-b border-[#D3E2F0] pb-4">
            <h2 className="editorial-h3">Collections & Albums</h2>
            <span className="text-xs font-mono text-[#4A5D73]">
              {albums.length} Total Album{albums.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label htmlFor="choose-album" className="block text-xs font-semibold text-[#0B1B2B]">
                Select Active Album
              </label>
              <select
                id="choose-album"
                value={selectedId ?? ''}
                onChange={(e) => setSelectedId(Number(e.target.value))}
                className="mt-1.5 w-full rounded-[2px] border border-[#D3E2F0] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0B1B2B] outline-none transition-colors focus:border-[#0B1B2B]"
              >
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Form: Create new album */}
          <form
            onSubmit={handleCreateAlbum}
            className="mt-8 grid gap-4 border-t border-[#D3E2F0] pt-6 md:grid-cols-2"
          >
            <div>
              <label htmlFor="new-name" className="block text-xs font-semibold text-[#0B1B2B]">
                New Album Name *
              </label>
              <input
                id="new-name"
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                className="mt-1.5 w-full rounded-[2px] border border-[#D3E2F0] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0B1B2B] placeholder-[#4A5D73]/50 outline-none transition-colors focus:border-[#0B1B2B]"
                placeholder="e.g. Executive Office Suites"
              />
            </div>
            <div>
              <label htmlFor="new-desc" className="block text-xs font-semibold text-[#0B1B2B]">
                Description (Optional)
              </label>
              <input
                id="new-desc"
                value={newAlbumDesc}
                onChange={(e) => setNewAlbumDesc(e.target.value)}
                className="mt-1.5 w-full rounded-[2px] border border-[#D3E2F0] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0B1B2B] placeholder-[#4A5D73]/50 outline-none transition-colors focus:border-[#0B1B2B]"
                placeholder="e.g. Ergonomic solid wood desks and chairs"
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-[2px] bg-[#0B1B2B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                + Create Album
              </button>
            </div>
          </form>

          {/* Form: Rename / Delete current album */}
          {selectedAlbum && (
            <form
              onSubmit={handleRename}
              className="mt-8 flex flex-col gap-4 border-t border-[#D3E2F0] pt-6 sm:flex-row sm:items-end"
            >
              <div className="flex-1">
                <label htmlFor="rename-input" className="block text-xs font-semibold text-[#0B1B2B]">
                  Rename Current Album
                </label>
                <input
                  id="rename-input"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  className="mt-1.5 w-full rounded-[2px] border border-[#D3E2F0] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#0B1B2B] outline-none transition-colors focus:border-[#0B1B2B]"
                />
              </div>
              <button
                type="submit"
                className="rounded-[2px] bg-[#0B1B2B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                Save Name
              </button>
              <button
                type="button"
                onClick={handleDeleteAlbum}
                className="rounded-[2px] border border-red-300 bg-red-50 px-6 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
              >
                Delete Album
              </button>
            </form>
          )}
        </section>

        {/* Section: Photos in Album */}
        {selectedAlbum && (
          <section className="mt-10 rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] p-6 sm:p-8 shadow-soft">
            <div className="flex items-center justify-between border-b border-[#D3E2F0] pb-4">
              <h2 className="editorial-h3">Photographs in “{selectedAlbum.name}”</h2>
              <span className="text-xs font-mono text-[#4A5D73]">
                {images.length} Image{images.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              className={`mt-6 rounded-[2px] border-2 border-dashed px-6 py-12 text-center transition-colors ${
                dragOver
                  ? 'border-[#0B1B2B] bg-[#EEF5FC]'
                  : 'border-[#D3E2F0] bg-[#F4F8FC] hover:border-[#0B1B2B]/40'
              }`}
            >
              <p className="text-sm font-medium text-[#0B1B2B]">
                Drag and drop furniture photographs here, or browse files from your device.
              </p>
              <label className="mt-4 inline-block">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => uploadFiles(e.target.files)}
                />
                <span className="inline-flex cursor-pointer rounded-[2px] bg-[#0B1B2B] px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">
                  Select Photos to Upload
                </span>
              </label>
              {uploading && (
                <p className="mt-3 text-xs font-medium text-[#4A5D73] animate-pulse">
                  Compressing and uploading images…
                </p>
              )}
            </div>

            {/* Bulk Selection Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={selectAll}
                className="rounded-[2px] border border-[#D3E2F0] bg-white px-4 py-2 text-xs font-semibold text-[#0B1B2B] hover:bg-[#F4F8FC]"
              >
                {selectedIds.size === images.length ? 'Clear Selection' : 'Select All'}
              </button>
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={selectedIds.size === 0}
                className="rounded-[2px] bg-red-600 px-5 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete Selected ({selectedIds.size})
              </button>
            </div>

            {/* Photos Grid */}
            {images.length === 0 ? (
              <p className="mt-12 text-center text-sm text-[#4A5D73]">
                No photographs in this collection yet. Upload some using the panel above.
              </p>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="overflow-hidden rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] shadow-soft"
                  >
                    <div className="relative aspect-[4/3] bg-[#F4F8FC]">
                      <img
                        src={img.url}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <label className="absolute left-2.5 top-2.5 flex items-center gap-2 rounded-[2px] bg-white/90 px-2.5 py-1 text-xs font-medium text-[#0B1B2B] shadow-sm backdrop-blur-sm">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(img.id)}
                          onChange={() => toggleSelect(img.id)}
                          className="h-4 w-4 accent-[#0B1B2B]"
                        />
                        Select
                      </label>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-xs font-medium text-[#0B1B2B]">
                        {img.original_name || img.filename}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDeleteOne(img.id)}
                        className="mt-3 w-full rounded-[2px] border border-red-200 py-1.5 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                      >
                        Delete Photo
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
