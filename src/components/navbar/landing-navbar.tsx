import { useState } from "react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ui/theme-switcher-btn";
import { Link } from "react-router-dom";

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
    <header className="sticky top-0 z-50 border-b bg-background/95 shadow-sm backdrop-blur-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo-32x32.png"
                alt="Color Palette Manager Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-semibold text-foreground">
                Color Palette Manager
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex">
            {navLinks.map((link) => (
              <button
                key={link.sectionId}
                onClick={() => scrollToSection(link.sectionId)}
                className="font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                {link.label}
              </button>
            ))}
            <a
              href="https://github.com/joseorono/color-palette-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
              aria-label="View project on GitHub"
            >
              GitHub
            </a>
            <ThemeToggle />
            <Link to="/app">
              <Button className="rounded-full px-6">Go to App</Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="p-2 text-muted-foreground hover:text-foreground md:hidden"
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
          <div className="border-t py-4 md:hidden">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.sectionId}
                  onClick={() => scrollToSection(link.sectionId)}
                  className="font-medium text-muted-foreground transition-colors duration-200 hover:text-primary text-left"
                >
                  {link.label}
                </button>
              ))}
              <a
                href="https://github.com/joseorono/color-palette-manager"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                GitHub
              </a>
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <Link to="/app" className="w-full">
                <Button className="w-full rounded-full">Go to App</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
