import { create } from "zustand";
import { Color, Palette } from "@/types/palette";
import {
  generateHarmoniousPalette,
  generateRandomColor,
} from "@/lib/color-utils";

interface PaletteStore {
  currentPalette: Color[];
  savedPalettes: Palette[];
  isGenerating: boolean;

  // Actions
  generateNewPalette: (count?: number) => void;
  regenerateUnlocked: () => void;
  toggleColorLock: (colorId: string) => void;
  updateColor: (colorId: string, updates: Partial<Pick<Color, 'hex' | 'role' | 'name'>>) => void;
  addColor: () => void;
  removeColor: (colorId: string) => void;
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
      const colors = generateHarmoniousPalette(undefined, count);
      const palette: Color[] = colors.map((hex, index) => ({
        id: `color-${index}-${Date.now()}`,
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
        return { ...color, hex: generateRandomColor() };
      });
      

      set({ currentPalette: newPalette, isGenerating: false });
    }, 300);
  },

  toggleColorLock: (colorId: string) => {
    const { currentPalette } = get();
    const newPalette = currentPalette.map((color) =>
      color.id === colorId ? { ...color, locked: !color.locked } : color
    );
    set({ currentPalette: newPalette });
  },

  updateColor: (colorId: string, updates: Partial<Pick<Color, 'hex' | 'role' | 'name'>>) => {
    const { currentPalette } = get();
    
    // If updating role (not removing), check if it's already assigned to another color
    if (updates.role !== undefined && updates.role !== null) {
      const existingColorWithRole = currentPalette.find(
        (color) => color.role === updates.role && color.id !== colorId
      );
      
      if (existingColorWithRole) {
        //TOOD: instead of a console.error(), show a toast.
        // toast.warning(`The role "${updates.role}" is already assigned to another color. Please remove it first or choose a different role.`);
        console.error(`The role "${updates.role}" is already assigned to another color. Please remove it first or choose a different role.`);
        return;
      }
    }
    
    // Update the target color with the provided updates
    const newPalette = currentPalette.map((color) =>
      color.id === colorId ? { ...color, ...updates } : color
    );
    set({ currentPalette: newPalette });
  },



  addColor: () => {
    const { currentPalette } = get();
    if (currentPalette.length >= 16) return;

    const newColor: Color = {
      id: `color-${currentPalette.length}-${Date.now()}`,
      hex: generateRandomColor(),
      locked: false,
    };

    set({ currentPalette: [...currentPalette, newColor] });
  },

  removeColor: (colorId: string) => {
    const { currentPalette } = get();
    if (currentPalette.length <= 2) return;

    const newPalette = currentPalette.filter((color) => color.id !== colorId);
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
