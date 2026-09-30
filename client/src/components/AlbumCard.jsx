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
      className="group overflow-hidden rounded-2xl bg-white shadow-lg shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/15"
    >
      <div className="aspect-[4/3] overflow-hidden bg-surface">
        <img
          src={cover}
          alt={album.name ? `${album.name} collection` : 'Album cover'}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-5">
        <h2 className="text-lg font-semibold text-dark group-hover:text-primary">{album.name}</h2>
        {album.description && (
          <p className="mt-2 line-clamp-2 text-sm text-dark/65">{album.description}</p>
        )}
        <span className="mt-3 inline-flex items-center text-sm font-medium text-accent">
          View album
          <span className="ml-1 transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
