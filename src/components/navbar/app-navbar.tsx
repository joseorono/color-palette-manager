import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Menu, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ui/theme-switcher-btn";

// Define the navigation links
interface NavigationLink {
  name: string;
  href: string;
}
const navigationLinks: NavigationLink[] = [
  { name: "Dashboard", href: "/app" },
  { name: "Palette Editor", href: "/app/palette-edit" },
  { name: "Color Test", href: "/app/color-test" },
  { name: "Theme Test", href: "/app/test"},
  { name: "Tools", href: "/app/tools" },
];

export default function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- Logo and Brand Name --- */}
        <div className="flex-shrink-0">
          <Link
            to="/app"
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
                  <Link to={link.href}>{link.name}</Link>
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
                <Link
                  to="/app"
                  className="flex items-center space-x-2 text-2xl font-bold"
                >
                  <Palette className="h-6 w-6 text-primary" />
                  <span>Color Palette Manager</span>
                </Link>
              </div>
              <nav className="flex flex-grow flex-col space-y-4 pt-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className="w-full text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t pt-4">
                <Link to="/" className="w-full">
                  <Button className="w-full" variant="outline">
                    Back to Landing
                  </Button>
                </Link>
                <div className="mt-4 flex justify-center">
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* --- Back to Landing Button and Theme Toggle (Visible on desktop) --- */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link to="/">
            <Button variant="outline">Back to Landing</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// NOTE: This component assumes you have the 'shadcn/ui' setup with its
// components available, including the `cn` utility for class merging.
// To use this code, ensure your `components.json` is configured correctly.
