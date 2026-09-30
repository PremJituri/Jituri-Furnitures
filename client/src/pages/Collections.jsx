import { useEffect, useState } from 'react';
import { api } from '../api.js';
import AlbumCard from '../components/AlbumCard.jsx';

export default function Collections() {
  const [albums, setAlbums] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await api('/api/albums');
        if (!cancelled) setAlbums(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e.message || 'Could not load albums');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-dark/60 sm:px-6">Loading collections…</div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center text-red-600 sm:px-6">{error}</div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-bold text-dark">Collections</h1>
        <p className="mt-3 text-lg text-dark/65">
          Browse our furniture albums. Each collection is curated to help you imagine pieces in your space.
        </p>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}
