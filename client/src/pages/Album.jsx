import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api.js';
import ImageModal from '../components/ImageModal.jsx';

export default function Album() {
  const { slug } = useParams();
  const [album, setAlbum] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    if (album?.name) {
      document.title = `${album.name} Collection — Jituri Furnitures`;
    } else {
      document.title = 'Jituri Furnitures — Handcrafted Enduring Furniture | Belagavi';
    }
    return () => {
      document.title = 'Jituri Furnitures — Handcrafted Enduring Furniture | Belagavi';
    };
  }, [album?.name]);

  const images = album?.images || [];

  if (loading) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#0B1B2B] border-t-transparent" />
        <p className="mt-4 text-sm font-medium text-[#4A5D73]">Loading album…</p>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="mx-auto max-w-[1200px] px-4 py-24 text-center">
        <div className="mx-auto max-w-md rounded-[4px] border border-red-200 bg-red-50 p-8">
          <p className="font-semibold text-red-700">{error || 'Album not found'}</p>
          <div className="mt-6">
            <Link
              to="/collections"
              className="inline-block rounded-[2px] bg-[#0B1B2B] px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              ← Back to collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      {/* Header Banner (--bg-sage) */}
      <section className="border-b border-[#D3E2F0] bg-[#EEF5FC] -mt-[92px] md:-mt-[108px] pt-[116px] md:pt-[140px] pb-12 md:pb-16">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A5D73]">
            <Link to="/" className="hover:text-[#0B1B2B] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/collections" className="hover:text-[#0B1B2B] transition-colors">
              Collections
            </Link>
            <span>/</span>
            <span className="text-[#0B1B2B] truncate max-w-[200px] sm:max-w-none" aria-current="page">
              {album.name}
            </span>
          </nav>
          <h1 className="editorial-h1 mt-4">{album.name}</h1>
          {album.description && (
            <p className="editorial-body mt-4 max-w-2xl">{album.description}</p>
          )}
        </div>
      </section>

      {/* Gallery Header & Image Grid */}
      <main className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex items-center justify-between border-b border-[#D3E2F0] pb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#4A5D73]">
            Curated Gallery
          </p>
          <span className="rounded-full bg-[#EEF5FC] px-3.5 py-1 text-xs font-semibold text-[#0B1B2B] border border-[#D3E2F0]">
            {images.length} {images.length === 1 ? 'Photograph' : 'Photographs'}
          </span>
        </div>

        {images.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-sm font-medium text-[#4A5D73]">
              No photographs in this collection yet.
            </p>
          </div>
        ) : (
          <div className="mt-10 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setModalIndex(i)}
                className="group mb-6 block w-full break-inside-avoid overflow-hidden rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] text-left shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-[#0B1B2B]/40 focus:outline-none focus:ring-2 focus:ring-[#0B1B2B]"
              >
                <div className="overflow-hidden bg-[#F4F8FC]">
                  <img
                    src={img.url}
                    alt={album.name ? `${album.name} photograph ${i + 1}` : 'Furniture photograph'}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-102"
                    loading="lazy"
                  />
                </div>
              </button>
            ))}
          </div>
        )}

        {modalIndex !== null && images.length > 0 && (
          <ImageModal
            images={images}
            index={modalIndex}
            onClose={() => setModalIndex(null)}
            onPrev={() => setModalIndex((i) => Math.max(0, i - 1))}
            onNext={() => setModalIndex((i) => Math.min(images.length - 1, i + 1))}
          />
        )}
      </main>
    </div>
  );
}
