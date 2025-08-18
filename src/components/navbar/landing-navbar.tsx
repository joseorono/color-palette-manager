import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Menu, Palette } from "lucide-react";
import { Link } from "react-router-dom";

// Define the navigation links
const navigationLinks = [
  { name: "Home", href: "#hero" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "About", href: "#about" },
];

export default function LandingNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- Logo and Brand Name --- */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold"
          >
            <Palette className="h-8 w-8 text-primary" />
            <span className="text-primary">Color Palette</span>
            <span>Manager</span>
          </Link>
        </div>

        {/* --- Desktop Navigation (Hidden on small screens) --- */}
        <div className="hidden md:flex md:items-center md:space-x-8">
          <Menubar className="border-none">
            {navigationLinks.map((link) => (
              <MenubarMenu key={link.name}>
                <MenubarTrigger className="font-medium text-muted-foreground transition-colors hover:text-primary">
                  <a href={link.href} className="scroll-smooth">{link.name}</a>
                </MenubarTrigger>
              </MenubarMenu>
            ))}
          </Menubar>
        </div>

        {/* --- Mobile Navigation Trigger (Hidden on medium/large screens) --- */}
        <div className="flex md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle navigation menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>

            {/* --- Mobile Sheet Content --- */}
            <SheetContent side="right" className="flex flex-col">
              <div className="flex-shrink-0 border-b pb-4">
                <Link to="/" className="flex items-center space-x-2 text-2xl font-bold">
                  <Palette className="h-6 w-6 text-primary" />
                  <span>Color Palette Manager</span>
                </Link>
              </div>
              <nav className="flex flex-grow flex-col space-y-4 pt-4">
                {navigationLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className="w-full text-lg font-medium text-muted-foreground transition-colors hover:text-primary scroll-smooth"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
              <div className="mt-auto border-t pt-4">
                <Link to="/app" className="w-full">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* --- Get Started Button (Visible on desktop) --- */}
        <div className="hidden items-center md:flex">
          <Link to="/app">
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// NOTE: This component assumes you have the 'shadcn/ui' setup with its
// components available, including the `cn` utility for class merging.
// To use this code, ensure your `components.json` is configured correctly.
