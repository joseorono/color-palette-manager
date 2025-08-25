
// Strict color-theory harmonies (no presets here)
export type ColorHarmony =
  | "analogous"
  | "monochromatic"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "splitComplementary"
  | "square"
  | "compound";

// Presets include the generator "auto" in addition to strict harmonies
export type HarmonyPreset = ColorHarmony | "auto";

// Tokens used by the generator to decide what to produce first
export type GenerationPriorityToken =
  | "white"
  | "black"
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "splitComplementary"
  | "square"
  | "compound"
  | "variations";

// Map of preset/harmony → generation priority list
export type HarmonyPriorityMap = Record<
  HarmonyPreset,
  readonly GenerationPriorityToken[]
>;

// UI option for selecting a preset/harmony
export interface ColorHarmonyOption {
  value: HarmonyPreset;
  prettyName: string;
  description: string;
  icon: string; // react-lucide icon name
}
