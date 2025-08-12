import { create } from "zustand";
import { nanoidColorId } from "@/constants/nanoid";
import { Color, Palette } from "@/types/palette";
import { ColorUtils } from "@/lib/color-utils";
import { PaletteUtils } from "@/lib/palette-utils";
import { arrayMove } from "@dnd-kit/sortable";

interface PaletteStore {
  currentPalette: Color[];
  savedPalettes: Palette[];
  isGenerating: boolean;

  // Actions
  generateNewPalette: (count?: number) => void;
  regenerateUnlocked: () => void;
  toggleColorLock: (index: number) => void;
  updateColor: (
    index: number,
    updates: Partial<Pick<Color, "hex" | "role" | "name">>
  ) => void;
  addColor: () => void;
  removeColor: (index: number) => void;
  reorderColors: (dragIndex: number, hoverIndex: number) => void;
  savePalette: (name: string, isPublic?: boolean) => Promise<void>;
  loadSavedPalettes: () => Promise<void>;
  setPaletteFromUrl: (colors: string[]) => void;
}

export const usePaletteStore = create<PaletteStore>((set, get) => ({
  currentPalette: [],
  savedPalettes: [],
  isGenerating: false,

  generateNewPalette: (count = 5) => {
    set({ isGenerating: true });

    setTimeout(() => {
      const colors = PaletteUtils.generateHarmoniousPalette(undefined, count);
      const palette: Color[] = colors.map((hex) => ({
        id: nanoidColorId(),
        hex,
        locked: false,
      }));

      set({ currentPalette: palette, isGenerating: false });
    }, 300); // Add slight delay for UX
  },

  regenerateUnlocked: () => {
    const { currentPalette } = get();
    set({ isGenerating: true });

    setTimeout(() => {
      const newPalette = currentPalette.map((color) => {
        if (color.locked) return color;
        return { ...color, hex: ColorUtils.generateRandomColor() };
      });

      set({ currentPalette: newPalette, isGenerating: false });
    }, 300);
  },

  toggleColorLock: (index: number) => {
    const { currentPalette } = get();
    const newPalette = [...currentPalette];
    newPalette[index] = {
      ...newPalette[index],
      locked: !newPalette[index].locked,
    };
    set({ currentPalette: newPalette });
  },

  updateColor: (
    index: number,
    updates: Partial<Pick<Color, "hex" | "role" | "name">>
  ) => {
    const { currentPalette } = get();

    // If updating role (not removing), check if it's already assigned to another color
    if (updates.role !== undefined && updates.role !== null) {
      const existingColorIndex = currentPalette.findIndex(
        (color, i) => color.role === updates.role && i !== index
      );

      if (existingColorIndex !== -1) {
        //TOOD: instead of a console.error(), show a toast.
        // toast.warning(`The role "${updates.role}" is already assigned to another color. Please remove it first or choose a different role.`);
        console.error(
          `The role "${updates.role}" is already assigned to another color. Please remove it first or choose a different role.`
        );
        return;
      }
    }

    // Update the target color with the provided updates
    const newPalette = [...currentPalette];
    newPalette[index] = { ...newPalette[index], ...updates };
    set({ currentPalette: newPalette });
  },

  addColor: () => {
    const { currentPalette } = get();
    if (currentPalette.length >= 16) return;

    const newColor: Color = {
      id: nanoidColorId(),
      hex: ColorUtils.generateRandomColor(),
      locked: false,
    };

    set({ currentPalette: [...currentPalette, newColor] });
  },

  removeColor: (index: number) => {
    const { currentPalette } = get();
    if (currentPalette.length <= 2) return;

    const newPalette = currentPalette.filter((_, i) => i !== index);
    set({ currentPalette: newPalette });
  },

  reorderColors: (dragIndex: number, hoverIndex: number) => {
    const { currentPalette } = get();
    const newPalette = arrayMove(currentPalette, dragIndex, hoverIndex);
    set({ currentPalette: newPalette });
  },

  savePalette: async (name: string, isPublic = false) => {
    // ToDo: Save palette in DB
    const { currentPalette } = get();
    console.log("Saving palette:", { name, colors: currentPalette, isPublic });
  },

  loadSavedPalettes: async () => {
    // ToDo: Load palettes from DB
    console.log("Loading saved palettes...");
  },

  setPaletteFromUrl: (colors: string[]) => {
    const palette: Color[] = colors.map((hex, index) => ({
      id: `color-${index}-${Date.now()}`,
      hex: hex.startsWith("#") ? hex : `#${hex}`,
      locked: false,
    }));

    set({ currentPalette: palette });
  },
}));
