import { describe, it, expect } from 'vitest';
import { Color } from '@/types/palette';
import { PaletteExport } from './palette-export';
import { ExportFormat } from '@/constants/export';
import type { ExportOptions } from '@/types/export';

// Mock color palette for testing
const mockColors: Color[] = [
  { hex: '#FF5733', locked: false },
  { hex: '#33FF57', locked: true },
  { hex: '#3357FF', locked: false },
  { hex: '#FF33F5', locked: false },
  { hex: '#F5FF33', locked: true }
];

describe('Palette Export Functions', () => {
  describe('PaletteExport.toSVG', () => {
    it('should generate valid SVG content', () => {
      const result = PaletteExport.toSVG(mockColors);

      expect(result.filename).toBe('color-palette.svg');
      expect(result.mimeType).toBe('image/svg+xml');
      expect(result.content).toContain('<svg width="800" height="200"');
      expect(result.content).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(result.content).toContain('</svg>');

      // Check that all colors are included
      mockColors.forEach(color => {
        expect(result.content).toContain(`fill="${color.hex}"`);
      });
    });

    it('should respect custom dimensions', () => {
      const options: ExportOptions = { width: 1000, height: 300 };
      const result = PaletteExport.toSVG(mockColors, options);

      expect(result.content).toContain('<svg width="1000" height="300"');
    });

    it('should use custom filename', () => {
      const options: ExportOptions = { filename: 'custom-palette.svg' };
      const result = PaletteExport.toSVG(mockColors, options);

      expect(result.filename).toBe('custom-palette.svg');
    });

    it('should handle empty color array', () => {
      const result = PaletteExport.toSVG([]);

      expect(result.content).toContain('<svg width="800" height="200"');
      expect(result.content).toContain('</svg>');
    });
  });

  describe('PaletteExport.toCSS', () => {
    it('should generate valid CSS with variables and classes', () => {
      const result = PaletteExport.toCSS(mockColors);

      expect(result.filename).toBe('color-palette.css');
      expect(result.mimeType).toBe('text/css');
      expect(result.content).toContain('/* Color Palette CSS Variables */');
      expect(result.content).toContain(':root {');
      expect(result.content).toContain('/* Color Classes */');

      // Check CSS variables
      mockColors.forEach((color, index) => {
        expect(result.content).toContain(`--color-${index + 1}: ${color.hex};`);
        expect(result.content).toContain(`.color-${index + 1} { color: ${color.hex}; }`);
        expect(result.content).toContain(`.bg-color-${index + 1} { background-color: ${color.hex}; }`);
      });
    });

    it('should use custom filename', () => {
      const options: ExportOptions = { filename: 'my-colors.css' };
      const result = PaletteExport.toCSS(mockColors, options);

      expect(result.filename).toBe('my-colors.css');
    });
  });

  describe('PaletteExport.toJSON', () => {
    it('should generate valid JSON with palette data', () => {
      const result = PaletteExport.toJSON(mockColors);

      expect(result.filename).toBe('color-palette.json');
      expect(result.mimeType).toBe('application/json');

      const parsedData = JSON.parse(result.content as string);

      expect(parsedData.name).toBe('Color Palette');
      expect(parsedData.colors).toHaveLength(mockColors.length);
      expect(parsedData.totalColors).toBe(mockColors.length);
      expect(parsedData.createdAt).toBeDefined();

      // Check color data structure
      parsedData.colors.forEach((color: any, index: number) => {
        expect(color.name).toBe(`Color ${index + 1}`);
        expect(color.hex).toBe(mockColors[index].hex);
        expect(color.index).toBe(index + 1);
        expect(color.locked).toBe(mockColors[index].locked);
      });
    });

    it('should use custom palette name', () => {
      const options: ExportOptions = { paletteName: 'My Custom Palette' };
      const result = PaletteExport.toJSON(mockColors, options);

      const parsedData = JSON.parse(result.content as string);
      expect(parsedData.name).toBe('My Custom Palette');
    });

    it('should generate valid JSON for empty array', () => {
      const result = PaletteExport.toJSON([]);

      const parsedData = JSON.parse(result.content as string);
      expect(parsedData.colors).toHaveLength(0);
      expect(parsedData.totalColors).toBe(0);
    });
  });

  describe('PaletteExport.toSCSS', () => {
    it('should generate valid SCSS variables and map', () => {
      const result = PaletteExport.toSCSS(mockColors);

      expect(result.filename).toBe('color-palette.scss');
      expect(result.mimeType).toBe('text/scss');
      expect(result.content).toContain('// Color Palette SCSS Variables');
      expect(result.content).toContain('// Color Map');
      expect(result.content).toContain('$colors: (');

      // Check SCSS variables
      mockColors.forEach((color, index) => {
        expect(result.content).toContain(`$color-${index + 1}: ${color.hex};`);
        expect(result.content).toContain(`"color-${index + 1}": ${color.hex}`);
      });
    });
  });

  describe('PaletteExport.toTailwind', () => {
    it('should generate valid Tailwind config', () => {
      const result = PaletteExport.toTailwind(mockColors);

      expect(result.filename).toBe('tailwind-colors.js');
      expect(result.mimeType).toBe('application/javascript');
      expect(result.content).toContain('// Tailwind CSS Color Configuration');
      expect(result.content).toContain('module.exports = {');
      expect(result.content).toContain('theme: {');
      expect(result.content).toContain('extend: {');
      expect(result.content).toContain('colors: {');

      // Check color entries
      mockColors.forEach((color, index) => {
        expect(result.content).toContain(`'palette-${index + 1}': '${color.hex}'`);
      });
    });
  });

  describe('PaletteExport.toDaisyUI', () => {
    it('should generate valid DaisyUI theme config', () => {
      const result = PaletteExport.toDaisyUI(mockColors);

      expect(result.filename).toBe('daisyui-theme.js');
      expect(result.mimeType).toBe('application/javascript');
      expect(result.content).toContain('// DaisyUI Theme Configuration');
      expect(result.content).toContain('daisyui: {');
      expect(result.content).toContain('themes: [');
      expect(result.content).toContain('"custom": {');

      // Check that semantic color names are used
      const semanticNames = ['primary', 'secondary', 'accent', 'neutral', 'base-100'];
      semanticNames.forEach((name, index) => {
        if (index < mockColors.length) {
          expect(result.content).toContain(`"${name}": "${mockColors[index].hex}"`);
        }
      });
    });

    it('should use custom theme name', () => {
      const options: ExportOptions = { paletteName: 'sunset' };
      const result = PaletteExport.toDaisyUI(mockColors, options);

      expect(result.content).toContain('"sunset": {');
    });
  });

  describe('PaletteExport.toShadcnUI', () => {
    it('should generate valid Shadcn/UI CSS variables', () => {
      const result = PaletteExport.toShadcnUI(mockColors);

      expect(result.filename).toBe('shadcn-colors.css');
      expect(result.mimeType).toBe('text/css');
      expect(result.content).toContain('/* Shadcn/UI Color Variables */');
      expect(result.content).toContain('@layer base {');
      expect(result.content).toContain(':root {');

      // Check that HSL values are generated
      expect(result.content).toContain('--primary:');
      expect(result.content).toContain('--secondary:');
    });

    it('should convert hex to HSL format', () => {
      const result = PaletteExport.toShadcnUI([{ hex: '#FF0000', locked: false }]);

      // Red should convert to approximately 0 360% 50%
      expect(result.content).toContain('--primary: 0 100% 50%');
    });
  });

  describe('PaletteExport.export', () => {
    it('should route to correct export function based on format', async () => {
      const svgResult = await PaletteExport.export(mockColors, ExportFormat.SVG);
      expect(svgResult.mimeType).toBe('image/svg+xml');

      const cssResult = await PaletteExport.export(mockColors, ExportFormat.CSS);
      expect(cssResult.mimeType).toBe('text/css');

      const jsonResult = await PaletteExport.export(mockColors, ExportFormat.JSON);
      expect(jsonResult.mimeType).toBe('application/json');
    });

    it('should throw error for unsupported format', async () => {
      await expect(
        PaletteExport.export(mockColors, 'INVALID' as ExportFormat)
      ).rejects.toThrow('Unsupported export format: invalid');
    });

    it('should pass options to underlying export functions', async () => {
      const options: ExportOptions = { filename: 'test.svg', width: 1000 };
      const result = await PaletteExport.export(mockColors, ExportFormat.SVG, options);

      expect(result.filename).toBe('test.svg');
      expect(result.content).toContain('width="1000"');
    });
  });

  describe('Edge Cases', () => {
    it('should handle single color', () => {
      const singleColor: Color[] = [{ hex: '#FF0000', locked: false }];

      const svgResult = PaletteExport.toSVG(singleColor);
      expect(svgResult.content).toContain('width="800"');

      const cssResult = PaletteExport.toCSS(singleColor);
      expect(cssResult.content).toContain('--color-1: #FF0000;');
    });

    it('should handle colors with different hex formats', () => {
      const mixedColors: Color[] = [
        { hex: '#FF0000', locked: false },
        { hex: '#00ff00', locked: false }, // lowercase
        { hex: '#0000FF', locked: false }
      ];

      const result = PaletteExport.toJSON(mixedColors);
      const parsedData = JSON.parse(result.content as string);

      expect(parsedData.colors[0].hex).toBe('#FF0000');
      expect(parsedData.colors[1].hex).toBe('#00ff00');
      expect(parsedData.colors[2].hex).toBe('#0000FF');
    });

    it('should handle very long color arrays', () => {
      const manyColors: Color[] = Array.from({ length: 50 }, (_, i) => ({
        hex: `#${i.toString(16).padStart(6, '0')}`,
        locked: false
      }));

      const result = PaletteExport.toCSS(manyColors);
      expect(result.content).toContain('--color-50:');
      expect(result.content).toContain('.bg-color-50 {');
    });
  });

  describe('HSL Conversion', () => {
    it('should correctly convert common hex colors to HSL', () => {
      // Test with known color conversions
      const redColor: Color[] = [{ hex: '#FF0000', locked: false }];
      const result = PaletteExport.toShadcnUI(redColor);
      expect(result.content).toContain('--primary: 0 100% 50%');

      const whiteColor: Color[] = [{ hex: '#FFFFFF', locked: false }];
      const whiteResult = PaletteExport.toShadcnUI(whiteColor);
      expect(whiteResult.content).toContain('--primary: 0 0% 100%');

      const blackColor: Color[] = [{ hex: '#000000', locked: false }];
      const blackResult = PaletteExport.toShadcnUI(blackColor);
      expect(blackResult.content).toContain('--primary: 0 0% 0%');
    });
  });
});
