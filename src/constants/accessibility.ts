import { ColorBlindnessType, ColorVisionDeficiencyInfo, SimulationMatrix } from '@/types/accessibility';

/**
 * Constants for accessibility features including color vision deficiency information and simulation matrices
 */

// Color Vision Deficiency Information Database
export const COLOR_VISION_DEFICIENCY_INFO: Record<ColorBlindnessType, ColorVisionDeficiencyInfo> = {
  [ColorBlindnessType.NORMAL]: {
    name: 'Normal Vision (Trichromatic)',
    description: 'Normal color vision with all three types of cone cells functioning properly. Can distinguish the full spectrum of colors.',
    prevalence: '92% of men, 99.5% of women',
    category: 'normal',
    supportsSeverity: false
  },
  [ColorBlindnessType.PROTANOMALY]: {
    name: 'Protanomaly',
    description: 'Reduced sensitivity to red light. L-cones have shifted spectral sensitivity, making it difficult to distinguish between reds and greens.',
    prevalence: '1% of men, 0.01% of women',
    category: 'anomalous_trichromacy',
    supportsSeverity: true
  },
  [ColorBlindnessType.DEUTERANOMALY]: {
    name: 'Deuteranomaly',
    description: 'Reduced sensitivity to green light. M-cones have shifted spectral sensitivity, the most common form of color vision deficiency.',
    prevalence: '5% of men, 0.4% of women',
    category: 'anomalous_trichromacy',
    supportsSeverity: true
  },
  [ColorBlindnessType.TRITANOMALY]: {
    name: 'Tritanomaly',
    description: 'Reduced sensitivity to blue light. S-cones have shifted spectral sensitivity, affecting blue-yellow discrimination.',
    prevalence: '0.01% of population',
    category: 'anomalous_trichromacy',
    supportsSeverity: true
  },
  [ColorBlindnessType.PROTANOPIA]: {
    name: 'Protanopia',
    description: 'Complete absence of L-cones (red-sensitive). Cannot distinguish between red and green colors.',
    prevalence: '1% of men, rare in women',
    category: 'dichromacy',
    supportsSeverity: false
  },
  [ColorBlindnessType.DEUTERANOPIA]: {
    name: 'Deuteranopia',
    description: 'Complete absence of M-cones (green-sensitive). Cannot distinguish between red and green colors.',
    prevalence: '1% of men, rare in women',
    category: 'dichromacy',
    supportsSeverity: false
  },
  [ColorBlindnessType.TRITANOPIA]: {
    name: 'Tritanopia',
    description: 'Complete absence of S-cones (blue-sensitive). Cannot distinguish between blue and yellow colors.',
    prevalence: '0.001% of population',
    category: 'dichromacy',
    supportsSeverity: false
  },
  [ColorBlindnessType.ACHROMATOPSIA]: {
    name: 'Achromatopsia',
    description: 'Complete color blindness. Only rod cells function, resulting in monochromatic vision (grayscale).',
    prevalence: '0.003% of population',
    category: 'monochromacy',
    supportsSeverity: false
  },
  [ColorBlindnessType.BLUE_CONE_MONOCHROMACY]: {
    name: 'Blue Cone Monochromacy',
    description: 'Only S-cones function. Severely limited color perception with only blue wavelengths detected.',
    prevalence: '0.001% of population',
    category: 'monochromacy',
    supportsSeverity: false
  }
};

// RGB to LMS transformation matrix (Hunt-Pointer-Estevez)
export const RGB_TO_LMS_MATRIX: SimulationMatrix = [
  [0.31399022, 0.63951294, 0.04649755],
  [0.15537241, 0.75789446, 0.08670142],
  [0.01775239, 0.10944209, 0.87256922]
];

// LMS to RGB transformation matrix (inverse of RGB_TO_LMS)
export const LMS_TO_RGB_MATRIX: SimulationMatrix = [
  [5.47221206, -4.6419601, 0.16963708],
  [-1.1252419, 2.29317094, -0.1678952],
  [0.02980165, -0.19318073, 1.16364789]
];

// Simulation matrices for different types of color vision deficiency
export const SIMULATION_MATRICES: Record<ColorBlindnessType, SimulationMatrix | null> = {
  [ColorBlindnessType.NORMAL]: null, // No transformation needed
  
  // Protanomaly (red-weak) - Brettel et al. 1997
  [ColorBlindnessType.PROTANOMALY]: [
    [0.856167, 0.182038, -0.038205],
    [0.029342, 0.955115, 0.015544],
    [-0.002880, -0.001563, 1.004443]
  ],
  
  // Deuteranomaly (green-weak) - Brettel et al. 1997  
  [ColorBlindnessType.DEUTERANOMALY]: [
    [0.288299, 0.052709, -0.257912],
    [0.711701, 0.947291, 0.257912],
    [0.000000, 0.000000, 1.000000]
  ],
  
  // Tritanomaly (blue-weak) - Brettel et al. 1997
  [ColorBlindnessType.TRITANOMALY]: [
    [1.000000, 0.000000, 0.000000],
    [0.000000, 1.000000, 0.000000],
    [0.000000, 0.000000, 0.000000]
  ],
  
  // Protanopia (no red) - Brettel et al. 1997
  [ColorBlindnessType.PROTANOPIA]: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281, 0.099216],
    [-0.003882, -0.048116, 1.051998]
  ],
  
  // Deuteranopia (no green) - Brettel et al. 1997
  [ColorBlindnessType.DEUTERANOPIA]: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501, 0.047413],
    [-0.011820, 0.042940, 0.968881]
  ],
  
  // Tritanopia (no blue) - Brettel et al. 1997
  [ColorBlindnessType.TRITANOPIA]: [
    [1.000000, 0.000000, 0.000000],
    [0.000000, 1.000000, 0.000000],
    [-0.395913, 0.801109, 0.594804]
  ],
  
  // Achromatopsia (no color) - Convert to grayscale
  [ColorBlindnessType.ACHROMATOPSIA]: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114], 
    [0.299, 0.587, 0.114]
  ],
  
  // Blue cone monochromacy - Only blue channel
  [ColorBlindnessType.BLUE_CONE_MONOCHROMACY]: [
    [0.01775, 0.10945, 0.87262],
    [0.01775, 0.10945, 0.87262],
    [0.01775, 0.10945, 0.87262]
  ]
};

// Vision types that support severity adjustment
export const SEVERITY_SUPPORTED_TYPES = [
  ColorBlindnessType.PROTANOMALY,
  ColorBlindnessType.DEUTERANOMALY,
  ColorBlindnessType.TRITANOMALY
];

// WCAG Contrast Requirements
export const WCAG_CONTRAST_RATIOS = {
  AA: {
    NORMAL_TEXT: 4.5,
    LARGE_TEXT: 3.0
  },
  AAA: {
    NORMAL_TEXT: 7.0,
    LARGE_TEXT: 4.5
  }
} as const;