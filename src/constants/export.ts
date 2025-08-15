/**
 * Export formats enum for type safety
 */
export enum ExportFormat {
  PNG = "png",
  SVG = "svg",
  CSS = "css",
  JSON = "json",
  SCSS = "scss",
  TAILWIND = "tailwind",
  DAISYUI = "daisyui",
  SHADCN = "shadcn",
}

export const exportFormats = Object.values(ExportFormat);

/**
 * Export format configuration with display names and descriptions
 */
export const exportFormatConfig = {
  [ExportFormat.PNG]: {
    label: "PNG Image",
    description: "Raster image format",
  },
  [ExportFormat.SVG]: {
    label: "SVG Vector",
    description: "Scalable vector graphics",
  },
  [ExportFormat.CSS]: {
    label: "CSS Variables",
    description: "CSS custom properties",
  },
  [ExportFormat.JSON]: {
    label: "JSON Data",
    description: "Structured data format",
  },
  [ExportFormat.SCSS]: {
    label: "SCSS Variables",
    description: "Sass preprocessor variables",
  },
  [ExportFormat.TAILWIND]: {
    label: "Tailwind Config",
    description: "Tailwind CSS configuration",
  },
  [ExportFormat.DAISYUI]: {
    label: "DaisyUI Theme",
    description: "DaisyUI theme configuration",
  },
  [ExportFormat.SHADCN]: {
    label: "Shadcn/UI Variables",
    description: "Shadcn/UI CSS variables",
  },
} as const;
