import { ExportFormat } from "@/constants/export";

export interface Color {
  id: string;
  hex: string;
  locked: boolean;
  name?: string;
}

export interface Palette {
  id: string;
  name: string;
  colors: Color[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  isPublic: boolean;
  tags?: string[];
}

export interface PaletteExport {
  format: ExportFormat;
  palette: Palette;
}

/*
=========================
   Accessibility
=========================
*/

// WCAGContrastLevel, with array for validation
export enum WCAGContrastLevel {
  FAIL = "fail",
  AA = "aa",
  AAA = "aaa",
}

export const WCAGContrastLevels = Object.values(WCAGContrastLevel);

export interface WCAGContrastResult {
  ratio: number;
  level: WCAGContrastLevel;
}
