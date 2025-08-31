// constants/color-harmonies.ts
import {
    ColorHarmony,
    HarmonyPreset,
    ColorHarmonyOption,
    HarmonyPriorityMap,
  } from "@/types/color-harmonies";
import { 
  Sparkles, 
  CircleDashed, 
  Circle, 
  CircleDollarSign, 
  Triangle, 
  Square, 
  GitFork, 
  Grid2x2, 
  Beaker 
} from "lucide-react";

  // Color-theory constants (no "auto" here)
  export const COLOR_HARMONIES = {
    ANALOGOUS: "analogous",
    MONOCHROMATIC: "monochromatic",
    COMPLEMENTARY: "complementary",
    TRIADIC: "triadic",
    TETRADIC: "tetradic",
    SPLIT_COMPLEMENTARY: "splitComplementary",
    SQUARE: "square",
    COMPOUND: "compound",
  } as const satisfies Record<string, ColorHarmony>;

  // Presets (includes the practical generator default)
  export const HARMONY_PRESETS = {
    WEB_FRIENDLY: "webFriendly",
    ...COLOR_HARMONIES,
  } as const satisfies Record<string, HarmonyPreset>;

  export const DEFAULT_HARMONY_PRESET: HarmonyPreset = HARMONY_PRESETS.WEB_FRIENDLY;

  // Priority lists per preset/harmony
  export const HARMONY_GENERATION_PRIORITIES: HarmonyPriorityMap = {
    // Your example default: neutrals first, then relationships, then variations
    [HARMONY_PRESETS.WEB_FRIENDLY]: [
      "white",
      "black",
      "complementary",
      "analogous",
      "variations",
    ],

    // Classic harmonies bias toward their relationship first, then variations, then neutrals
    [COLOR_HARMONIES.ANALOGOUS]: ["analogous", "variations", "white", "black"],
    [COLOR_HARMONIES.MONOCHROMATIC]: ["variations", "white", "black"],
    [COLOR_HARMONIES.COMPLEMENTARY]: ["complementary", "variations", "white", "black"],
    [COLOR_HARMONIES.TRIADIC]: ["triadic", "variations", "white", "black"],
    [COLOR_HARMONIES.TETRADIC]: ["tetradic", "variations", "white", "black"],
    [COLOR_HARMONIES.SPLIT_COMPLEMENTARY]: ["splitComplementary", "variations", "white", "black"],
    [COLOR_HARMONIES.SQUARE]: ["square", "variations", "white", "black"],
    [COLOR_HARMONIES.COMPOUND]: ["compound", "variations", "white", "black"],
  } as const;

  // Type to use in the UI — includes the practical default plus strict harmonies
  export const COLOR_HARMONY_OPTIONS: ColorHarmonyOption[] = [
    {
      value: HARMONY_PRESETS.WEB_FRIENDLY,
      prettyName: "Web-Friendly (Default)",
      description:
        "Smart mix of neutrals (white, black) and common harmonies (complementary, analogous) with tasteful variations. Perfect for web design.",
      icon: Sparkles,
    },
    {
      value: COLOR_HARMONIES.ANALOGOUS,
      prettyName: "Analogous",
      description: "Colors that sit next to each other on the color wheel.",
      icon: CircleDashed,
    },
    {
      value: COLOR_HARMONIES.MONOCHROMATIC,
      prettyName: "Monochromatic",
      description: "Variations in lightness and saturation of a single hue.",
      icon: Circle,
    },
    {
      value: COLOR_HARMONIES.COMPLEMENTARY,
      prettyName: "Complementary",
      description: "Colors opposite each other on the color wheel.",
      icon: CircleDollarSign,
    },
    {
      value: COLOR_HARMONIES.TRIADIC,
      prettyName: "Triadic",
      description: "Three colors evenly spaced on the color wheel.",
      icon: Triangle,
    },
    {
      value: COLOR_HARMONIES.TETRADIC,
      prettyName: "Tetradic",
      description: "Four colors arranged into two complementary pairs.",
      icon: Square,
    },
    {
      value: COLOR_HARMONIES.SPLIT_COMPLEMENTARY,
      prettyName: "Split Complementary",
      description: "A base color plus two adjacent to its complement.",
      icon: GitFork,
    },
    {
      value: COLOR_HARMONIES.SQUARE,
      prettyName: "Square",
      description: "Four colors evenly spaced around the color wheel.",
      icon: Grid2x2,
    },
    {
      value: COLOR_HARMONIES.COMPOUND,
      prettyName: "Compound",
      description: "A balanced mix using complementary and nearby hues.",
      icon: Beaker,
    },
  ];
