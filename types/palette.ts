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
  format: 'png' | 'svg' | 'css' | 'json';
  palette: Palette;
}

export interface ContrastResult {
  ratio: number;
  level: 'fail' | 'aa' | 'aaa';
}