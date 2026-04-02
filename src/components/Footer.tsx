import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(59,130,246,0.1)] bg-[rgba(10,14,26,0.95)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center">
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
                className="text-lg font-bold"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Road<span className="text-[#3B82F6]">Sense</span>
              </span>
            </div>
            <p className="text-[#64748B] text-sm max-w-md leading-relaxed">
              AI-powered civic intelligence platform that transforms road hazard
              reporting into actionable data for safer, smarter cities.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/report", label: "Report Issue" },
                { href: "/map", label: "Road Map" },
                { href: "/rewards", label: "Rewards" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2">
              {["API Documentation", "Open Data", "Privacy Policy"].map(
                (label) => (
                  <li key={label}>
                    <span className="text-sm text-[#94A3B8] hover:text-[#3B82F6] transition-colors cursor-pointer">
                      {label}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(59,130,246,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#64748B]">
            © 2026 RoadSense. Civic Intelligence for Everyone.
          </p>
          <div className="flex items-center gap-4">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
            <span className="text-xs text-[#64748B]">
              All systems online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
