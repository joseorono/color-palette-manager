import { Color, Palette } from "./palette";

export interface PalettePreviewProps {
  colors: Color[];
  className?: string;
}

export interface ImageUploaderProps {
  onColorsExtracted: (colors: Color[]) => void;
  className?: string;
}

export interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
}

export interface ColorCardProps {
  color: Color;
  onColorChange: (hex: string) => void;
  onToggleLock: () => void;
  onRemove: () => void;
  className?: string;
}
