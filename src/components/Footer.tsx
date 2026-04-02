import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#E8F2FF] bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#4A9FF5] to-[#3585DB] flex items-center justify-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <span
                className="text-lg font-bold text-[#1A2332]"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Road<span className="text-[#4A9FF5]">Sense</span>
              </span>
            </div>
            <p className="text-[#8A9AB5] text-sm max-w-md leading-relaxed">
              AI-powered civic intelligence platform that transforms road hazard
              reporting into actionable data for safer, smarter cities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-[#1A2332] mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/report", label: "Report Issue" },
                { href: "/map", label: "Road Map" },
                { href: "/ghost", label: "Ghost Sensing" },
                { href: "/rewards", label: "Rewards" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#5A6B82] hover:text-[#4A9FF5] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-[#1A2332] mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {["API Documentation", "Open Data", "Privacy Policy"].map(
                (label) => (
                  <li key={label}>
                    <span className="text-sm text-[#5A6B82] hover:text-[#4A9FF5] transition-colors cursor-pointer">
                      {label}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#E8F2FF] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#8A9AB5]">
            © 2026 RoadSense. Civic Intelligence for Everyone.
          </p>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#34C77B] animate-pulse" />
            <span className="text-xs text-[#8A9AB5]">
              All systems online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
