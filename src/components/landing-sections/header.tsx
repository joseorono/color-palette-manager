import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-v2-r4LSQvlSDwWnidwWccNvlEwol5kVsn.png"
              alt="Color Palette Manager Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-brand-dark text-xl font-semibold">
              Color Palette Manager
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-4 md:flex">
            <a
              href="https://github.com/yourusername/color-palette-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark hover:text-brand-teal font-medium transition-colors duration-200"
              aria-label="View project on GitHub"
            >
              GitHub
            </a>
            <a
              href="#cta"
              className="bg-brand-teal hover:bg-brand-teal-dark rounded-lg px-4 py-2 font-medium text-white transition-colors duration-200"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              <a
                href="https://github.com/yourusername/color-palette-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark hover:text-brand-teal font-medium transition-colors duration-200"
              >
                GitHub
              </a>
              <a
                href="#cta"
                className="bg-brand-teal hover:bg-brand-teal-dark rounded-lg px-4 py-2 text-center font-medium text-white transition-colors duration-200"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
