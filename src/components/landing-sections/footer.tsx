export default function Footer() {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="mb-6 flex items-center space-x-3 md:mb-0">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-v2-r4LSQvlSDwWnidwWccNvlEwol5kVsn.png"
              alt="Color Palette Manager Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-semibold">Color Palette Manager</span>
          </div>
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0">
            <a
              href="https://github.com/yourusername/color-palette-manager"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 transition-colors duration-200 hover:text-white"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>GitHub Repository</span>
            </a>
            <a
              href="/docs"
              className="text-gray-300 transition-colors duration-200 hover:text-white"
            >
              Documentation
            </a>
            <a
              href="/contributing"
              className="text-gray-300 transition-colors duration-200 hover:text-white"
            >
              Contributing
            </a>
            <a
              href="/license"
              className="text-gray-300 transition-colors duration-200 hover:text-white"
            >
              GPL v3 License
            </a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400">
            Open source color palette management tool. Built with ❤️ by the
            community.
          </p>
        </div>
      </div>
    </footer>
  );
}
