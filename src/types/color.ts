/**
 * Color-related types and interfaces
 */

/**
 * Result interface for color format conversions
 */
export interface ColorFormatResult {
  hex: string;
  rgb: string;
  hsl: string;
  hsv: string;
  cmyk: string;
  lab: string;
  name: string;
}

/**
 * RGB color object
 */
export interface RgbColorObj {
  r: number;
  g: number;
  b: number;
}

/**
 * LAB color object
 */
export interface LabColorObj {
  l: number;
  a: number;
  b: number;
}

/**
 * CMYK color object
 */
export interface CmykColorObj {
  c: number;
  m: number;
  y: number;
  k: number;
}

/**
 * Result interface for finding nearest named colors
 */
export interface NearestColorResult {
  name: string;
  distance: number;
}
