export default function CallToAction() {
  return (
    <section id="cta" className="gradient-bg py-20">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-gray-100 sm:text-4xl">
          Ready to Create Amazing Color Palettes?
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-700 dark:text-gray-200">
          Join developers and designers who trust ChromaLockr for their color
          workflow. Start creating beautiful, accessible color schemes today.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/app"
            className="btn-primary rounded-xl px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:transform"
          >
            Launch App
          </a>
          <a
            href="https://github.com/joseorono/color-palette-manager"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary rounded-xl px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-300 hover:-translate-y-1 hover:transform hover:text-white dark:text-gray-100"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
