# 🎨 Color Palette Generator – ToDo List

# First of All
- [ ] Fix Existing Functionality
- [ ] Enable PWA features
- [ ] Implement IndexedDB with Dexie.js (https://dexie.org/)

## 🏗 Core Functionality
- [ ] Implement **spacebar** trigger to generate random palettes
- [x] Add **lock color** feature to preserve selected colors while regenerating others
- [x] Ensure harmonization of newly generated colors with locked selections
- [x] Implement **export in multiple formats** (CSS, JSON, SVG, PNG, SCSS, Tailwind, DaisyUI, Shadcn/UI)
- [ ] Implement **import palettes** from supported formats
- [ ] Create **shareable link** functionality for palettes (like Coolors) - This is already implemented but it's too basic and doesn't share all the palette data, only the colors.
- [ ] Implement Color Naming using color name libraries or large JSON dataset.
- [ ] Implement Color Roles (Primary-light, Secondary-dark, Accent, Warning, etc.)

---

## 📂 User Features
- [ ] **Galería de paletas** (user dashboard)
- [x] **Generate Palette**
  - [x] From scratch
  - [x] Based on a specific color
- [ ] **Assign roles** to colors (Primary-light, Secondary-dark, Accent, Warning, etc.)
- [x] **Color naming** using color name libraries or large JSON dataset
- [x] **Contrast Checker** for accessibility compliance

---

## 🎨 Palette & Color Editing
- [x] **Palette Editor**
  - [ ] Drag-and-drop colors to reorder
  - [x] Lock/unlock colors
- [x] **Color Editor Modal**
  - [x] Fields for brightness, contrast, hue, saturation, etc.
- [ ] **Palette Playground**
  - [ ] Static landing page to be used as a demo
  - [ ] Component playground using the user’s palette

---

## 📤 Export / 📥 Import
- [ ] Create export previews with format icons
- [ ] Implement download button for each format
- [x] Implement Export formats:
  - [x] CSS
  - [x] JSON
  - [x] SVG
  - [x] PNG
  - [x] SCSS
  - [x] Tailwind config
  - [x] DaisyUI config
  - [x] Shadcn/UI config
- Test Export formats (don't spend too much time on this)

---

## ⚙️ `/lib` Functions
- [ ] Generate shades
- [ ] Generate gradients
- [ ] Accessibility utilities (contrast checker, WCAG compliance)
- [x] Abstract palette preview generation (currently tied to a modal)
- [x] Abstract export functions for all formats

---

## 🖥 Components / Views
- [ ] **Galería de paletas** (dashboard view)
- [ ] **Palette View** (read-only)
- [ ] **Palette Editor View**
- [ ] **Color Editor Modal**
- [ ] **Export Modal** (icons, preview, download)
- [ ] **Landing Page** (trial/demo)
- [ ] **Palette Playground**

---
