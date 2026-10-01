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

  return (
    <div className="bg-[#FFFFFF] min-h-screen">
      {/* Header Banner (--bg-sage) */}
      <section className="border-b border-[#D3E2F0] bg-[#EEF5FC] -mt-[92px] md:-mt-[108px] pt-[116px] md:pt-[140px] pb-16 md:pb-20">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center rounded-full bg-[#5BBBF7] px-3 py-1 text-xs font-semibold text-[#0B1B2B]">
              Curated Catalog
            </span>
            <h1 className="editorial-h1 mt-4">Furniture Collections</h1>
            <p className="editorial-body mt-4">
              Browse our furniture albums. Each collection is curated to help you imagine pieces in
              your space, showcasing solid woods, bespoke upholstery, and hand-finished craftsmanship.
            </p>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <main className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 md:py-20">
        {loading && (
          <div className="py-24 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#0B1B2B] border-t-transparent" />
            <p className="mt-4 text-sm font-medium text-[#4A5D73]">Loading collections…</p>
          </div>
        )}

        {error && (
          <div className="rounded-[4px] border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && albums.length === 0 && (
          <div className="rounded-[4px] border border-[#D3E2F0] bg-[#F4F8FC] p-12 text-center">
            <h3 className="editorial-h3">No Collections Found</h3>
            <p className="mt-2 text-sm text-[#4A5D73]">
              Collections will appear here once created in the admin portal.
            </p>
          </div>
        )}

        {!loading && !error && albums.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
