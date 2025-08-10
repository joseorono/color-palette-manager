import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-v2-r4LSQvlSDwWnidwWccNvlEwol5kVsn.png"
              alt="Color Palette Manager Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-semibold text-brand-dark">Color Palette Manager</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://github.com/yourusername/color-palette-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-dark hover:text-brand-teal transition-colors duration-200 font-medium"
              aria-label="View project on GitHub"
            >
              GitHub
            </a>
            <a
              href="#cta"
              className="bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-brand-teal-dark transition-colors duration-200 font-medium"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <a
                href="https://github.com/yourusername/color-palette-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-dark hover:text-brand-teal transition-colors duration-200 font-medium"
              >
                GitHub
              </a>
              <a
                href="#cta"
                className="bg-brand-teal text-white px-4 py-2 rounded-lg hover:bg-brand-teal-dark transition-colors duration-200 font-medium text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
