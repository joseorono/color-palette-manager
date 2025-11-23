import { Sparkles } from "lucide-react";
import type React from "react";
interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureProps) {
  return (
    <div className="feature-card rounded-xl p-6 text-center">
      <div className="feature-icon mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl">
        {icon}
      </div>
      <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}

export default function Features() {
  const features = [
    {
      icon: <Sparkles className="h-7 w-7 text-vivid-sky-blue-600" />,
      title: "Intelligent Color Generation",
      description:
        "Generate harmonious color palettes from scratch, based on specific colors, or extracted from images. Lock colors you love and regenerate the rest.",
    },
    {
      icon: (
        <svg
          className="h-7 w-7 text-vivid-sky-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      title: "Export to Any Format",
      description:
        "Export your palettes in 8+ formats including PNG, SVG, CSS Variables, JSON, SCSS, Tailwind Config, and more. Perfect for any workflow.",
    },
    {
      icon: (
        <svg
          className="h-7 w-7 text-vivid-sky-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
      title: "Works Completely Offline",
      description:
        "No internet required, no data collection, no server dependencies. Your palettes are stored locally and always accessible.",
    },
    {
      icon: (
        <svg
          className="h-7 w-7 text-vivid-sky-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
      title: "Professional Color Editing",
      description:
        "Fine-tune colors with HSL, RGB, and hex controls. Check accessibility compliance with built-in contrast checkers.",
    },
  ];

  return (
    <section
      id="features"
      className="bg-gradient-to-b from-white to-slate-50 py-20 dark:bg-slate-900 dark:bg-none"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Powerful Features for Every Designer
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Everything you need to create, manage, and export professional color
            palettes
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
