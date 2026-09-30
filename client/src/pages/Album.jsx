import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import ImageModal from '../components/ImageModal.jsx';

export default function Album() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [modalIndex, setModalIndex] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await api(`/api/albums/${encodeURIComponent(slug)}`);
        if (!cancelled) setAlbum(data);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Album not found');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const filtered = useMemo(() => {
    if (!album?.images) return [];
    const q = query.trim().toLowerCase();
    if (!q) return album.images;
    return album.images.filter((img) => {
      const name = (img.original_name || img.filename || '').toLowerCase();
      return name.includes(q);
    });
  }, [album, query]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-dark/60 sm:px-6">Loading album…</div>
    );
  }

  if (error || !album) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-center text-red-600">{error || 'Album not found'}</p>
        <p className="mt-6 text-center">
          <Link to="/collections" className="font-medium text-primary hover:underline">
            Back to collections
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <nav className="text-sm text-dark/55">
        <Link to="/collections" className="hover:text-primary">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span className="text-dark">{album.name}</span>
      </nav>
      <h1 className="mt-4 text-4xl font-bold text-dark">{album.name}</h1>
      {album.description && <p className="mt-3 max-w-2xl text-dark/70">{album.description}</p>}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <label className="block w-full max-w-md">
          <span className="sr-only">Search images</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by file name…"
            className="w-full rounded-2xl border border-dark/10 bg-white px-4 py-3 text-dark shadow-sm outline-none ring-primary/30 transition-all placeholder:text-dark/40 focus:ring-2"
          />
        </label>
        <p className="text-sm text-dark/55">
          {filtered.length} image{filtered.length === 1 ? '' : 's'}
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="mt-12 text-center text-dark/55">No images match your search.</p>
      ) : (
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {filtered.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setModalIndex(i)}
              className="mb-4 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-white text-left shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <img
                src={img.url}
                alt={img.original_name || ''}
                className="w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {modalIndex !== null && filtered.length > 0 && (
        <ImageModal
          images={filtered}
          index={modalIndex}
          onClose={() => setModalIndex(null)}
          onPrev={() => setModalIndex((i) => Math.max(0, i - 1))}
          onNext={() => setModalIndex((i) => Math.min(filtered.length - 1, i + 1))}
        />
      )}
    </div>
  );
}
