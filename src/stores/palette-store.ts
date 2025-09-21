import { create } from "zustand";
import { Color, Palette } from "@/types/palette";
import { ColorUtils } from "@/lib/color-utils";
import { PaletteUtils } from "@/lib/palette-utils";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";
import { PaletteDBQueries } from "@/db/queries";
import { UrlUtils } from "@/lib/url-utils";
import { arrayMove } from "@dnd-kit/sortable";
import { MAX_PALETTE_COLORS } from "@/constants/ui";
import { HarmonyPreset } from "@/types/color-harmonies";
import {
  COLOR_HARMONY_OPTIONS,
  DEFAULT_HARMONY_PRESET,
} from "@/constants/color-harmonies";
import { toast } from "sonner";

interface PaletteStore {
  currentPalette: Palette;
  savedPalettes: Palette[];
  isGenerating: boolean;
  isSaved: boolean; // Track if current palette has been saved
  hasUnsavedChanges: boolean; // Track if there are unsaved changes
  selectedPreset: HarmonyPreset | null; // Track the selected preset for quick generation

  // Actions
  generateNewPalette: (count?: number, preset?: HarmonyPreset) => void;
  regenerateUnlocked: () => void;
  setSelectedPreset: (preset: HarmonyPreset) => void;
  toggleColorLock: (index: number) => void;
  updateColor: (
    index: number,
    updates: Partial<Pick<Color, "hex" | "role" | "name">>
  ) => void;
  addColor: () => void;
  addHarmoniousColor: () => void;
  removeColor: (index: number) => void;
  reorderColors: (dragIndex: number, hoverIndex: number) => void;
  savePalette: (
    nameOrPalette: string | Palette,
    isPublic?: boolean
  ) => Promise<string>;
  loadSavedPalettes: () => Promise<void>;
  loadPaletteFromUrl: (url: string) => Promise<void>;
  markAsSaved: () => void;
  resetUnsavedChanges: () => void;
}

export const usePaletteStore = create<PaletteStore>((set, get) => ({
  currentPalette: PaletteUtils.createEmptyPalette(),
  savedPalettes: [],
  isGenerating: false,
  isSaved: false,
  hasUnsavedChanges: false,
  selectedPreset: null,

  generateNewPalette: (count = 5, preset?: HarmonyPreset) => {
    const { selectedPreset, currentPalette } = get();
    const usePreset = preset || selectedPreset || DEFAULT_HARMONY_PRESET;

    set({ isGenerating: true });

    // Show toast notification with preset name
    if (usePreset) {
      const presetOption = COLOR_HARMONY_OPTIONS.find(
        (option) => option.value === usePreset
      );
      const presetName = presetOption?.prettyName || usePreset;
      toast.info(`Generating ${presetName} palette`);

      // Update selectedPreset if a new preset was provided
      if (preset) {
        set({ selectedPreset: preset });
      }
    }

    // Preserve locked colors when generating new palette
    const lockedColors = currentPalette ? PaletteUtils.getLockedColors(currentPalette.colors) : [];

    const colors = PaletteUtils.generateHarmoniousHexCsv(
      undefined,
      count,
      lockedColors, // Pass locked Color objects directly
      usePreset || undefined
    );

    // Create new palette colors, preserving locked colors with their original properties
    const paletteColors: Color[] = colors.map((hex) => {
      // Check if this hex matches a locked color
      const existingLockedColor = lockedColors.find(lockedColor => lockedColor.hex === hex);
      if (existingLockedColor) {
        return existingLockedColor; // Keep the original locked color with all its properties
      }

      return ColorUtils.HexToColor(hex);
    });

    const newPalette: Palette = {
      ...get().currentPalette,
      colors: paletteColors,
    };

    set({
      currentPalette: newPalette,
      isGenerating: false,
      isSaved: false,
      hasUnsavedChanges: true,
    });
  },

  regenerateUnlocked: () => {
    const { currentPalette } = get();
    if (!currentPalette) return;

    set({ isGenerating: true });

    setTimeout(() => {
      const { selectedPreset } = get();

      const lockedColors = PaletteUtils.getLockedColors(currentPalette.colors);
      const lockedHexes = new Set(lockedColors.map(color => color.hex));

      // Generate harmonious colors for the entire palette
      const harmoniousHexColors = PaletteUtils.generateHarmoniousHexCsv(
        undefined, // Let it determine base color from locked colors
        currentPalette.colors.length,
        lockedColors, // Pass only locked colors
        selectedPreset || DEFAULT_HARMONY_PRESET
      );


      // Start with locked colors, then append new harmonious colors
      const newColors = [...lockedColors];

      // Add harmonious colors that aren't duplicates of locked colors
      for (const hex of harmoniousHexColors) {
        if (!lockedHexes.has(hex) && newColors.length < currentPalette.colors.length) {
          newColors.push(ColorUtils.HexToColor(hex));
        }
      }

      // If we still need more colors, generate additional ones
      while (newColors.length < currentPalette.colors.length) {
        console.log("If you see this, it means GenerateHarmoniousHexCsv is not generating enough colors. Contact Jose.")
        const randomHex = ColorUtils.generateRandomColorHex();
        if (!lockedHexes.has(randomHex)) {
          newColors.push(ColorUtils.HexToColor(randomHex));
        }
      }

      const updatedPalette: Palette = {
        ...currentPalette,
        colors: newColors,
        updatedAt: new Date(),
      };

      set({
        currentPalette: updatedPalette,
        isGenerating: false,
        hasUnsavedChanges: true,
      });
    }, 300);
  },

  toggleColorLock: (index: number) => {
    const { currentPalette } = get();
    if (!currentPalette || !currentPalette.colors[index]) return;

    const newColors = [...currentPalette.colors];
    newColors[index] = {
      ...newColors[index],
      locked: !newColors[index].locked,
    };

    const updatedPalette: Palette = {
      ...currentPalette,
      colors: newColors,
      updatedAt: new Date(),
    };

    set({
      currentPalette: updatedPalette,
      hasUnsavedChanges: true,
    });
  },

  updateColor: (
    index: number,
    updates: Partial<Pick<Color, "hex" | "role" | "name">>
  ) => {
    const { currentPalette } = get();
    if (!currentPalette || !currentPalette.colors[index]) return;

    // If updating role (not removing), check if it's already assigned to another color
    if (updates.role !== undefined && updates.role !== null) {
      const assignedRoles = PaletteUtils.getAssignedRoles(
        currentPalette.colors
      );
      const currentColor = currentPalette.colors[index];

      if (
        assignedRoles.has(updates.role) &&
        currentColor.role !== updates.role
      ) {
        //TODO: instead of a console.error(), show a toast.
        // toast.warning(`The role "${updates.role}" is already assigned to another color. Please remove it first or choose a different role.`);
        console.error(
          `The role "${updates.role}" is already assigned to another color. Please remove it first or choose a different role.`
        );
        return;
      }
    }

    // Update the target color with the provided updates
    const newColors = [...currentPalette.colors];
    newColors[index] = { ...newColors[index], ...updates };

    const updatedPalette: Palette = {
      ...currentPalette,
      colors: newColors,
      updatedAt: new Date(),
    };

    set({
      currentPalette: updatedPalette,
      hasUnsavedChanges: true,
    });
  },

  getColorCount: () => {
    const { currentPalette } = get();
    return currentPalette?.colors.length || 0;
  },

  addColor: () => {
    const { currentPalette } = get();
    if (!currentPalette || currentPalette.colors.length >= MAX_PALETTE_COLORS)
      return;

    const newColor = ColorUtils.HexToColor(ColorUtils.generateRandomColorHex());

    const updatedPalette: Palette = {
      ...currentPalette,
      colors: [...currentPalette.colors, newColor],
      updatedAt: new Date(),
    };

    set({
      currentPalette: updatedPalette,
      hasUnsavedChanges: true,
    });
  },

  addHarmoniousColor: () => {
    const { currentPalette, selectedPreset } = get();
    if (!currentPalette || currentPalette.colors.length >= MAX_PALETTE_COLORS)
      return;

    // Generate one additional harmonious color, considering all existing colors
    const newColors = PaletteUtils.generateHarmoniousHexCsv(
      undefined, // Let it determine base color from existing colors
      currentPalette.colors.length + 1, // Current count + 1
      currentPalette.colors, // Pass all existing Color objects directly
      selectedPreset || DEFAULT_HARMONY_PRESET
    );

    // Get the new color (should be the last one in the array)
    const newHex = newColors[newColors.length - 1];

    const newColor = ColorUtils.HexToColor(newHex);

    const updatedPalette: Palette = {
      ...currentPalette,
      colors: [...currentPalette.colors, newColor],
      updatedAt: new Date(),
    };

    set({
      currentPalette: updatedPalette,
      hasUnsavedChanges: true,
    });
  },

  removeColor: (index: number) => {
    const { currentPalette } = get();
    if (!currentPalette || currentPalette.colors.length <= 2) return;

    const newColors = currentPalette.colors.filter((_, i) => i !== index);

    const updatedPalette: Palette = {
      ...currentPalette,
      colors: newColors,
      updatedAt: new Date(),
    };

    set({
      currentPalette: updatedPalette,
      hasUnsavedChanges: true,
    });
  },

  reorderColors: (dragIndex: number, hoverIndex: number) => {
    const { currentPalette } = get();
    if (!currentPalette) return;

    const newColors = arrayMove(currentPalette.colors, dragIndex, hoverIndex);

    const updatedPalette: Palette = {
      ...currentPalette,
      colors: newColors,
      updatedAt: new Date(),
    };

    set({
      currentPalette: updatedPalette,
      hasUnsavedChanges: true,
    });
  },

  savePalette: async (nameOrPalette: string | Palette, isPublic = false) => {
    const { currentPalette } = get();
    if (!currentPalette) throw new Error("No palette to save");

    try {
      // Support both: (name, isPublic) and (palette)
      const paletteToSave: Palette =
        typeof nameOrPalette === "string"
          ? {
              ...currentPalette,
              name: nameOrPalette,
              isPublic,
              updatedAt: new Date(),
            }
          : {
              ...currentPalette,
              ...nameOrPalette,
              // Ensure timestamps are updated
              updatedAt: new Date(),
            };

      const savedId = await PaletteDBQueries.savePalette(
        paletteToSave,
        paletteToSave.id
      );

      const savedPalette: Palette = {
        ...paletteToSave,
        id: savedId,
      };

      set({
        currentPalette: savedPalette,
        isSaved: true,
        hasUnsavedChanges: false,
      });

      // Refresh saved palettes list
      await get().loadSavedPalettes();

      return savedId;
    } catch (error) {
      console.error("Failed to save palette:", error);
      throw error;
    }
  },

  loadSavedPalettes: async () => {
    try {
      const palettes = await PaletteDBQueries.getAllPalettes();
      set({ savedPalettes: palettes });
    } catch (error) {
      console.error("Failed to load saved palettes:", error);
    }
  },

  loadPaletteFromUrl: async (url: string) => {
    try {
      const urlParams = UrlUtils.getUrlParams(url);

      const palette = await PaletteUrlUtils.paletteFromUrlParams(urlParams);
      if (palette) {
        // Determine if this is an existing saved palette (has a real ID from DB)
        const isExistingPalette = urlParams.has("paletteId");
        // A palette with an empty ID is a new palette that hasn't been saved yet
        const isExistingPalette = !!palette.id;
        
        set({
          currentPalette: palette,
          isSaved: isExistingPalette,
          hasUnsavedChanges: !isExistingPalette,
        });
      }
    } catch (error) {
      console.error("Failed to load palette from URL:", error);
    }
  },

  markAsSaved: () => {
    set({ isSaved: true, hasUnsavedChanges: false });
  },

  resetUnsavedChanges: () => {
    set({ hasUnsavedChanges: false });
  },

  setSelectedPreset: (preset: HarmonyPreset) => {
    set({ selectedPreset: preset });
  },
}));
