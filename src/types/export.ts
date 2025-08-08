export interface ExportOptions {
  width?: number;
  height?: number;
  filename?: string;
  paletteName?: string;
}

export interface ExportResult {
  content: string | Blob;
  filename: string;
  mimeType: string;
}

export type ExportFormatType = "png" | "svg" | "css" | "json";
