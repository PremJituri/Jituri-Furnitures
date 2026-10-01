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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/95 p-4 sm:p-6"
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
      <div className="relative z-10 flex max-h-[92vh] max-w-5xl w-full flex-col items-center">
        {/* Top Control Bar */}
        <div className="mb-3 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#5BBBF7] px-2.5 py-0.5 text-xs font-bold text-[#0B1B2B]">
              {index + 1} / {images.length}
            </span>
            <span className="text-xs font-medium text-white/80">
              Photograph Preview
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[2px] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#0B1B2B] transition-opacity hover:opacity-90"
          >
            Close ✕
          </button>
        </div>

        {/* Main Image */}
        <div className="relative flex max-h-[80vh] w-full items-center justify-center overflow-hidden rounded-[2px] border border-white/10 bg-black/40">
          <img
            src={current.url}
            alt="Furniture showcase item"
            className="max-h-[78vh] max-w-full object-contain"
          />
        </div>

        {/* Bottom Pagination Controls */}
        <div className="mt-3 flex w-full items-center justify-between gap-4">
          <button
            type="button"
            disabled={!hasPrev}
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="rounded-[2px] border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-25"
          >
            ← Previous
          </button>
          <div className="hidden sm:block text-xs text-white/60">
            Use arrow keys or buttons to navigate
          </div>
          <button
            type="button"
            disabled={!hasNext}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="rounded-[2px] border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-25"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
