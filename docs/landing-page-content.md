# Color Palette Manager - Landing Page Content

This document provides the suggested content and structure for the Color Palette Manager landing page, following the requirements outlined in `landing-prompt.md`.

## Page Structure & Content

### Header
**Sticky navigation with subtle shadow**
- **Project Name**: Color Palette Manager
- **Navigation**:
  - GitHub Repository link
  - Optional: "Get Started" or "Try Now" button

### Hero Section
**Large, impactful introduction**

#### Main Title
```
Create Beautiful Color Palettes
```

#### Subtitle
```
A modern, offline-first color palette management application.
Generate, edit, and export stunning color schemes for your design projects.
```

#### Hero Description
```
Built with React, TypeScript, and Tailwind CSS, Color Palette Manager is a powerful tool for designers and developers who need professional color palettes. Work completely offline, export to multiple formats, and enjoy a seamless desktop or web experience.
```

#### Primary CTA Button
```
View on GitHub
```

#### Secondary CTA Button
```
Try the Web App
```

### Features Section
**Highlight the 4 main features with icons/illustrations**

#### Feature 1: Smart Palette Generation
**Icon**: 🎨 or color wheel icon
**Title**: Intelligent Color Generation
**Description**: Generate harmonious color palettes from scratch, based on specific colors, or extracted from images. Lock colors you love and regenerate the rest with our advanced color harmony algorithms.

#### Feature 2: Professional Export Options
**Icon**: 📤 or download icon
**Title**: Export to Any Format
**Description**: Export your palettes in 8+ formats including PNG, SVG, CSS Variables, JSON, SCSS, Tailwind Config, DaisyUI themes, and Shadcn/UI variables. Perfect for any workflow.

#### Feature 3: Offline-First Design
**Icon**: 🔒 or offline icon
**Title**: Works Completely Offline
**Description**: No internet required, no data collection, no server dependencies. Your palettes are stored locally and always accessible. Available as a web app, desktop application, or PWA.

#### Feature 4: Advanced Color Tools
**Icon**: ⚙️ or tools icon
**Title**: Professional Color Editing
**Description**: Fine-tune colors with HSL, RGB, and hex controls. Check accessibility compliance with built-in contrast checkers. Assign semantic roles like Primary, Secondary, Accent, and Warning.

### Additional Features Section
**Secondary features to showcase**

#### Color Management
- **Drag & Drop Reordering**: Intuitive color organization
- **Color Locking**: Preserve specific colors while generating new ones
- **Live Preview**: Real-time palette visualization with smooth transitions
- **Color Naming**: Automatic color naming using comprehensive color libraries

#### Platform Support
- **Web Application**: Modern browser support with PWA capabilities
- **Desktop App**: Cross-platform Electron application (Windows, macOS, Linux)
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

#### Developer-Friendly
- **Multiple Export Formats**: Ready-to-use code snippets for popular frameworks
- **Shareable Links**: Easy palette sharing (like Coolors.co)
- **Import Support**: Import existing palettes from various formats
- **Open Source**: MIT licensed, community-driven development

### Technical Highlights Section
**For developers and technical users**

#### Built With Modern Tech
- **React 18** with TypeScript for type safety
- **Tailwind CSS** for responsive, utility-first styling
- **Vite** for lightning-fast development and builds
- **Electron** for cross-platform desktop applications
- **IndexedDB** with Dexie.js for offline data persistence

#### Performance & Accessibility
- **WCAG Compliant**: Accessible design with proper contrast ratios
- **Offline-First**: No server required, works without internet
- **Fast & Responsive**: Optimized for smooth interactions
- **Progressive Web App**: Install directly from your browser

### Call-to-Action Section
**Encourage user engagement**

#### Main CTA
```
Ready to Create Amazing Color Palettes?
```

#### Description
```
Join developers and designers who trust Color Palette Manager for their color workflow.
Start creating beautiful, accessible color schemes today.
```

#### Action Buttons
- **Primary**: "Get Started on GitHub"
- **Secondary**: "Try Web App" (links to `/app` route)
- **Tertiary**: "Download Desktop App"

### Footer
**Clean, minimal footer with essential links**

#### Content
- **Project Name**: Color Palette Manager
- **GitHub Link**: Repository link with star count badge
- **Additional Links**:
  - Documentation
  - Issues & Bug Reports
  - Contributing Guidelines
  - MIT License

#### Footer Note
```
Open source color palette management tool.
Built with ❤️ by the community.
```

## Color Palette Usage
**Use the project's color palette throughout the landing page**

### Primary Colors
- Use for main CTAs, headers, and accent elements
- Ensure proper contrast ratios for accessibility

### Secondary Colors
- Use for supporting elements, backgrounds, and subtle accents
- Apply to feature cards, section dividers

### Neutral Colors
- Use for body text, descriptions, and backgrounds
- Maintain readability and visual hierarchy

## Visual Elements

### Logo Usage
- Use the project logo in the header
- Consider a larger version in the hero section
- Ensure proper spacing and sizing across devices

### Screenshots/Mockups
- Include a hero image showing the palette generator interface
- Feature cards could include small preview images of export formats
- Consider showing the desktop app alongside the web version

### Icons
- Use consistent icon style (recommend Lucide React icons for consistency with the app)
- Ensure icons are accessible with proper alt text
- Use icons to break up text and improve visual hierarchy

## Content Guidelines

### Tone & Voice
- **Professional yet approachable**: Technical enough for developers, accessible for designers
- **Benefit-focused**: Emphasize what users can achieve, not just features
- **Concise**: Respect users' time with clear, scannable content
- **Action-oriented**: Use active voice and clear calls-to-action

### SEO Considerations
- **Title**: "Color Palette Manager - Create Beautiful Color Schemes"
- **Meta Description**: "Generate, edit, and export professional color palettes. Offline-first design tool with multiple export formats. Free, open-source, and works in browser or desktop."
- **Keywords**: color palette, color scheme, design tool, color generator, accessibility, offline, React

### Accessibility Notes
- Ensure all text has sufficient contrast ratios
- Use semantic HTML structure
- Include alt text for all images
- Provide keyboard navigation support
- Test with screen readers

## Implementation Notes

### Technical Requirements (from landing-prompt.md)
- Use Tailwind CSS and/or vanilla CSS only
- No Shadcn UI or external UI libraries for the landing page
- Valid HTML5 with semantic tags
- WCAG-compliant design
- Apple-style clean, minimalist aesthetic

### Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Flexible grid system for feature cards
- Scalable typography and spacing

### Performance
- Optimize images and assets
- Minimize CSS and JavaScript
- Consider lazy loading for below-the-fold content
- Fast loading times across all devices

