import { Color } from "@/types/palette";
import { ExportOptions, ExportResult } from "@/types/export";
import { ExportFormat } from "@/constants/export";

/**
 * Export palette as PNG image using Canvas API
 */
export async function exportToPNG(
  colors: Color[],
  options: ExportOptions = {}
): Promise<ExportResult> {
  const { width = 800, height = 200, filename = "color-palette.png" } = options;
  
  if (typeof document === 'undefined') {
    throw new Error('PNG export requires DOM environment');
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  const colorWidth = width / colors.length;
  canvas.width = width;
  canvas.height = height;

  colors.forEach((color, index) => {
    ctx.fillStyle = color.hex;
    ctx.fillRect(index * colorWidth, 0, colorWidth, height);
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve({
          content: blob,
          filename,
          mimeType: "image/png"
        });
      } else {
        reject(new Error('Failed to create PNG blob'));
      }
    });
  });
}

/**
 * Export palette as SVG vector image
 */
export function exportToSVG(
  colors: Color[],
  options: ExportOptions = {}
): ExportResult {
  const { width = 800, height = 200, filename = "color-palette.svg" } = options;
  const colorWidth = width / colors.length;

  let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

  colors.forEach((color, index) => {
    svgContent += `<rect x="${index * colorWidth}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}"/>`;
  });

  svgContent += "</svg>";

  return {
    content: svgContent,
    filename,
    mimeType: "image/svg+xml"
  };
}

/**
 * Export palette as CSS variables and utility classes
 */
export function exportToCSS(
  colors: Color[],
  options: ExportOptions = {}
): ExportResult {
  const { filename = "color-palette.css" } = options;
  
  let cssContent = "/* Color Palette CSS Variables */\n:root {\n";

  colors.forEach((color, index) => {
    cssContent += `  --color-${index + 1}: ${color.hex};\n`;
  });

  cssContent += "}\n\n/* Color Classes */\n";

  colors.forEach((color, index) => {
    cssContent += `.color-${index + 1} { color: ${color.hex}; }\n`;
    cssContent += `.bg-color-${index + 1} { background-color: ${color.hex}; }\n`;
  });

  return {
    content: cssContent,
    filename,
    mimeType: "text/css"
  };
}

/**
 * Export palette as JSON data
 */
export function exportToJSON(
  colors: Color[],
  options: ExportOptions = {}
): ExportResult {
  const { filename = "color-palette.json", paletteName = "Color Palette" } = options;
  
  const paletteData = {
    name: paletteName,
    colors: colors.map((color, index) => ({
      name: `Color ${index + 1}`,
      hex: color.hex,
      index: index + 1,
      id: color.id,
      locked: color.locked
    })),
    createdAt: new Date().toISOString(),
    totalColors: colors.length
  };

  return {
    content: JSON.stringify(paletteData, null, 2),
    filename,
    mimeType: "application/json"
  };
}

/**
 * Export palette as SCSS variables
 */
export function exportToSCSS(
  colors: Color[],
  options: ExportOptions = {}
): ExportResult {
  const { filename = "color-palette.scss" } = options;
  
  let scssContent = "// Color Palette SCSS Variables\n";

  colors.forEach((color, index) => {
    scssContent += `$color-${index + 1}: ${color.hex};\n`;
  });

  scssContent += "\n// Color Map\n";
  scssContent += "$colors: (\n";
  
  colors.forEach((color, index) => {
    const comma = index < colors.length - 1 ? "," : "";
    scssContent += `  "color-${index + 1}": ${color.hex}${comma}\n`;
  });
  
  scssContent += ");\n";

  return {
    content: scssContent,
    filename,
    mimeType: "text/scss"
  };
}

/**
 * Export palette as Tailwind CSS config
 */
export function exportToTailwind(
  colors: Color[],
  options: ExportOptions = {}
): ExportResult {
  const { filename = "tailwind-colors.js" } = options;
  
  let tailwindContent = "// Tailwind CSS Color Configuration\n";
  tailwindContent += "module.exports = {\n";
  tailwindContent += "  theme: {\n";
  tailwindContent += "    extend: {\n";
  tailwindContent += "      colors: {\n";
  
  colors.forEach((color, index) => {
    const comma = index < colors.length - 1 ? "," : "";
    tailwindContent += `        'palette-${index + 1}': '${color.hex}'${comma}\n`;
  });
  
  tailwindContent += "      }\n";
  tailwindContent += "    }\n";
  tailwindContent += "  }\n";
  tailwindContent += "};\n";

  return {
    content: tailwindContent,
    filename,
    mimeType: "application/javascript"
  };
}

/**
 * Export palette as DaisyUI theme config
 */
export function exportToDaisyUI(
  colors: Color[],
  options: ExportOptions = {}
): ExportResult {
  const { filename = "daisyui-theme.js", paletteName = "custom" } = options;
  
  const colorNames = ["primary", "secondary", "accent", "neutral", "base-100"];
  
  let daisyContent = "// DaisyUI Theme Configuration\n";
  daisyContent += "module.exports = {\n";
  daisyContent += "  daisyui: {\n";
  daisyContent += "    themes: [\n";
  daisyContent += "      {\n";
  daisyContent += `        "${paletteName}": {\n`;
  
  colors.forEach((color, index) => {
    if (index < colorNames.length) {
      const comma = index < Math.min(colors.length, colorNames.length) - 1 ? "," : "";
      daisyContent += `          "${colorNames[index]}": "${color.hex}"${comma}\n`;
    }
  });
  
  daisyContent += "        }\n";
  daisyContent += "      }\n";
  daisyContent += "    ]\n";
  daisyContent += "  }\n";
  daisyContent += "};\n";

  return {
    content: daisyContent,
    filename,
    mimeType: "application/javascript"
  };
}

/**
 * Export palette as Shadcn/UI CSS variables
 */
export function exportToShadcnUI(
  colors: Color[],
  options: ExportOptions = {}
): ExportResult {
  const { filename = "shadcn-colors.css" } = options;
  
  let shadcnContent = "/* Shadcn/UI Color Variables */\n";
  shadcnContent += "@layer base {\n";
  shadcnContent += "  :root {\n";
  
  const shadcnNames = ["primary", "secondary", "accent", "muted", "card"];
  
  colors.forEach((color, index) => {
    if (index < shadcnNames.length) {
      // Convert hex to HSL for Shadcn/UI format
      const hsl = hexToHSL(color.hex);
      shadcnContent += `    --${shadcnNames[index]}: ${hsl.h} ${hsl.s}% ${hsl.l}%;\n`;
    }
  });
  
  shadcnContent += "  }\n";
  shadcnContent += "}\n";

  return {
    content: shadcnContent,
    filename,
    mimeType: "text/css"
  };
}

/**
 * Convert hex color to HSL
 */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

// ExportFormat enum moved to @/constants/export

/**
 * Main export function that handles all formats
 */
export async function exportPalette(
  colors: Color[],
  format: ExportFormat,
  options: ExportOptions = {}
): Promise<ExportResult> {
  switch (format) {
    case ExportFormat.PNG:
      return exportToPNG(colors, options);
    case ExportFormat.SVG:
      return exportToSVG(colors, options);
    case ExportFormat.CSS:
      return exportToCSS(colors, options);
    case ExportFormat.JSON:
      return exportToJSON(colors, options);
    case ExportFormat.SCSS:
      return exportToSCSS(colors, options);
    case ExportFormat.TAILWIND:
      return exportToTailwind(colors, options);
    case ExportFormat.DAISYUI:
      return exportToDaisyUI(colors, options);
    case ExportFormat.SHADCN:
      return exportToShadcnUI(colors, options);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}
