import { Link } from 'react-router-dom';

/** Professional furniture interiors (Unsplash) — used when the album has no uploaded cover yet. */
const COLLECTION_COVER_BY_SLUG = {
  sofa:
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&h=675&fit=crop&q=85&auto=format',
  bed:
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&h=675&fit=crop&q=85&auto=format',
  dining:
    'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=900&h=675&fit=crop&q=85&auto=format',
};

function resolveCoverUrl(album) {
  if (album.coverUrl) return album.coverUrl;
  const fallback = COLLECTION_COVER_BY_SLUG[album.slug];
  if (fallback) return fallback;
  return '/placeholder-album.svg';
}

export default function AlbumCard({ album }) {
  const cover = resolveCoverUrl(album);

  return (
    <Link
      to={`/album/${album.slug}`}
      className="group flex flex-col justify-between overflow-hidden rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] shadow-soft transition-all duration-200 hover:-translate-y-1 hover:border-[#0B1B2B]/30"
    >
      <div>
        <div className="aspect-[4/3] overflow-hidden bg-[#F4F8FC] border-b border-[#D3E2F0]">
          <img
            src={cover}
            alt={album.name ? `${album.name} collection` : 'Album cover'}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-102"
            loading="lazy"
          />
        </div>
        <div className="p-6">
          <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-[#4A5D73]">
            Curated Album
          </span>
          <h2 className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-[#0B1B2B]">
            {album.name}
          </h2>
          {album.description && (
            <p className="mt-2 line-clamp-2 text-sm text-[#4A5D73] leading-[1.6]">
              {album.description}
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-[#D3E2F0] px-6 py-4">
        <span className="inline-flex items-center text-sm font-semibold text-[#0B1B2B] transition-transform group-hover:translate-x-1">
          View Collection Album →
        </span>
      </div>
    </Link>
  );
}
