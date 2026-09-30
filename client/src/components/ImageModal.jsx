import { useEffect, useCallback } from 'react';

export default function ImageModal({ images, index, onClose, onPrev, onNext }) {
  const current = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
      if (e.key === 'ArrowRight' && hasNext) onNext();
    },
    [onClose, onPrev, onNext, hasPrev, hasNext]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/90 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Image preview"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[90vh] max-w-5xl flex-col items-center">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
        >
          Close
        </button>
        <img
          src={current.url}
          alt={current.original_name || 'Catalog image'}
          className="max-h-[85vh] max-w-full rounded-2xl object-contain shadow-2xl"
        />
        <div className="mt-4 flex w-full items-center justify-between gap-4">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-30 hover:bg-white/25"
          >
            Previous
          </button>
          <span className="text-sm text-white/80">
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            disabled={!hasNext}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="rounded-xl bg-white/15 px-5 py-3 text-sm font-semibold text-white transition-all disabled:opacity-30 hover:bg-white/25"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
