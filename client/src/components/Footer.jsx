import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-[#D3E2F0] bg-[#FFFFFF]">
      <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-[2px] bg-[#5BBBF7] text-[#0B1B2B]">
                <img
                  src="/jf-logo.png"
                  alt="Jituri Furnitures"
                  width="22"
                  height="22"
                  className="h-[22px] w-[22px] object-contain"
                />
              </div>
              <span className="text-[1.1rem] font-semibold tracking-[-0.02em] text-[#0B1B2B]">
                Jituri Furnitures
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-[#4A5D73] leading-[1.6]">
              Timeless design, honest materials, and craftsmanship you can feel in every piece we build.
              Crafting premium bespoke furniture in Belagavi since 2005.
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs font-medium text-[#0B1B2B]">
              <span className="rounded-full bg-[#EEF5FC] px-3 py-1 border border-[#D3E2F0]">
                21+ Years Experience
              </span>
              <span className="rounded-full bg-[#EEF5FC] px-3 py-1 border border-[#D3E2F0]">
                1000+ Customers
              </span>
              <span className="rounded-full bg-[#EEF5FC] px-3 py-1 border border-[#D3E2F0]">
                30+ Hotels
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0B1B2B]">
              Navigation
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-[#4A5D73] transition-colors hover:text-[#0B1B2B]">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-[#4A5D73] transition-colors hover:text-[#0B1B2B]">
                  Collections Catalog
                </Link>
              </li>
              <li>
                <Link to="/#legacy" className="text-[#4A5D73] transition-colors hover:text-[#0B1B2B]">
                  In-House Craftsmanship
                </Link>
              </li>
              <li>
                <Link to="/#process" className="text-[#4A5D73] transition-colors hover:text-[#0B1B2B]">
                  6-Step Process
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#4A5D73] transition-colors hover:text-[#0B1B2B]">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Factory Address & Hours */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#0B1B2B]">
              Factory Location
            </p>
            <div className="mt-4 space-y-1 text-sm text-[#4A5D73] leading-[1.6]">
              <p className="font-medium text-[#0B1B2B]">Bhatia compound, Khanapur Rd</p>
              <p>Behind Sukh-Shanti Hotel, Mahveer Nagar</p>
              <p>Belagavi, Karnataka 590008</p>
              <p className="pt-2 text-xs text-[#4A5D73]">Mon – Sat: 10:00 AM – 6:00 PM</p>
              <p className="text-xs font-medium text-[#0B1B2B]">Phone: +91 98452 58760</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-[#D3E2F0] pt-8 sm:flex-row">
          <p className="text-xs text-[#4A5D73]">
            © {new Date().getFullYear()} Jituri Furnitures. All rights reserved.
          </p>
          <div className="mt-4 flex gap-6 text-xs text-[#4A5D73] sm:mt-0">
            <span>Woodworking</span>
            <span>•</span>
            <span>Cushioning</span>
            <span>•</span>
            <span>Hand Polishing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
