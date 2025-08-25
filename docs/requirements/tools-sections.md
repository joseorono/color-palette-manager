# Color Tools
- [x] Color Mixer: Allow users to mix two or more colors to create a new one. This could be done by averaging their RGB or HSL values. You could offer a simple two-color mixer or a more advanced version that lets users set mixing ratios.
    - It should still provide a button to generate a palette with the color using the ?basedOnColor= query parameter.

- [x] Color Naming Tool: A tool that allows users to input a color and instantly see its name. This could be done using a color name library or a large JSON dataset.
    - This is basically already implemented in color-name-test.tsx, but it could be a standalone tool.
    - It should still provide a button to generate a palette with the color using the ?basedOnColor= query parameter.

- [x] Color Palette Extractor: A standalone, simplified version of your core image-based palette generation. This tool could focus purely on extracting the most dominant colors from an image without the full palette management interface.
    - It should still provide a button to open the generated Palette in the palette editor using the ?colors= query parameter.

- [ ] Color Converter: A quick-access tool for converting a single color's value between different formats (Hex, RGB, HSL, CMYK, etc.) without having to go into a full palette view. You already have the code for this, so it would just be a UI wrapper.

- [ ] Eyedropper: A dedicated tool that lets users pick a color from anywhere on their screen (within the browser tab) would be a great addition.
    - It's not a priority.
    - Implementing this would require some work and research...
    - But it would open the door to a color picker tool like Color Cop.

- [x] Shade Generator: A tool that allows users to select a base color and then generate a range of shades (lighter and darker versions) of that color.
    - It should still provide a button to open the generated Palette in the palette editor using generateUrlToPaletteFromBaseColor.

# Accessibility & Utility
- [ ] Color Blindness Simulator: A visual tool that applies filters to a user's selected palette to simulate how it would appear to someone with different types of color blindness (e.g., Deuteranopia, Protanopia). This is a simple but powerful accessibility feature that can be implemented with CSS filters.
    - This might require some image manipulation or advanced use of CSS filters.

- [ ] Text & Background Contrast Checker: A focused version of your existing feature. Users can input a foreground and background color and instantly see if it passes WCAG contrast guidelines for both normal and large text.

- [ ] Hue, Saturation, Lightness (HSL) Explorer: An interactive tool with sliders for Hue, Saturation, and Lightness that allows users to explore the color space in real-time. This helps in understanding how these three properties affect a color and can be a great educational feature.

- [ ] A Text & Background Contrast Checker where a user can input two colors (from their palette or elsewhere) and it will display the contrast ratio and a pass/fail grade for both AA and AAA levels.

Read up on WCAG for more information. I know some tools like this I can use as a reference.

# Source
Conversation I had with Gemini, which inspired this section:

https://g.co/gemini/share/75681dc16527