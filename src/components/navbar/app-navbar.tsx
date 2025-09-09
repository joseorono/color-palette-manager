import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "../ui/theme-switcher-btn";
import { cn } from "@/lib/utils";

// Define the navigation links
interface NavigationLink {
  name: string;
  href: string;
}
const navigationLinks: NavigationLink[] = [
  { name: "Dashboard", href: "/app" },
  { name: "Palette Editor", href: "/app/palette-edit" },
  { name: "Palette Preview", href: "/app/palette-preview"},
  { name: "Tools", href: "/app/tools" },
];

export default function AppNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Helper function to check if a route is active
  const isActiveRoute = (href: string) => {
    if (href === "/app") {
      // For dashboard, match exact path or /app/dashboard
      return location.pathname === "/app" || location.pathname === "/app/dashboard";
    }
    return location.pathname === href;
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* --- Logo and Brand Name --- */}
        <div className="flex-shrink-0">
          <Link
            to="/app"
            className="flex items-center space-x-2 text-2xl font-bold p-1"
          >
            <img
              src="/logo-v2.png"
              alt="Color Palette Manager Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-foreground text-xl font-semibold">
              Color Palette Manager
            </span>
          </Link>
        </div>

        {/* --- Desktop Navigation (Hidden on small screens) --- */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          <Menubar className="border-none">
            {navigationLinks.map((link) => (
              <MenubarMenu key={link.name}>
                <MenubarTrigger
                  className={cn(
                    "font-medium transition-colors hover:text-primary",
                    isActiveRoute(link.href)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Link to={link.href}>{link.name}</Link>
                </MenubarTrigger>
              </MenubarMenu>
            ))}
          </Menubar>
        </div>

        {/* --- Mobile Navigation Trigger (Hidden on medium/large screens) --- */}
        <div className="flex lg:hidden">
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
                  className="flex items-center space-x-2 text-2xl font-bold p-1"
                >
                  <img
                    src="/logo-v2.png"
                    alt="Color Palette Manager Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                  <span>Color Palette Manager</span>
                </Link>
              </div>
              <nav className="flex flex-grow flex-col space-y-4 pt-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                    className={cn(
                      "w-full text-lg font-medium transition-colors hover:text-primary",
                      isActiveRoute(link.href)
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto border-t pt-4">
                <Link to="/" className="w-full">
                  <Button className="w-full rounded-full" variant="secondary">
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
        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          <Link to="/">
            <Button className="rounded-full px-6" variant="secondary">Back to Landing</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

// NOTE: This component assumes you have the 'shadcn/ui' setup with its
// components available, including the `cn` utility for class merging.
// To use this code, ensure your `components.json` is configured correctly.
