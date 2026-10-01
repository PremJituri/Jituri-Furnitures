import {
  Activity,
  Component,
  HomeIcon,
  MapPin,
  Package,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

import { Dock, DockIcon, DockItem, DockLabel } from '@/components/core/dock';
import { cn } from '@/lib/utils';

const data = [
  {
    title: 'Home',
    icon: (
      <HomeIcon className="h-[18px] w-[18px] text-[#0B1B2B]" />
    ),
    href: '/',
  },
  {
    title: 'Components',
    icon: (
      <Component className="h-[18px] w-[18px] text-[#0B1B2B]" />
    ),
    href: '#legacy',
  },
  {
    title: 'Activity',
    icon: (
      <Activity className="h-[18px] w-[18px] text-[#0B1B2B]" />
    ),
    href: '#process',
  },
  {
    title: 'Contact',
    icon: (
      <MapPin className="h-[18px] w-[18px] text-[#0B1B2B]" />
    ),
    href: '#contact',
  },
  {
    title: 'Products',
    icon: (
      <Package className="h-[18px] w-[18px] text-[#0B1B2B]" />
    ),
    href: '/collections',
  },
];

export function AppleStyleDock({
  className,
  dockClassName,
  panelHeight = 40,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (item) => {
    if (!item.href || item.href === '#') return;

    // When clicking Home, smoothly scroll to top of main page
    if (item.title === 'Home' || item.href === '/') {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        }, 50);
      }
      return;
    }

    if (item.href.startsWith('/#') || item.href.startsWith('#')) {
      const sectionId = item.href.replace(/^(\/#|#)/, '');
      if (location.pathname !== '/') {
        navigate(`/#${sectionId}`);
      } else {
        const elem = document.getElementById(sectionId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
      return;
    }

    navigate(item.href);
  };

  return (
    <div
      className={cn(
        'relative flex items-center justify-center overflow-visible',
        className
      )}
    >
      <Dock
        panelHeight={panelHeight}
        distance={90}
        className={cn(
          'items-center justify-center gap-5 sm:gap-6 md:gap-7 bg-transparent border-0 shadow-none px-2 py-0',
          dockClassName
        )}
      >
        {data.map((item, idx) => (
          <DockItem
            key={idx}
            onClick={() => handleItemClick(item)}
            className="aspect-square rounded-full text-[#0B1B2B] hover:bg-[#5BBBF7] transition-colors"
          >
            <DockLabel>{item.title}</DockLabel>
            <DockIcon>{item.icon}</DockIcon>
          </DockItem>
        ))}
      </Dock>
    </div>
  );
}
