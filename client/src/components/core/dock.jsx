'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from 'framer-motion';
import {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

const DEFAULT_DISTANCE = 90;
const DEFAULT_PANEL_HEIGHT = 40;

const DockContext = createContext(undefined);

function DockProvider({ children, value }) {
  return <DockContext.Provider value={value}>{children}</DockContext.Provider>;
}

function useDock() {
  const context = useContext(DockContext);
  if (!context) {
    throw new Error('useDock must be used within an DockProvider');
  }
  return context;
}

function Dock({
  children,
  className,
  spring = { mass: 0.1, stiffness: 200, damping: 16 },
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
}) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      style={{ height: panelHeight }}
      className="flex items-center justify-center overflow-visible"
    >
      <div
        onMouseMove={(e) => {
          mouseX.set(e.clientX);
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity);
        }}
        className={cn(
          'flex items-center gap-5 sm:gap-6 overflow-visible',
          className
        )}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Application dock"
      >
        <DockProvider value={{ mouseX, spring, distance }}>
          {children}
        </DockProvider>
      </div>
    </div>
  );
}

function DockItem({ children, className, onClick }) {
  const ref = useRef(null);
  const { distance, mouseX, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const domRect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - domRect.x - domRect.width / 2;
  });

  // Scale: 1 at rest, up to 1.25 when hovered
  const scaleTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [1, 1.25, 1]
  );
  const scale = useSpring(scaleTransform, spring);

  // Pop up: only the icon lifts up vertically by -4px
  const yTransform = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [0, -4, 0]
  );
  const y = useSpring(yTransform, spring);

  return (
    <div
      ref={ref}
      className="relative flex items-center justify-center overflow-visible"
      style={{ width: 36, height: 36 }}
    >
      <motion.div
        style={{ scale, y }}
        onHoverStart={() => isHovered.set(1)}
        onHoverEnd={() => isHovered.set(0)}
        onFocus={() => isHovered.set(1)}
        onBlur={() => isHovered.set(0)}
        className={cn(
          'relative flex h-9 w-9 items-center justify-center cursor-pointer select-none rounded-full origin-bottom transition-colors duration-150',
          className
        )}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        onClick={onClick}
      >
        {Children.map(children, (child) =>
          cloneElement(child, { isHovered })
        )}
      </motion.div>
    </div>
  );
}

function DockLabel({ children, className, ...rest }) {
  const isHovered = rest['isHovered'];
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsubscribe = isHovered.on('change', (latest) => {
      setIsVisible(latest === 1);
    });

    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.95 }}
          transition={{ duration: 0.12 }}
          className={cn(
            'absolute top-[calc(100%+8px)] left-1/2 w-fit whitespace-nowrap rounded-[2px] bg-[#0B1B2B] px-2.5 py-1 text-[0.72rem] font-semibold text-white shadow-lg z-50 pointer-events-none tracking-tight',
            className
          )}
          role="tooltip"
          style={{ x: '-50%' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className }) {
  return (
    <div className={cn('flex items-center justify-center h-4 w-4 sm:h-[18px] sm:w-[18px]', className)}>
      {children}
    </div>
  );
}

export { Dock, DockIcon, DockItem, DockLabel };
