/**
 * Export formats enum for type safety
 */
export enum ExportFormat {
  PNG = 'png',
  SVG = 'svg',
  CSS = 'css',
  JSON = 'json',
  SCSS = 'scss',
  TAILWIND = 'tailwind',
  DAISYUI = 'daisyui',
  SHADCN = 'shadcn'
}

export const exportFormats = Object.values(ExportFormat);
