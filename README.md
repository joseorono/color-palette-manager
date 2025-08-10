# 🎨 Color Palette Manager

A modern, offline-first color palette management application built with React, TypeScript, and Tailwind CSS. Create, edit, and export beautiful color palettes for your design projects.

This project is currently in development and is not yet ready for production use.


![Version Badge](https://img.shields.io/badge/version-0.0.1-green)
![Color Palette Manager](https://img.shields.io/badge/React-18.x-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-blue?logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.x-purple?logo=vite)
![Electron](https://img.shields.io/badge/Electron-Ready-green?logo=electron)

## ✨ Features

### 🎯 Core Functionality
- **Palette Generation**: Create color palettes from images or generate them algorithmically
- **Color Editing**: Fine-tune colors with HSL, RGB, and hex value controls
- **Live Preview**: Real-time palette visualization with smooth transitions
- **Drag & Drop**: Intuitive color reordering and management
- **Color Locking**: Lock specific colors while generating new palettes

### 📤 Export Formats
Export your palettes in multiple formats for different use cases:
- **PNG Image** - Visual representation for presentations
- **SVG Vector** - Scalable graphics for web and print
- **CSS Variables** - Ready-to-use CSS custom properties
- **JSON Data** - Structured data for applications
- **SCSS Variables** - Sass/SCSS variable definitions
- **Tailwind Config** - Tailwind CSS configuration
- **DaisyUI Theme** - DaisyUI theme configuration
- **Shadcn/UI Variables** - Shadcn/UI CSS variables

### 🖥️ Platform Support
- **Web Application** - Modern browser support
- **Desktop App** - Cross-platform Electron application (Windows, macOS, Linux)
- **Offline-First** - No server required, works completely offline
- **PWA (Progressive Web App)** - Installable on mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- A reasonably up-to-date browser that supports ES6 features, CSS variables, SVG images, and IndexedDB. Pretty much any modern browser or Android device meets these requirements. [See Compatibility Chart for IndexedDB](https://caniuse.com/indexeddb).


### Installation

```bash
# Clone the repository
git clone https://github.com/joseorono/color-palette-manager.git
cd color-palette-manager

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

### Desktop Application

```bash
# Run in development mode
npm run electron-dev

# Build for production
npm run electron-build

# Build for all platforms
npm run electron-build-all
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/UI** - Beautiful and accessible UI components

### State Management
- **Zustand** - Lightweight state management
- **React Hook Form** - Performant form handling
- **Zod** - Schema validation
- **Dexie.js** - IndexedDB wrapper for offline storage.

### Testing
- **Vitest** - Fast unit testing framework
- **React Testing Library** - Component testing utilities

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 📁 Project Structure

```
src/
├── components/         # React components
│   ├── ui/             # Shadcn/UI components
│   ├── landing/        # Landing page components
│   └── palette/        # Palette-related components
├── lib/                # Utility functions
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
├── constants/          # Application constants
├── pages/              # Page components
├── layouts/            # Layout components
└── hooks/              # Custom React hooks
```

## 🎨 Usage

### Creating a Palette
1. **From Image**: Upload an image to extract dominant colors
2. **Generate**: Use algorithmic generation with customizable parameters
3. **Manual**: Add colors individually using the color picker

### Editing Colors
- Click any color to open the color editor
- Adjust HSL, RGB, or hex values
- Lock colors to preserve them during regeneration
- Drag and drop to reorder colors

### Exporting Palettes
1. Click the "Export Palette" button
2. Choose your desired format
3. Download the generated file

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run coverage

# Run tests in CLI mode
npm run test-cli
```

## 🔧 Development

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run test             # Run tests with UI
npm run electron-dev     # Run Electron in development
npm run electron-build   # Build Electron app
```

### Code Style
- Follow the established TypeScript patterns
- Use kebab-case for component file names
- Use PascalCase for component names
- Prefer const assertions and explicit typing

## 🤝 Contributing

We're open to contributions! Please open an issue or submit a pull request.

### Development Guidelines
- Write tests for new features
- Follow the existing code style
- Update documentation as needed
- Ensure TypeScript types are properly defined

## 📄 License

This project is licensed under the GPL v3 License - see the [LICENSE.md](LICENSE.md) file for details.

## 🔗 Links
- WIP, not real links yet.
- [Demo](https://your-demo-url.com) - Live demo
- [Documentation](./docs/) - Detailed documentation, development notes, roadmap, etc.
- [Issues](https://github.com/yourusername/color-palette-manager/issues) - Bug reports and feature requests

---

Made with ❤️.
