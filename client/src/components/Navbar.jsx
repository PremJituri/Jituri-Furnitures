import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Activity,
  Component,
  HomeIcon,
  MapPin,
  Package,
  UserRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { AppleStyleDock } from './AppleStyleDock.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (!isHome) {
      navigate(`/#${id}`);
      return;
    }
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full px-4 sm:px-6 pointer-events-none">
      <header className="pointer-events-auto mx-auto my-3 md:my-5 max-w-[1200px] rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] px-5 py-3 shadow-soft transition-all">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo (Left) */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-[#5BBBF7] text-[#0B1B2B] transition-transform group-hover:scale-95 shadow-xs">
              <img
                src="/jf-logo.png"
                alt="Jituri Furnitures"
                width="22"
                height="22"
                className="h-[22px] w-[22px] object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[1.05rem] font-semibold tracking-[-0.02em] text-[#0B1B2B]">
                Jituri Furnitures
              </span>
            </div>
          </Link>

          {/* Top Header Tabs Panel (Center) */}
          <div className="hidden md:flex items-center justify-center overflow-visible">
            <AppleStyleDock panelHeight={40} />
          </div>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {user ? (
              <>
                <Link
                  to="/admin"
                  className="rounded-[2px] bg-[#0B1B2B] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 shadow-xs"
                >
                  Admin Dashboard
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-[2px] border border-[#D3E2F0] px-4 py-2 text-sm font-medium text-[#0B1B2B] transition-colors hover:bg-[#F4F8FC]"
                >
                  Log out
                </button>
              </>
            ) : (
              <div className="relative group flex items-center justify-center">
                <Link
                  to="/login"
                  aria-label="Admin Login"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[#0B1B2B] hover:bg-[#5BBBF7] transition-colors"
                >
                  <UserRound className="h-[18px] w-[18px]" />
                </Link>
                <div className="pointer-events-none absolute top-[calc(100%+8px)] right-0 whitespace-nowrap rounded-[2px] bg-[#0B1B2B] px-2.5 py-1 text-[0.72rem] font-semibold text-white shadow-lg opacity-0 transition-opacity duration-150 group-hover:opacity-100 z-50 tracking-tight">
                  Admin Login
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-[2px] border border-[#D3E2F0] text-[#0B1B2B] hover:bg-[#F4F8FC]"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mt-4 border-t border-[#D3E2F0] pt-4 md:hidden flex flex-col gap-2">
            <NavLink
              to="/"
              end
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-3 rounded-[2px] px-2.5 py-2 text-sm font-medium text-[#0B1B2B] hover:bg-[#EEF5FC] transition-colors"
            >
              <HomeIcon className="h-4 w-4 text-[#0B1B2B]" />
              <span>Home</span>
            </NavLink>
            <button
              type="button"
              onClick={() => scrollToSection('legacy')}
              className="flex items-center gap-3 rounded-[2px] px-2.5 py-2 text-left text-sm font-medium text-[#0B1B2B] hover:bg-[#EEF5FC] transition-colors"
            >
              <Component className="h-4 w-4 text-[#0B1B2B]" />
              <span>Components</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('process')}
              className="flex items-center gap-3 rounded-[2px] px-2.5 py-2 text-left text-sm font-medium text-[#0B1B2B] hover:bg-[#EEF5FC] transition-colors"
            >
              <Activity className="h-4 w-4 text-[#0B1B2B]" />
              <span>Activity</span>
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="flex items-center gap-3 rounded-[2px] px-2.5 py-2 text-left text-sm font-medium text-[#0B1B2B] hover:bg-[#EEF5FC] transition-colors"
            >
              <MapPin className="h-4 w-4 text-[#0B1B2B]" />
              <span>Contact</span>
            </button>
            <NavLink
              to="/collections"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-[2px] px-2.5 py-2 text-sm font-medium text-[#0B1B2B] hover:bg-[#EEF5FC] transition-colors"
            >
              <Package className="h-4 w-4 text-[#0B1B2B]" />
              <span>Products</span>
            </NavLink>
            <div className="border-t border-[#D3E2F0] pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="rounded-[2px] bg-[#0B1B2B] px-4 py-2.5 text-center text-sm font-medium text-white"
                  >
                    Admin Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="rounded-[2px] border border-[#D3E2F0] px-4 py-2 text-center text-sm font-medium text-[#0B1B2B]"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-[2px] border border-[#D3E2F0] px-4 py-2 text-center text-xs font-medium text-[#4A5D73] hover:text-[#0B1B2B] hover:bg-[#F4F8FC] transition-colors"
                >
                  <UserRound className="h-4 w-4" />
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
