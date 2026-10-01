import { useState } from 'react';
import { Link } from 'react-router-dom';

const FACTORY_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=900&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=900&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=900&q=80',
];

const MAP_EMBED =
  'https://www.google.com/maps?q=Jituri+Furnitures%2C+Bhatia+compound%2C+Khanapur+Rd%2C+behind+Sukh-Shanti+Hotel%2C+Mahveer+Nagar%2C+Belagavi%2C+Karnataka+590008&output=embed';

export default function Home() {
  // Accordion state for Section 2
  const [activeAccordion, setActiveAccordion] = useState(0);

  // Tab state for Section 3
  const [activeTab, setActiveTab] = useState('residential');


  // Section 2 Accordion items
  const legacyAccordionItems = [
    {
      title: 'Complete In-House Facility in Belagavi',
      content:
        'Every single piece is built entirely within our own facility in Belagavi. Three dedicated sections—woodworking, cushioning, and hand polishing—work together seamlessly under one roof. This end-to-end control ensures consistent quality, millimeter precision, and meticulous attention to detail at every stage of construction.',
    },
    {
      title: 'Craftsmanship as an Uncompromising Standard',
      content:
        'At our factory, craftsmanship is not merely a process—it is our defining standard. We combine solid joinery construction for lifelong durability, thoughtful human proportions for comfort and usability, and carefully selected organic finishes suited for active everyday living.',
    },
    {
      title: 'Over 21 Years of Heritage & 1,000+ Completed Projects',
      content:
        'Since 2005, Jituri Furnitures has served over 1,000 discerning private homeowners and more than 30 commercial hotels and resorts. Our pieces are engineered to gracefully withstand decades of daily use without ever losing their structural integrity or aesthetic appeal.',
    },
    {
      title: 'Direct Client Collaboration from Concept to Install',
      content:
        'We work closely with clients, interior designers, and architects to understand their space, lifestyle, and aesthetic sensibilities—transforming raw sketches and concepts into furniture that feels deeply personal, highly functional, and enduring.',
    },
  ];

  // Section 3 Tabs data
  const solutionsData = {
    residential: [
      {
        title: 'Custom Sofas & Lounge Seating',
        tag: 'Living Space',
        p1: 'Solid seasoned timber frames combined with multi-density ergonomic foams engineered for lasting shape retention and balanced lumbar support.',
        p2: 'Tailored in high-abrasion stain-resistant jacquards, Belgian linens, or top-grain leatherette designed for everyday family warmth.',
        linkText: 'Check Details →',
        href: '/collections',
      },
      {
        title: 'Master Bed Frames & Storage',
        tag: 'Resting Suites',
        p1: 'Handcrafted solid wood bed suites, upholstered ergonomic headboards, and heavy-duty smooth hydraulic storage bases built for quiet longevity.',
        p2: 'Sealed with organic zero-VOC hand stains that preserve the authentic wood grain while eliminating squeaks and structural fatigue.',
        linkText: 'Check Details →',
        href: '/collections',
      },
      {
        title: 'Solid Wood Dining & Benches',
        tag: 'Dining & Gathering',
        p1: 'Artisan-jointed dining tables carved from single timber slabs or seasoned hardwoods, paired with ergonomically contoured dining chairs.',
        p2: 'Heat-resistant, spill-safe protective hand finishes designed to endure everyday family meals and festive banquets for decades.',
        linkText: 'Check Details →',
        href: '/collections',
      },
    ],
    commercial: [
      {
        title: 'Boutique Hotel Guestroom Suites',
        tag: 'Hospitality',
        p1: 'Complete turnkey furniture packages including headboards, nightstands, writing desks, and luggage benches fabricated to architectural tolerances.',
        p2: 'Commercial-grade materials tested to withstand rigorous guest turnover while maintaining an upscale, inviting residential warmth.',
        linkText: 'Check Details →',
        href: '/collections',
      },
      {
        title: 'Restaurant Booths & Dining Seating',
        tag: 'Cafes & Dining',
        p1: 'High-density seating banquettes, barstools, and heavy pedestal tables engineered for constant footfall and quick sanitization cycles.',
        p2: 'Reinforced joint assemblies and commercial anti-wear fabrics specified for hospitality operators across Karnataka and Goa.',
        linkText: 'Check Details →',
        href: '/collections',
      },
      {
        title: 'Executive Lounges & Reception Desks',
        tag: 'Corporate & Retail',
        p1: 'Distinctive focal reception counters, board room conference tables, and comfortable visitor accent seating crafted with architectural precision.',
        p2: 'Seamless integrated wire management and premium natural wood veneers that reflect corporate prestige and timeless reliability.',
        linkText: 'Check Details →',
        href: '/collections',
      },
    ],
    bespoke: [
      {
        title: 'Custom Millwork & Wall Paneling',
        tag: 'Architectural Woodwork',
        p1: 'Site-measured fluted timber wall slats, acoustic wood paneling, and bespoke TV credenza backdrops built to exact architectural elevations.',
        p2: 'Crafted in-house and pre-assembled at our factory to ensure rapid, dust-free on-site installation at your residence.',
        linkText: 'Check Details →',
        href: '/collections',
      },
      {
        title: 'Heritage Restoration & Replication',
        tag: 'Specialty Woodcraft',
        p1: 'Painstaking structural restoration, re-upholstery, and traditional French polishing for heirloom vintage pieces and ancestral teak furniture.',
        p2: 'Preserving authentic historical details and patinas while reinforcing the internal framework with modern durability standards.',
        linkText: 'Check Details →',
        href: '/collections',
      },
      {
        title: 'Bespoke Bar Units & Display Credenzas',
        tag: 'Entertaining',
        p1: 'Custom bar cabinets with soft-close brass hardware, tinted glass displays, integrated ambient warm lighting, and stemware racks.',
        p2: 'Hand-finished in rich walnut, dark ebony, or natural teak tones tailored to become the centerpiece of your home entertaining zone.',
        linkText: 'Check Details →',
        href: '/collections',
      },
    ],
  };

  // Section 4: 6-Step Process
  const processSteps = [
    {
      step: '1',
      title: 'Space & Lifestyle Consultation',
      desc: 'We examine your room plans, natural lighting, and daily living patterns to establish ideal proportions and functional goals.',
    },
    {
      step: '2',
      title: 'Timber & Textile Selection',
      desc: 'Clients choose from seasoned solid hardwoods and tested high-rub commercial upholstery fabrics with tactile finish samples.',
    },
    {
      step: '3',
      title: 'Precision In-House Woodworking',
      desc: 'Master carpenters build rock-solid internal structural frames using time-honored mortise-and-tenon joinery methods.',
    },
    {
      step: '4',
      title: 'Ergonomic Cushioning & Tailoring',
      desc: 'Multi-layer high-density foams and down-alternative wraps are hand-cut and tailored for balanced support and enduring shape.',
    },
    {
      step: '5',
      title: 'Multi-Stage Hand Polishing',
      desc: 'Rigorous multi-grit sanding followed by stain application and protective eco-friendly clear coats highlights natural timber grains.',
    },
    {
      step: '6',
      title: 'Factory Inspection & White-Glove Setup',
      desc: 'Comprehensive quality verification at our Belagavi facility before careful transport, direct placement, and on-site positioning.',
    },
  ];

  // FAQ Items
  const faqItems = [
    {
      q: 'Can I customize dimensions, fabric colors, and cushion firmness?',
      a: 'Yes, absolutely. Because every single piece is manufactured inside our own Belagavi factory, we have 100% control over length, depth, seat height, wood polish tone, and foam resilience. We tailor each item to your exact room specifications.',
    },
    {
      q: 'Where is your factory located and can clients visit during production?',
      a: 'Our factory and showroom are located at Bhatia compound, Khanapur Rd, behind Sukh-Shanti Hotel, Mahveer Nagar, Belagavi, Karnataka 590008. We warmly encourage visitors to stop by between 10:00 AM and 8:00 PM to see our woodworking, cushioning, and polishing units in live operation.',
    },
    {
      q: 'Do you undertake large commercial orders for hotels and resorts?',
      a: 'Yes. With over 21 years of experience, we have successfully furnished more than 30 commercial hotels, luxury homestays, and fine-dining restaurants across Belagavi, Hubballi, Dharwad, Goa, and Maharashtra. We offer specialized commercial pricing and strict milestone schedules.',
    },
    {
      q: 'What types of wood and materials do you use for construction?',
      a: 'We strictly utilize well-seasoned solid hardwoods, genuine teak, and premium-grade structural marine plywood for internal framing. For cushioning, we rely on certified high-resilience ergonomic foams, paired with stain-resistant commercial woven fabrics, linens, and durable leatherettes.',
    },
    {
      q: 'What is the standard production timeline for custom orders?',
      a: 'Single residential pieces generally require 2 to 3 weeks from design confirmation to final polishing. Complete residence packages typically take 4 to 6 weeks, while commercial hospitality schedules are aligned with your property handover dates.',
    },
  ];

  return (
    <div className="bg-[#FFFFFF] text-[#0B1B2B]">
      {/* =========================================================================
          SECTION 1: HERO SECTION (--bg-sage: #EEF5FC)
          ========================================================================= */}
      <section id="top" className="relative overflow-hidden bg-[#EEF5FC] -mt-[92px] md:-mt-[108px] pt-[116px] md:pt-[140px] pb-24 md:pb-32">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 min-h-[75vh]">
            {/* Left Column (50%) */}
            <div className="flex flex-col items-start z-10">
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#5BBBF7] px-3.5 py-1 text-[0.8rem] font-semibold tracking-tight text-[#0B1B2B]">
                <span>Belagavi • Est. 2005</span>
              </div>

              {/* Large H1 Headline */}
              <h1 className="editorial-h1 mt-6">
                Timeless design, honest materials & enduring craft.
              </h1>

              {/* Concise Subheadline */}
              <p className="editorial-body mt-6">
                Since 2005, Jituri Furnitures has been crafting furniture that blends comfort,
                durability, and refined aesthetics. Complete in-house woodworking, cushioning, and
                polishing at our Belagavi facility.
              </p>

              {/* Button Group */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/collections"
                  className="rounded-[2px] border-[1.5px] border-[#0B1B2B] bg-transparent px-7 py-3 text-[0.95rem] font-medium text-[#0B1B2B] transition-all duration-200 hover:bg-[#0B1B2B] hover:text-white"
                >
                  Explore Collections →
                </Link>
                <a
                  href="#contact"
                  className="rounded-[2px] bg-[#0B1B2B] px-7 py-3 text-[0.95rem] font-medium text-white transition-opacity hover:opacity-90"
                >
                  Plan Your Space
                </a>
              </div>

              {/* Micro-prompt */}
              <div className="mt-12 flex items-center gap-2 text-[0.85rem] font-medium text-[#4A5D73]/80">
                <span>Keep scrolling</span>
                <span className="animate-bounce">↓</span>
              </div>
            </div>

            {/* Right Column (50%): Dynamic Overlapping Visual Composition */}
            <div className="relative flex items-center justify-center py-8 lg:py-0">
              {/* Background square --accent-lime card */}
              <div className="relative aspect-square w-full max-w-[440px] rounded-[4px] bg-[#5BBBF7] p-6 shadow-soft flex flex-col justify-between overflow-hidden">
                {/* Decorative architectural grid lines */}
                <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#0B1B2B_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="flex items-center justify-between z-10">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1B2B]">
                    Belagavi Workshop
                  </span>
                  <span className="rounded-full bg-[#0B1B2B] px-2.5 py-0.5 text-[0.7rem] font-medium text-white">
                    21+ Years
                  </span>
                </div>

                {/* Secondary Graphic Accent: Soft Lavender micro-card badge (#D59BF6) */}
                <div className="absolute bottom-6 left-6 z-20 rounded-[2px] bg-[#D59BF6] px-3.5 py-2 text-xs font-semibold text-[#0B1B2B] shadow-sm">
                  100% In-House Production
                </div>

                <div className="text-right z-10 self-end">
                  <span className="block text-3xl font-semibold tracking-tight text-[#0B1B2B]">
                    1000+
                  </span>
                  <span className="text-xs font-medium text-[#0B1B2B]/80">Clients Served</span>
                </div>
              </div>

              {/* Overlapping Angled Product Card (Tilted with soft drop shadow) */}
              <div
                className="absolute w-[82%] sm:w-[75%] max-w-[360px] rounded-[4px] bg-[#FFFFFF] p-2.5 shadow-mockup border border-[#0B1B2B]/10 transition-transform duration-500 hover:rotate-0"
                style={{
                  transform: 'rotate(-12deg) translateY(12px) translateX(16px)',
                }}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] bg-[#F4F8FC]">
                  <img
                    src={FACTORY_IMAGES[0]}
                    alt="Handcrafted luxury sofa living setup"
                    className="h-full w-full object-cover"
                    loading="eager"
                  />
                  {/* Secondary Graphic Accent: Ink Black tag badge (#111111) */}
                  <div className="absolute top-2.5 left-2.5 rounded-[2px] bg-[#111111] px-2.5 py-1 text-[0.7rem] font-medium text-white">
                    Featured Collection
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-[#0B1B2B]">Custom Lounge Seating</p>
                    <span className="text-[0.7rem] font-semibold text-[#4A5D73]">Teak & Linen</span>
                  </div>
                  <p className="mt-1 text-[0.75rem] text-[#4A5D73]">
                    Hand-carved internal hardwood frame • Triple-density cushioning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: PRIMARY FEATURE SPLIT + INTERACTIVE ACCORDION (#FFFFFF)
          ========================================================================= */}
      <section id="legacy" className="bg-[#FFFFFF] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column: Large Square --bg-card-muted (#F4F8FC) container with angled overlapping cards */}
            <div className="relative min-h-[460px] md:min-h-[520px] rounded-[4px] border border-[#D3E2F0] bg-[#F4F8FC] p-6 sm:p-10 flex flex-col justify-between overflow-hidden">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block rounded-full bg-[#5BBBF7] px-3 py-1 text-xs font-semibold text-[#0B1B2B]">
                    Factory Floor
                  </span>
                  <h3 className="editorial-h3 mt-3">Three Units. One Roof.</h3>
                  <p className="mt-1 text-xs text-[#4A5D73]">
                    Woodworking • Cushioning • Polishing
                  </p>
                </div>
                <span className="text-xs font-mono text-[#4A5D73]">BELAGAVI, KA</span>
              </div>

              {/* Angled overlapping product cards at the bottom */}
              <div className="relative mt-8 h-64 sm:h-72 w-full">
                {/* Background angled card */}
                <div
                  className="absolute bottom-4 left-4 w-4/5 rounded-[2px] bg-white p-2 border border-[#D3E2F0] shadow-soft"
                  style={{ transform: 'rotate(-6deg)' }}
                >
                  <img
                    src={FACTORY_IMAGES[1]}
                    alt="Woodworking craftsmanship"
                    className="aspect-[16/10] w-full rounded-[2px] object-cover"
                    loading="lazy"
                  />
                  <div className="mt-2 flex justify-between px-1 text-[0.75rem] text-[#4A5D73]">
                    <span>Precision Joinery</span>
                    <span>100% Seasoned Hardwood</span>
                  </div>
                </div>

                {/* Foreground angled card */}
                <div
                  className="absolute bottom-0 right-4 w-4/5 rounded-[2px] bg-white p-2 border border-[#D3E2F0] shadow-mockup"
                  style={{ transform: 'rotate(4deg)' }}
                >
                  <img
                    src={FACTORY_IMAGES[2]}
                    alt="Hand polishing and finishing"
                    className="aspect-[16/10] w-full rounded-[2px] object-cover"
                    loading="lazy"
                  />
                  <div className="mt-2 flex justify-between px-1 text-[0.75rem] font-medium text-[#0B1B2B]">
                    <span>Hand Polished Dining</span>
                    <span>Natural Grain Finish</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Pill 1 + H2 + Intro + Stacked Accordion */}
            <div className="flex flex-col">
              {/* Numbered Pill Badge */}
              <div className="inline-flex w-fit items-center justify-center rounded-full bg-[#5BBBF7] px-3.5 py-1 text-[0.8rem] font-semibold text-[#0B1B2B]">
                1
              </div>

              {/* H2 Section Heading */}
              <h2 className="editorial-h2 mt-4">
                Our legacy and complete in-house production.
              </h2>

              {/* Introductory Paragraph */}
              <p className="editorial-body mt-5">
                Since 2005, Jituri Furnitures has been crafting furniture that blends comfort,
                durability, and refined aesthetics. With over 21 years of experience, we have
                proudly served 1,000+ customers and 30+ hotels, delivering pieces that stand the
                test of time.
              </p>

              {/* Stacked Accordion List */}
              <div className="mt-8 divide-y divide-[#D3E2F0] border-t border-[#D3E2F0]">
                {legacyAccordionItems.map((item, idx) => {
                  const isOpen = activeAccordion === idx;
                  return (
                    <div key={idx} className="py-4">
                      <button
                        type="button"
                        onClick={() => setActiveAccordion(isOpen ? -1 : idx)}
                        className="flex w-full items-center justify-between text-left transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[1.05rem] font-medium text-[#0B1B2B]">
                          {item.title}
                        </span>
                        <span
                          className={`ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#D3E2F0] text-sm text-[#0B1B2B] transition-transform duration-200 ${
                            isOpen ? 'rotate-45 bg-[#5BBBF7] border-[#5BBBF7]' : 'bg-[#FFFFFF]'
                          }`}
                        >
                          +
                        </span>
                      </button>
                      {isOpen && (
                        <div className="mt-3 pr-8 text-[0.95rem] text-[#4A5D73] leading-[1.6]">
                          {item.content}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: TABBED SOLUTIONS / SERVICES SHOWCASE (--bg-sage or #FFFFFF)
          ========================================================================= */}
      <section className="bg-[#EEF5FC] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-[#5BBBF7] px-3.5 py-1 text-[0.8rem] font-semibold text-[#0B1B2B]">
              2
            </div>
            <h2 className="editorial-h2 mt-4">
              Craftsmanship & tailored furniture solutions.
            </h2>
            <p className="editorial-body mt-3 text-center">
              We combine solid construction for long-lasting durability, thoughtful proportions for
              comfort and usability, and carefully selected finishes suited for everyday living.
            </p>

            {/* Segmented Pill Toggle Switch */}
            <div className="mt-8 inline-flex items-center rounded-full border border-[#D3E2F0] bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setActiveTab('residential')}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'residential'
                    ? 'bg-[#0B1B2B] text-white shadow-sm'
                    : 'text-[#4A5D73] hover:text-[#0B1B2B]'
                }`}
              >
                Residential Living
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('commercial')}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'commercial'
                    ? 'bg-[#0B1B2B] text-white shadow-sm'
                    : 'text-[#4A5D73] hover:text-[#0B1B2B]'
                }`}
              >
                Hotels & Commercial
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('bespoke')}
                className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'bespoke'
                    ? 'bg-[#0B1B2B] text-white shadow-sm'
                    : 'text-[#4A5D73] hover:text-[#0B1B2B]'
                }`}
              >
                Bespoke Joinery
              </button>
            </div>
          </div>

          {/* 3-Column Feature Grid */}
          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {solutionsData[activeTab].map((card, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] p-8 shadow-soft transition-all duration-200 hover:-translate-y-1"
              >
                <div>
                  <span className="text-[0.75rem] font-semibold uppercase tracking-wider text-[#4A5D73]">
                    {card.tag}
                  </span>
                  <h3 className="editorial-h3 mt-2">{card.title}</h3>
                  <p className="mt-4 text-[0.95rem] text-[#4A5D73] leading-[1.6]">
                    {card.p1}
                  </p>
                  <p className="mt-3 text-[0.95rem] text-[#4A5D73] leading-[1.6]">
                    {card.p2}
                  </p>
                </div>
                <div className="mt-8 border-t border-[#D3E2F0] pt-5">
                  <Link
                    to={card.href}
                    className="inline-flex items-center text-sm font-semibold text-[#0B1B2B] transition-opacity hover:opacity-75"
                  >
                    <span>{card.linkText}</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: STEP-BY-STEP PROCESS GRID (#FFFFFF)
          ========================================================================= */}
      <section id="process" className="bg-[#FFFFFF] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-[#5BBBF7] px-3.5 py-1 text-[0.8rem] font-semibold text-[#0B1B2B]">
              3
            </div>
            <h2 className="editorial-h2 mt-4">
              Our 6-step in-house manufacturing process.
            </h2>
            <p className="editorial-body mt-3 text-center">
              Every detail is handled with precision under one roof at our Belagavi factory,
              ensuring complete quality control and consistency from day one.
            </p>
          </div>

          {/* 6-step grid (3 cols desktop, 1 on mobile) */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {processSteps.map((step) => (
              <div
                key={step.step}
                className="flex flex-col rounded-[4px] border border-[#D3E2F0] bg-[#F4F8FC] p-7 transition-all duration-200 hover:border-[#0B1B2B]/30"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5BBBF7] text-sm font-bold text-[#0B1B2B]">
                    {step.step}
                  </div>
                  <span className="text-xs font-mono text-[#4A5D73]">STAGE 0{step.step}</span>
                </div>
                <h3 className="editorial-h3 mt-5">{step.title}</h3>
                <p className="mt-3 text-[0.95rem] text-[#4A5D73] leading-[1.6]">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: FACTORY LOCATION, MAP & CONTACT DETAILS (#FFFFFF)
          ========================================================================= */}
      <section id="contact" className="bg-[#FFFFFF] py-20 md:py-28">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center justify-center rounded-full bg-[#5BBBF7] px-3.5 py-1 text-[0.8rem] font-semibold text-[#0B1B2B]">
              4
            </div>
            <h2 className="editorial-h2 mt-4">
              Visit our factory & showroom.
            </h2>
            <p className="editorial-body mt-3 text-center">
              Experience the woods, foams, and fabrics firsthand in Belagavi. Walk into our workshop
              or connect with our master craftsmen directly.
            </p>
          </div>

          {/* Centered & Spread 3-Column Contact Information Grid */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1: Factory Address */}
            <div className="flex flex-col justify-between rounded-[4px] border border-[#D3E2F0] bg-[#F4F8FC] p-7 shadow-soft transition-all duration-200 hover:border-[#0B1B2B]/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-[#4A5D73]">
                    Belagavi Facility
                  </span>
                  <span className="rounded-full bg-[#5BBBF7]/20 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#0B1B2B]">
                    Location
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#0B1B2B]">
                  Factory & Showroom
                </h3>
                <p className="mt-2 text-sm text-[#4A5D73] leading-[1.6]">
                  Bhatia compound, Khanapur Rd, behind Sukh-Shanti Hotel, Mahveer Nagar, Belagavi, Karnataka 590008
                </p>
              </div>
              <div className="mt-6 border-t border-[#D3E2F0] pt-4">
                <a
                  href="https://maps.google.com/?q=Jituri+Furnitures%2C+Bhatia+compound%2C+Khanapur+Rd%2C+behind+Sukh-Shanti+Hotel%2C+Mahveer+Nagar%2C+Belagavi%2C+Karnataka+590008"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-[#0B1B2B] hover:underline"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>

            {/* Card 2: Visiting Hours */}
            <div className="flex flex-col justify-between rounded-[4px] border border-[#D3E2F0] bg-[#F4F8FC] p-7 shadow-soft transition-all duration-200 hover:border-[#0B1B2B]/20">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-[#4A5D73]">
                    Working Hours
                  </span>
                  <span className="rounded-full bg-[#5BBBF7]/20 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#0B1B2B]">
                    Mon – Sat
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#0B1B2B]">
                  Visiting & Consultation
                </h3>
                <p className="mt-2 text-sm text-[#4A5D73] leading-[1.6]">
                  Monday – Saturday: <strong className="text-[#0B1B2B]">10:00 AM – 8:00 PM</strong>
                </p>
                <p className="mt-1 text-xs text-[#4A5D73]">
                  Walk-ins welcome for personal timber inspections and custom orders. Sunday by appointment.
                </p>
              </div>
              <div className="mt-6 border-t border-[#D3E2F0] pt-4">
                <span className="inline-flex items-center text-xs font-semibold text-[#4A5D73]">
                  Walk-ins Warmly Welcome
                </span>
              </div>
            </div>

            {/* Card 3: Direct Contact */}
            <div className="flex flex-col justify-between rounded-[4px] border border-[#D3E2F0] bg-[#F4F8FC] p-7 shadow-soft transition-all duration-200 hover:border-[#0B1B2B]/20 sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[0.72rem] font-semibold uppercase tracking-wider text-[#4A5D73]">
                    Direct Inquiries
                  </span>
                  <span className="rounded-full bg-[#5BBBF7]/20 px-2.5 py-0.5 text-[0.7rem] font-semibold text-[#0B1B2B]">
                    Phone & Reception
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[#0B1B2B]">
                  Call Factory Reception
                </h3>
                <p className="mt-2 text-sm text-[#4A5D73] leading-[1.6]">
                  Direct Phone:{' '}
                  <a href="tel:+919448112345" className="font-semibold text-[#0B1B2B] hover:underline">
                    +91 94481 12345
                  </a>
                </p>
                <p className="mt-1 text-xs text-[#4A5D73]">
                  In-House Units: Woodworking, Cushioning & Hand Polishing on-site.
                </p>
              </div>
              <div className="mt-6 border-t border-[#D3E2F0] pt-4">
                <a
                  href="tel:+919448112345"
                  className="inline-flex items-center text-xs font-semibold text-[#0B1B2B] hover:underline"
                >
                  Call +91 94481 12345 →
                </a>
              </div>
            </div>
          </div>

          {/* Expansive Full-Width Map Showcase */}
          <div className="mt-8 overflow-hidden rounded-[4px] border border-[#D3E2F0] bg-[#FFFFFF] shadow-soft">
            {/* Map Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D3E2F0] bg-[#F4F8FC] px-6 py-3.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#5BBBF7]" />
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0B1B2B]">
                  Interactive Map Navigation
                </span>
                <span className="text-xs text-[#4A5D73]">• Bhatia Compound, Khanapur Rd</span>
              </div>
              <a
                href="https://maps.google.com/?q=Jituri+Furnitures%2C+Bhatia+compound%2C+Khanapur+Rd%2C+behind+Sukh-Shanti+Hotel%2C+Mahveer+Nagar%2C+Belagavi%2C+Karnataka+590008"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-[2px] bg-[#0B1B2B] px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                Open in Google Maps ↗
              </a>
            </div>

            {/* Map Iframe */}
            <iframe
              title="Jituri Furnitures factory location map"
              src={MAP_EMBED}
              className="h-80 sm:h-96 md:h-[460px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />

            {/* Map Bottom Hint */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D3E2F0] bg-[#FFFFFF] px-6 py-3.5 text-xs text-[#4A5D73]">
              <p>
                <strong className="text-[#0B1B2B]">Landmark:</strong> Situated behind Sukh-Shanti Hotel on Khanapur Road. Dedicated customer parking available on-site.
              </p>
              <div className="flex items-center gap-4 font-medium text-[#0B1B2B]">
                <a href="tel:+919448112345" className="hover:underline">
                  +91 94481 12345
                </a>
                <span>•</span>
                <span className="text-[#4A5D73]">Mon – Sat: 10 AM – 8 PM</span>
              </div>
            </div>
          </div>

          {/* Secondary FAQ Accordion Section ("More Questions?") */}
          <div className="mt-24 border-t border-[#D3E2F0] pt-16">
            <div className="flex flex-col items-center text-center">
              <span className="rounded-full bg-[#5BBBF7] px-3 py-1 text-xs font-semibold text-[#0B1B2B]">
                FAQ
              </span>
              <h2 className="editorial-h2 mt-3">Frequently Asked Questions</h2>
              <p className="editorial-body mt-2 text-center">
                Everything you need to know about our in-house craftsmanship and orders.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-3xl divide-y divide-[#D3E2F0] border-y border-[#D3E2F0]">
              {faqItems.map((faq, i) => (
                <details key={i} name="faq-accordion" className="group py-5">
                  <summary className="flex cursor-pointer items-center justify-between text-left text-base font-semibold text-[#0B1B2B] hover:text-[#4A5D73]">
                    <span>{faq.q}</span>
                    <span className="ml-4 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#D3E2F0] text-xs transition-transform duration-200 group-open:rotate-45 group-open:bg-[#5BBBF7] group-open:border-[#5BBBF7]">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 text-[0.95rem] text-[#4A5D73] leading-[1.6]">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
