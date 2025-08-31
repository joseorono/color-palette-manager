import { create } from "zustand";
import { nanoidColorId } from "@/constants/nanoid";
import { Color, Palette } from "@/types/palette";
import { ColorUtils } from "@/lib/color-utils";
import { PaletteUtils } from "@/lib/palette-utils";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";
import { PaletteDBQueries } from "@/db/queries";
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
    const { selectedPreset } = get();
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

    const colors = PaletteUtils.generateHarmoniousHexCsv(
      undefined,
      count,
      [],
      usePreset || undefined
    );
    const paletteColors: Color[] = colors.map((hex) => ({
      id: nanoidColorId(),
      hex,
      locked: false,
    }));

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
      const newColors = currentPalette.colors.map((color) => {
        if (color.locked) return color;
        return { ...color, hex: ColorUtils.generateRandomColorHex() };
      });

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

  addColor: () => {
    const { currentPalette } = get();
    if (!currentPalette || currentPalette.colors.length >= MAX_PALETTE_COLORS)
      return;

    const newColor: Color = {
      id: nanoidColorId(),
      hex: ColorUtils.generateRandomColorHex(),
      locked: false,
    };

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
      // Extract URLSearchParams from the URL string
      const urlObject = new URL(url, window.location.origin);
      const urlParams = urlObject.searchParams;

      const palette = await PaletteUrlUtils.paletteFromUrlParams(urlParams);
      if (palette) {
        // Determine if this is an existing saved palette (has a real ID from DB)
        const isExistingPalette = urlParams.has("paletteId");

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
