interface TechListProps {
  title: string
  items: Array<{ label: string; description: string }>
  dotColor: string
}

function TechList({ title, items, dotColor }: TechListProps) {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-brand-dark mb-6">{title}</h3>
      <ul className="space-y-4">
        {items.map((item, index) => (
          <li key={index} className="flex items-start space-x-3">
            <div className={`w-2 h-2 ${dotColor} rounded-full mt-2 flex-shrink-0`}></div>
            <span className="text-gray-700">
              <strong>{item.label}</strong> {item.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function TechnicalHighlights() {
  const developerStack = [
    { label: "React 18", description: "with TypeScript for type safety" },
    { label: "Tailwind CSS", description: "for responsive, utility-first styling" },
    { label: "Vite", description: "for lightning-fast development and builds" },
    { label: "Electron", description: "for cross-platform desktop applications" },
  ]

  const performanceFeatures = [
    { label: "WCAG Compliant", description: "with proper contrast ratios" },
    { label: "Offline-First", description: "design, no server required" },
    { label: "Progressive Web App", description: "installable from browser" },
    { label: "Cross-Platform", description: "support for all devices" },
  ]

  return (
    <section className="py-20 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-dark mb-4">Built with Modern Technology</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Performance, accessibility, and developer experience at the core
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <TechList title="Developer-Friendly Stack" items={developerStack} dotColor="bg-brand-teal" />
          <TechList title="Performance & Accessibility" items={performanceFeatures} dotColor="bg-cyan-400" />
        </div>
      </div>
    </section>
  )
}
