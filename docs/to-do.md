# 🎨 Color Palette Generator – ToDo List

# First of All
- [x] Fix Existing Functionality
- [ ] Enable PWA features
- [x] Implement IndexedDB with Dexie.js (https://dexie.org/)
- [x] Implement Routing
- [ ] Implement Theme Switcher in the Layout component (remember we're using Shadcn/UI's default theme system) - https://ui.shadcn.com/docs/dark-mode/vite
- [x] The index page should be a static landing page with marketing content, not the palette generator itself. The app itself should be moved to a separate route like `localhost:5173/app/`.
- [x] Resizing a palette (changing its number of colors) should not regenerate all colors. It should preserve existing colors and only add or remove colors as needed. - Taken by Carlos
- [x] Look for a way to improve generateHarminousPalette() so that it actually takes into account the existing colors and the desired count (it's currently only using 'count' as a maximum, but caps at 10 because of its internal logic). Add a parameter with the existing colors so it doesn't delete them.

## 🏗 Core Functionality
- [x] Implement **spacebar** trigger to generate random palettes
- [x] Add **lock color** feature to preserve selected colors while regenerating others
- [x] Ensure harmonization of newly generated colors with locked selections
- [x] Implement **export in multiple formats** (CSS, JSON, SVG, PNG, SCSS, Tailwind, DaisyUI, Shadcn/UI)
- [ ] Implement **import palettes** from supported formats
- [ ] Create **shareable link** functionality for palettes (like Coolors) - This is already implemented but it's too basic and doesn't share all the palette data, only the colors.
- [ ] Implement Color Naming using color name libraries or large JSON dataset.
- [x] Implement Color Roles (Primary-light, Secondary-dark, Accent, Warning, etc.)
- [x] Implement **Layout components** with their own directory.
---

## 📂 User Features
- [x] **Galería de paletas** (user dashboard)
- [x] **Generate Palette**
  - [x] From scratch
  - [x] Based on a specific color
- [X] **Assign roles** to colors (Primary-light, Secondary-dark, Accent, Warning, etc.)
- [x] **Color naming** using color name libraries or large JSON dataset
- [x] **Contrast Checker** for accessibility compliance
- [x] **Save/Load Palettes** with database integration
- [x] **Unsaved changes tracking** with exit warnings

---

## 🎨 Palette & Color Editing
- [x] **Palette Editor**
  - [x] Drag-and-drop colors to reorder
  - [x] Lock/unlock colors
- [x] **Color Editor Modal**
  - [x] Fields for brightness, contrast, hue, saturation, etc.
- [ ] **Palette Playground** (WIP)
  - [x] Component playground using the user’s palette - WIP
- [x] **Color Roles in Palette Editor** (Primary-light, Secondary-dark, Accent, Warning, etc.) //why does this show up like three times?

---

## 📤 Export / 📥 Import
- [x] Add a Side-Pane to the Export Modal with a preview of the palette in the selected format.
- [x] Implement Export formats:
  - [x] CSS
  - [x] JSON
  - [x] SVG
  - [x] PNG
  - [x] SCSS
  - [x] Tailwind config
  - [x] DaisyUI config
  - [x] Shadcn/UI config
- [x] Test Export formats (don't spend too much time on this)
-

---

## ⚙️ `/lib` Functions
- [x] Generate shades
- [x] Generate gradients
- [ ] Accessibility utilities (contrast checker, WCAG compliance)
- [x] Abstract palette preview generation (currently tied to a modal)
- [x] Abstract export functions for all formats (refactored to class-based structure)
- [x] Database queries abstraction (refactored to class-based structure with static methods)
- [ ] Move color conversion functions to use color-conversion.ts and add tests (there are some inside components).

---

## 🖥 Components / Views

Only mark once it's feature-complete and prepared for beta-testing.

- [x] **Galería de paletas** (dashboard view)
- [ ] **Palette View** (read-only)
- [x] **Palette Editor View**
- [x] **Color Editor Modal**
- [x] **Palette Export Modal**
- [ ] **Palette Import Modal**
- [ ] **Landing Page** (static, marketing) - Taken by Jose. Do not touch until I'm done with my first proposal.
- [x] **Palette Playground**
- [x] **Layout component**

---

## Future Features
- [ ] **Gradient Generation** - Not sure if this is needed. Do not tackle yet.
- [x] **Shade Generation**, with 9 or 10 shades for each color so it's usable for Tailwind Colors.

---

## 🖥️ Desktop App
- [x] **Electron Integration** - Dependencies installed and configured
- [x] **Electron Main Process** - Create main.js for desktop app
- [ ] **Cross-platform Builds** - Configure electron-builder
- [x] **Desktop App Scripts** - Update package.json with electron scripts
