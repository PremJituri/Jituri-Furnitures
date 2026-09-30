import { Link } from 'react-router-dom';

const FACTORY_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80',
  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
];

const MAP_EMBED =
  'https://www.google.com/maps?q=Jituri+Furnitures%2C+Bhatia+compound%2C+Khanapur+Rd%2C+behind+Sukh-Shanti+Hotel%2C+Mahveer+Nagar%2C+Belagavi%2C+Karnataka+590008&output=embed';

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-accent px-4 py-24 text-white sm:px-6 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Belagavi</p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Jituri Furnitures
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
            Timeless design, honest materials, and craftsmanship you can feel in every piece we build.
          </p>
          <Link
            to="/collections"
            className="mt-10 inline-flex rounded-2xl bg-white px-8 py-4 text-base font-semibold text-primary shadow-lg shadow-black/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            Explore Collections
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-bold text-dark">Our legacy</h2>
            <p className="mt-4 text-dark/70">
            Since 2005, Jituri Furnitures has been crafting furniture that blends comfort, durability, and refined aesthetics. With over 21 years of experience, we have proudly served 1000+ customers and 30+ hotels, delivering pieces that stand the test of time.
            </p>
            <p className="mt-4 text-dark/70">
            What sets us apart is our complete in-house production. Every piece is built within our own facility in Belagavi, where three dedicated sections—woodworking, cushioning, and polishing—work together seamlessly. This end-to-end control ensures consistent quality, precision, and attention to detail at every stage.
            </p>
            <p className="mt-4 text-dark/70">
            We work closely with our clients to understand their space, lifestyle, and taste, transforming ideas into furniture that feels personal, functional, and enduring.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-lg shadow-blue-500/10">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Craftsmanship</p>
            <p className="mt-3 text-dark/75">
            At our factory, craftsmanship is not just a process — it's a standard.
            </p>
            <p className="mt-3 text-dark/75">
            We combine: Solid construction for long-lasting durability, Thoughtful proportions for comfort and usability and carefully selected finishes suited for everyday living.
            </p>
            <p className="mt-3 text-dark/75">
            With dedicated units for woodwork, cushioning, and polishing, every piece is handled with precision under one roof—ensuring complete quality control and consistency.
            </p>
            <p className="mt-3 text-dark/75">
            The result is furniture that not only looks premium but also performs reliably for years.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-dark">Factory gallery</h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-dark/65">
            A glimpse of our manufacturing unit and showroom.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FACTORY_IMAGES.map((src, i) => (
              <div
                key={src}
                className="overflow-hidden rounded-2xl shadow-lg shadow-blue-500/10 transition-all duration-300 hover:shadow-xl"
              >
                <img
                  src={src}
                  alt={`Factory ${i + 1}`}
                  className="aspect-square w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-bold text-dark">Visit us</h2>
        <p className="mt-2 max-w-2xl text-dark/70">
          Jituri Furnitures, Bhatia compound, Khanapur Rd, behind Sukh-Shanti&apos; Hotel, Mahveer Nagar,
          Belagavi, Karnataka 590008
        </p>
        <div className="mt-8 overflow-hidden rounded-2xl shadow-lg shadow-blue-500/10">
          <iframe
            title="Jituri Furnitures location"
            src={MAP_EMBED}
            className="h-80 w-full border-0 sm:h-96"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>

      <section className="bg-surface px-4 py-16 text-center sm:px-6">
        <h2 className="text-2xl font-bold text-dark">Ready to browse?</h2>
        <p className="mx-auto mt-2 max-w-xl text-dark/65">
          Explore curated albums of sofas, beds, dining sets, and more.
        </p>
        <Link
          to="/collections"
          className="mt-8 inline-flex rounded-2xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:bg-primary/90"
        >
          Explore Collections
        </Link>
      </section>
    </div>
  );
}
