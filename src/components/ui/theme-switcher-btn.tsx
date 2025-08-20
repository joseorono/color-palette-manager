"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light"); // default theme
  const [isClient, setIsClient] = useState(false);

  // Initialize theme after component mounts (client-only)
  useEffect(() => {
    setIsClient(true);

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && ["light", "system", "dark"].includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const initialTheme = systemPrefersDark ? "dark" : "light";
      setTheme(initialTheme);
      localStorage.setItem("theme", initialTheme);
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (!isClient) return;

    const applyTheme = () => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.classList.toggle(
          "dark",
          systemTheme === "dark"
        );
      } else {
        document.documentElement.classList.toggle("dark", theme === "dark");
      }

      localStorage.setItem("theme", theme);
    };

    applyTheme();
  }, [theme, isClient]);

  // Handle theme change directly by clicking on a section
  const handleThemeChange = useCallback((newTheme: string) => {
    setTheme(newTheme);
  }, []);

  // Get knob position classes based on theme
  const getKnobPosition = useCallback(() => {
    switch (theme) {
      case "light":
        return "left-1"; // 4px
      case "system":
        return "left-[50px]"; // center
      case "dark":
        return "left-[96px]"; // right side
      default:
        return "left-1";
    }
  }, [theme]);

  // Icons SVG paths for reusability
  const svgPaths = {
    light: (
      <path d="M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5ZM13,0h-2V5h2V0Zm0,19h-2v5h2v-5ZM5,11H0v2H5v-2Zm19,0h-5v2h5v-2Zm-2.81-6.78l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54ZM7.76,17.66l-1.41-1.41-3.54,3.54,1.41,1.41,3.54-3.54Zm0-11.31l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Zm13.44,13.44l-3.54-3.54-1.41,1.41,3.54,3.54,1.41-1.41Z" />
    ),
    system: (
      <path d="M4 4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4zm0 2h12v10H4V6zm2 12h8v2H6v-2z" />
    ),
    dark: (
      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
    ),
  };

  return (
    <div
      className="relative inline-flex items-center"
      style={{ transform: "scale(0.75)" }}
    >
      <div className="relative h-[46px] w-[140px] rounded-full bg-muted">
        {/* Invisible click targets */}
        <div className="absolute inset-0 z-10 grid grid-cols-3">
          <div
            onClick={() => handleThemeChange("light")}
            className="cursor-pointer"
          ></div>
          <div
            onClick={() => handleThemeChange("system")}
            className="cursor-pointer"
          ></div>
          <div
            onClick={() => handleThemeChange("dark")}
            className="cursor-pointer"
          ></div>
        </div>

        {/* Light Icon */}
        <svg
          className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform transition-all duration-300 ${
            theme === "light"
              ? "scale-110 text-primary-foreground opacity-100"
              : "text-muted-foreground opacity-60 hover:opacity-80"
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          {svgPaths.light}
        </svg>

        {/* System Icon */}
        <svg
          className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transform transition-all duration-300 ${
            theme === "system"
              ? "scale-110 text-primary-foreground opacity-100"
              : "text-muted-foreground opacity-60 hover:opacity-80"
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          {svgPaths.system}
        </svg>

        {/* Dark Icon */}
        <svg
          className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transform transition-all duration-300 ${
            theme === "dark"
              ? "scale-110 text-primary-foreground opacity-100"
              : "text-muted-foreground opacity-60 hover:opacity-80"
          }`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          {svgPaths.dark}
        </svg>

        {/* Animated knob */}
        <div
          className={`pointer-events-none absolute top-1 flex h-10 w-10 items-center justify-center rounded-full shadow-lg transition-all duration-500 ease-out hover:scale-105 ${getKnobPosition()}`}
          style={{
            background:
              theme === "light"
                ? "linear-gradient(135deg, #f59e0b, #eab308)"
                : theme === "system"
                  ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                  : "linear-gradient(135deg, #374151, #1f2937)",
          }}
        >
          {/* Active icon inside knob */}
          <svg
            className="h-5 w-5 text-white drop-shadow-sm"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            {svgPaths[theme as keyof typeof svgPaths]}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
