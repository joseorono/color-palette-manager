# 🎨 Color Palette Generator – ToDo List

# First of All
- [ ] Fix Existing Functionality
- [ ] Enable PWA features
- [ ] Implement IndexedDB with Dexie.js (https://dexie.org/)
- [ ] The root `/app` directory should only contain route files. All other components should be moved to a separate `/components` directory, with layout components in their own `/layout` subdirectory.
- [ ] Implement Them Switcher in the Layout component (remember we're using Shadcn/UI's default theme system) - https://ui.shadcn.com/docs/dark-mode/vite
- [ ] The index page should be a static landing page with marketing content, not the palette generator itself. The app itself should be moved to a separate route like `localhost:5173/app/`.

## 🏗 Core Functionality
- [ ] Implement **spacebar** trigger to generate random palettes
- [x] Add **lock color** feature to preserve selected colors while regenerating others
- [x] Ensure harmonization of newly generated colors with locked selections
- [x] Implement **export in multiple formats** (CSS, JSON, SVG, PNG, SCSS, Tailwind, DaisyUI, Shadcn/UI)
- [ ] Implement **import palettes** from supported formats
- [ ] Create **shareable link** functionality for palettes (like Coolors) - This is already implemented but it's too basic and doesn't share all the palette data, only the colors.
- [ ] Implement Color Naming using color name libraries or large JSON dataset.
- [ ] Implement Color Roles (Primary-light, Secondary-dark, Accent, Warning, etc.)
- [ ] Implement **Layout components** with their own directory.
---

## 📂 User Features
- [ ] **Galería de paletas** (user dashboard)
- [x] **Generate Palette**
  - [x] From scratch
  - [x] Based on a specific color
- [X] **Assign roles** to colors (Primary-light, Secondary-dark, Accent, Warning, etc.)
- [x] **Color naming** using color name libraries or large JSON dataset
- [x] **Contrast Checker** for accessibility compliance

---

## 🎨 Palette & Color Editing
- [x] **Palette Editor**
  - [ ] Drag-and-drop colors to reorder
  - [x] Lock/unlock colors
- [x] **Color Editor Modal**
  - [x] Fields for brightness, contrast, hue, saturation, etc.
- [ ] **Palette Playground** (WIP)
  - [x] Component playground using the user’s palette - WIP
- [ ] **Color Roles in Palette Editor** (Primary-light, Secondary-dark, Accent, Warning, etc.)

---

## 📤 Export / 📥 Import
- [ ] Add a Side-Pane to the Export Modal with a preview of the palette in the selected format. - Taken by Jose
- [x] Implement Export formats:
  - [x] CSS
  - [x] JSON
  - [x] SVG
  - [x] PNG
  - [x] SCSS
  - [x] Tailwind config
  - [x] DaisyUI config
  - [x] Shadcn/UI config
- [ ] Test Export formats (don't spend too much time on this)

---

## ⚙️ `/lib` Functions
- [ ] Generate shades
- [ ] Generate gradients
- [ ] Accessibility utilities (contrast checker, WCAG compliance)
- [x] Abstract palette preview generation (currently tied to a modal)
- [x] Abstract export functions for all formats
- [ ] Move color conversion functions to use color-conversion.ts and add tests (there are some inside components).

---

## 🖥 Components / Views

Only mark once it's feature-complet and prepared for beta-testing.

- [ ] **Galería de paletas** (dashboard view) - Taken by Mauricio
- [ ] **Palette View** (read-only)
- [ ] **Palette Editor View** - Taken by Jose
- [ ] **Color Editor Modal** - Taken by Carlos
- [ ] **Palette Export Modal** - Taken by Jose
- [ ] **Palette Import Modal**
- [ ] **Landing Page** (static, marketing)
- [ ] **Palette Playground** - Taken by Jose
- [ ] **Layout component** - Taken by Mauricio

---

## Future Features
- [ ] **Gradient Generation**
- [ ] **Shade Generation**, with 9 or 10 shades for each color so it's usable for Tailwind Colors.
