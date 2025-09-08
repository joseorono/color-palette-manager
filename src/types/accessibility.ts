/**
 * Types for accessibility-related functionality including WCAG compliance and color vision deficiencies
 */

// Color Vision Deficiency Types
export enum ColorBlindnessType {
  NORMAL = 'normal',
  PROTANOMALY = 'protanomaly',
  DEUTERANOMALY = 'deuteranomaly', 
  TRITANOMALY = 'tritanomaly',
  PROTANOPIA = 'protanopia',
  DEUTERANOPIA = 'deuteranopia',
  TRITANOPIA = 'tritanopia',
  ACHROMATOPSIA = 'achromatopsia',
  BLUE_CONE_MONOCHROMACY = 'blue_cone_monochromacy'
}

// Color Vision Deficiency Information
export interface ColorVisionDeficiencyInfo {
  name: string;
  description: string;
  prevalence: string;
  category: 'normal' | 'anomalous_trichromacy' | 'dichromacy' | 'monochromacy';
  supportsSeverity: boolean;
}

// Simulation Matrix (3x3 transformation matrix)
export type SimulationMatrix = [
  [number, number, number],
  [number, number, number], 
  [number, number, number]
];

// Color Vision Simulation Result
export interface ColorVisionSimulationResult {
  originalColor: string;
  simulatedColor: string;
  visionType: ColorBlindnessType;
  severity?: number;
}

// Batch simulation result for palettes
export interface PaletteSimulationResult {
  originalPalette: string[];
  simulatedPalette: string[];
  visionType: ColorBlindnessType;
  severity?: number;
}