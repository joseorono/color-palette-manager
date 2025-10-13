interface TechListProps {
  title: string;
  items: Array<{ label: string; description: string }>;
  dotColor: string;
}

function TechList({ title, items, dotColor }: TechListProps) {
  return (
    <div>
      <h3 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div
              className={`h-2 w-2 ${dotColor} mt-2 flex-shrink-0 rounded-full`}
            ></div>
            <span className="text-gray-700 dark:text-gray-300">
              <strong>{item.label}</strong> {item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TechnicalHighlights() {
  const developerStack = [
    { label: "React 18", description: "with TypeScript for type safety" },
    {
      label: "Tailwind CSS",
      description: "for responsive, utility-first styling",
    },
    { label: "Vite", description: "for lightning-fast development and builds" },
  ];

  const performanceFeatures = [
    { label: "WCAG Compliant", description: "with proper contrast ratios" },
    { label: "Offline-First", description: "design, no server required" },
    { label: "Progressive Web App", description: "installable from browser" },
    { label: "Responsive Design", description: "works on any screen size" },
  ];

  return (
    <section className="bg-azure-web-50 dark:bg-slate-800 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
            Built with Modern Technology
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 dark:text-gray-300">
            Performance, accessibility, and developer experience at the core
          </p>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <TechList
            title="Developer-Friendly Stack"
            items={developerStack}
            dotColor="bg-vivid-sky-blue"
          />
          <TechList
            title="Performance & Accessibility"
            items={performanceFeatures}
            dotColor="bg-electric-blue"
          />
        </div>
      </div>
    </section>
  );
}
