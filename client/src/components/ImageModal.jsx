import { useEffect, useCallback, useRef, useState } from 'react';

export default function ImageModal({ images, index, onClose, onPrev, onNext }) {
  const current = images[index];
  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;
  const closeBtnRef = useRef(null);

  // Focus close button on mount for accessibility
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

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
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [handleKey]);

  // Touch swipe gesture support for mobile / tablet
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);

  const handleTouchStart = (e) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance && hasNext) {
      onNext();
    } else if (distance < -minSwipeDistance && hasPrev) {
      onPrev();
    }
  };

  if (!current) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#111111]/95 p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`Photograph ${index + 1} of ${images.length}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close image preview backdrop"
        onClick={onClose}
      />
      <div className="relative z-10 flex max-h-[94vh] max-w-5xl w-full flex-col items-center">
        {/* Top Control Bar */}
        <div className="mb-2 sm:mb-3 flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#5BBBF7] px-2.5 py-0.5 text-xs font-bold text-[#0B1B2B]">
              {index + 1} / {images.length}
            </span>
            <span className="text-xs font-medium text-white/80">
              Photograph Preview
            </span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="flex min-h-[38px] items-center justify-center rounded-[2px] bg-white px-4 py-1.5 text-xs font-semibold text-[#0B1B2B] transition-opacity hover:opacity-90 active:scale-95"
            aria-label="Close preview"
          >
            Close ✕
          </button>
        </div>

        {/* Main Image */}
        <div className="relative flex max-h-[75vh] sm:max-h-[80vh] w-full items-center justify-center overflow-hidden rounded-[2px] border border-white/10 bg-black/40">
          <img
            src={current.url}
            alt={`Photograph ${index + 1} of ${images.length}`}
            className="max-h-[73vh] sm:max-h-[78vh] max-w-full object-contain select-none"
            draggable={false}
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
            className="flex min-h-[40px] items-center rounded-[2px] border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white transition-all hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Previous image"
          >
            ← Previous
          </button>
          <div className="hidden sm:block text-xs text-white/60">
            Use arrow keys, buttons, or swipe to navigate
          </div>
          <button
            type="button"
            disabled={!hasNext}
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="flex min-h-[40px] items-center rounded-[2px] border border-white/20 bg-white/10 px-5 py-2 text-xs font-medium text-white transition-all hover:bg-white/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-25"
            aria-label="Next image"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
