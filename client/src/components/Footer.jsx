export default function Footer() {
  return (
    <footer className="border-t border-dark/10 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-dark">Jituri Furnitures</p>
            <p className="mt-1 max-w-md text-sm text-dark/65">
              Premium furniture crafted with care. Visit our factory in Belagavi or explore our collections
              online.
            </p>
          </div>
          <div className="text-sm text-dark/70">
            <p className="font-medium text-dark">Contact</p>
            <p className="mt-1">Bhatia compound, Khanapur Rd</p>
            <p>Behind Sukh-Shanti&apos; Hotel, Mahveer Nagar</p>
            <p>Belagavi, Karnataka 590008</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-dark/50">
          © {new Date().getFullYear()} Jituri Furnitures. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
