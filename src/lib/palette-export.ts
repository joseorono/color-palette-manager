import { Color } from "@/types/palette";
import { ExportOptions, ExportResult } from "@/types/export";
import { ExportFormat } from "@/constants/export";

/**
 * Utility class for exporting color palettes in various formats.
 */
export class PaletteExport {
  /**
   * Export palette as PNG image using Canvas API
   * @param colors - Array of colors to export
   * @param options - Export options including width, height, and filename
   * @returns Promise resolving to ExportResult with PNG blob
   * @throws Error if DOM environment is not available or canvas context fails
   */
  static async toPNG(
    colors: Color[],
    options: ExportOptions = {}
  ): Promise<ExportResult> {
    const {
      width = 800,
      height = 200,
      filename = "color-palette.png",
    } = options;

    if (typeof document === "undefined") {
      throw new Error("PNG export requires DOM environment");
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Failed to get canvas context");
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
            mimeType: "image/png",
          });
        } else {
          reject(new Error("Failed to create PNG blob"));
        }
      });
    });
  }

  /**
   * Export palette as SVG vector image
   * @param colors - Array of colors to export
   * @param options - Export options including width, height, and filename
   * @returns ExportResult with SVG string content
   */
  static toSVG(colors: Color[], options: ExportOptions = {}): ExportResult {
    const {
      width = 800,
      height = 200,
      filename = "color-palette.svg",
    } = options;
    const colorWidth = width / colors.length;

    let svgContent = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;

    colors.forEach((color, index) => {
      svgContent += `<rect x="${index * colorWidth}" y="0" width="${colorWidth}" height="${height}" fill="${color.hex}"/>`;
    });

    svgContent += "</svg>";

    return {
      content: svgContent,
      filename,
      mimeType: "image/svg+xml",
    };
  }

  /**
   * Export palette as CSS variables and utility classes
   * @param colors - Array of colors to export
   * @param options - Export options including filename
   * @returns ExportResult with CSS string content including CSS custom properties and utility classes
   */
  static toCSS(colors: Color[], options: ExportOptions = {}): ExportResult {
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
      mimeType: "text/css",
    };
  }

  /**
   * Export palette as JSON data
   * @param colors - Array of colors to export
   * @param options - Export options including filename and palette name
   * @returns ExportResult with JSON string content containing palette metadata and color data
   */
  static toJSON(colors: Color[], options: ExportOptions = {}): ExportResult {
    const { filename = "color-palette.json", paletteName = "Color Palette" } =
      options;

    const paletteData = {
      name: paletteName,
      colors: colors.map((color, index) => ({
        name: `Color ${index + 1}`,
        hex: color.hex,
        index: index + 1,
        locked: color.locked,
      })),
      createdAt: new Date().toISOString(),
      totalColors: colors.length,
    };

    return {
      content: JSON.stringify(paletteData, null, 2),
      filename,
      mimeType: "application/json",
    };
  }

  /**
   * Export palette as SCSS variables
   * @param colors - Array of colors to export
   * @param options - Export options including filename
   * @returns ExportResult with SCSS string content including variables and color map
   */
  static toSCSS(colors: Color[], options: ExportOptions = {}): ExportResult {
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
      mimeType: "text/scss",
    };
  }

  /**
   * Export palette as Tailwind CSS config
   * @param colors - Array of colors to export
   * @param options - Export options including filename
   * @returns ExportResult with JavaScript string content for Tailwind CSS configuration
   */
  static toTailwind(
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
      mimeType: "application/javascript",
    };
  }

  /**
   * Export palette as DaisyUI theme config
   * @param colors - Array of colors to export
   * @param options - Export options including filename and palette name
   * @returns ExportResult with JavaScript string content for DaisyUI theme configuration
   */
  static toDaisyUI(colors: Color[], options: ExportOptions = {}): ExportResult {
    const { filename = "daisyui-theme.js", paletteName = "custom" } = options;

    const colorNames = [
      "primary",
      "secondary",
      "accent",
      "neutral",
      "base-100",
    ];

    let daisyContent = "// DaisyUI Theme Configuration\n";
    daisyContent += "module.exports = {\n";
    daisyContent += "  daisyui: {\n";
    daisyContent += "    themes: [\n";
    daisyContent += "      {\n";
    daisyContent += `        "${paletteName}": {\n`;

    colors.forEach((color, index) => {
      if (index < colorNames.length) {
        const comma =
          index < Math.min(colors.length, colorNames.length) - 1 ? "," : "";
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
      mimeType: "application/javascript",
    };
  }

  /**
   * Export palette as Shadcn/UI CSS variables
   * @param colors - Array of colors to export
   * @param options - Export options including filename
   * @returns ExportResult with CSS string content for Shadcn/UI variables in HSL format
   */
  static toShadcnUI(
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
        const hsl = PaletteExport.hexToHSL(color.hex);
        shadcnContent += `    --${shadcnNames[index]}: ${hsl.h} ${hsl.s}% ${hsl.l}%;\n`;
      }
    });

    shadcnContent += "  }\n";
    shadcnContent += "}\n";

    return {
      content: shadcnContent,
      filename,
      mimeType: "text/css",
    };
  }

  /**
   * Convert hex color to HSL format
   * @param hex - Hex color string (with or without #)
   * @returns Object with h, s, l values as numbers
   * @private
   */
  private static hexToHSL(hex: string): { h: number; s: number; l: number } {
    // Remove # if present
    hex = hex.replace("#", "");

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
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  /**
   * Main export function that handles all formats
   * @param colors - Array of colors to export
   * @param format - Export format from ExportFormat enum
   * @param options - Export options including filename and format-specific settings
   * @returns Promise resolving to ExportResult with the exported content
   * @throws Error if the export format is unsupported
   */
  static async export(
    colors: Color[],
    format: ExportFormat,
    options: ExportOptions = {}
  ): Promise<ExportResult> {
    switch (format) {
      case ExportFormat.PNG:
        return PaletteExport.toPNG(colors, options);
      case ExportFormat.SVG:
        return PaletteExport.toSVG(colors, options);
      case ExportFormat.CSS:
        return PaletteExport.toCSS(colors, options);
      case ExportFormat.JSON:
        return PaletteExport.toJSON(colors, options);
      case ExportFormat.SCSS:
        return PaletteExport.toSCSS(colors, options);
      case ExportFormat.TAILWIND:
        return PaletteExport.toTailwind(colors, options);
      case ExportFormat.DAISYUI:
        return PaletteExport.toDaisyUI(colors, options);
      case ExportFormat.SHADCN:
        return PaletteExport.toShadcnUI(colors, options);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }
}
