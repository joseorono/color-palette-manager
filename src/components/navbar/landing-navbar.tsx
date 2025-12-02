import { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-switcher-btn";
import { Link } from "react-router-dom";
import { Github } from "lucide-react";

export default function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { label: "Features", sectionId: "features" },
    { label: "Tools", sectionId: "tools" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-2 transition-all duration-300">
      <nav
        className={`mx-auto max-w-5xl transition-all duration-300 ${
          isMenuOpen
            ? "rounded-2xl bg-white/95 shadow-xl backdrop-blur-md dark:bg-slate-950/95"
            : "rounded-full bg-white/70 shadow-lg backdrop-blur-md dark:bg-slate-950/70"
        } border border-slate-200/50 dark:border-slate-800/50`}
      >
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center">
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center transition-opacity hover:opacity-80"
            >
              <img
                src="/logo-32x32.webp"
                alt="ChromaLockr Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-md mx-2 inline-flex items-center font-semibold text-gray-900 dark:text-gray-100">
                ChromaLockr
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId)}
                className="rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-slate-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-gray-100"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://github.com/joseorono/color-palette-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full px-3 py-2 text-gray-600 transition-all hover:bg-slate-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-gray-100"
              aria-label="View project on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <div className="px-2">
              <ThemeToggle />
            </div>
            <Link to="/app">
              <Button className="rounded-full border-0 bg-gradient-to-r from-vivid-sky-blue-500 to-blue-munsell px-6 font-semibold text-white transition-all hover:opacity-90 hover:shadow-lg">
                Go to App
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="animate-accordion-down px-4 pb-6 pt-2 md:hidden">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.sectionId}
                  onClick={() => scrollToSection(link.sectionId)}
                  className="rounded-lg px-4 py-3 text-left text-base font-medium text-gray-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-slate-800"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://github.com/joseorono/color-palette-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg px-4 py-3 text-left text-base font-medium text-gray-600 hover:bg-slate-100 dark:text-gray-300 dark:hover:bg-slate-800"
              >
                <div className="flex items-center">
                  <Github className="mr-2 h-5 w-5" /> GitHub
                </div>
              </a>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-base font-medium text-gray-600 dark:text-gray-300">
                  Theme
                </span>
                <ThemeToggle />
              </div>
              <Link to="/app" className="pt-2">
                <Button className="w-full rounded-xl border-0 bg-gradient-to-r from-vivid-sky-blue-500 to-blue-munsell py-6 text-lg font-semibold text-white">
                  Go to App
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
