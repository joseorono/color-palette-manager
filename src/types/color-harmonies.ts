import { LucideIcon } from "lucide-react";

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

// Presets include the generator "webFriendly" in addition to strict harmonies
export type HarmonyPreset = ColorHarmony | "webFriendly";

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
  icon: LucideIcon;
}
