import { Palette, Contrast, Layers, Blend, Eye, Boxes } from "lucide-react";
import type React from "react";

interface WorkflowCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function WorkflowCard({ icon, title, description }: WorkflowCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-vivid-sky-blue hover:shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:hover:border-vivid-sky-blue">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 dark:bg-sky-950/30">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}

export default function TechnicalHighlights() {
  const workflowTools = [
    {
      icon: <Palette className="h-6 w-6 text-vivid-sky-blue" />,
      title: "Palette Generator",
      description:
        "Create harmonious color palettes from scratch, from a base color, or extract colors from images.",
    },
    {
      icon: <Layers className="h-6 w-6 text-vivid-sky-blue" />,
      title: "Shade Generator",
      description:
        "Generate complete shade scales from any color - perfect for design systems and UI frameworks.",
    },
    {
      icon: <Blend className="h-6 w-6 text-vivid-sky-blue" />,
      title: "Gradient Generator",
      description:
        "Create smooth color gradients with multiple stops and adjustable interpolation for beautiful transitions.",
    },
    {
      icon: <Contrast className="h-6 w-6 text-vivid-sky-blue" />,
      title: "Contrast Checker",
      description:
        "Ensure your colors meet WCAG accessibility standards with real-time contrast ratio checking.",
    },
    {
      icon: <Eye className="h-6 w-6 text-vivid-sky-blue" />,
      title: "Color Vision Simulator",
      description:
        "Preview your palettes as seen by people with different types of color vision deficiency.",
    },
    {
      icon: <Boxes className="h-6 w-6 text-vivid-sky-blue" />,
      title: "Export & Integration",
      description:
        "Export to 8+ formats including CSS, SCSS, Tailwind, JSON, PNG, and SVG for seamless integration.",
    },
  ];

  return (
    <section id="tools" className="bg-azure-web-50 py-20 dark:bg-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-4 text-center">
          <div className="inline-flex items-center rounded-full bg-vivid-sky-blue/10 px-4 py-2 dark:bg-vivid-sky-blue/20">
            <span className="text-sm font-semibold text-vivid-sky-blue">
              Multiple Tools In One Place
            </span>
          </div>
        </div>
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Complete Color Workflow
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Everything you need for professional color management and design
            systems
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {workflowTools.map((tool, index) => (
            <WorkflowCard key={index} {...tool} />
          ))}
        </div>
      </div>
    </section>
  );
}
