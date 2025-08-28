import { useState } from "react";
import { Palette } from "@/types/palette";
import { CSSColorVariablesObject } from "@/types/palette";
import { db } from "@/db/main";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaletteSelectorProps {
  onPaletteSelect: (colors: CSSColorVariablesObject) => void;
}

export function PaletteSelector({ onPaletteSelect }: PaletteSelectorProps) {
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>("");

  // Fetch palettes from the database
  const palettes = useLiveQuery(() => db.palettes.toArray(), []);

  // Handle palette selection
  const handlePaletteChange = (paletteId: string) => {
    setSelectedPaletteId(paletteId);

    // Find the selected palette
    const selectedPalette = palettes?.find((p) => p.id === paletteId);
    if (selectedPalette) {
      // Map palette colors to CSS variables
      const colorVars: CSSColorVariablesObject = {
        primary: "",
        secondary: "",
        accent: "",
        background: "",
        foreground: "",
        card: "",
        border: "",
        muted: "",
        "primary-foreground": "",
        "secondary-foreground": "",
        "accent-foreground": "",
        "card-foreground": "",
        "muted-foreground": "",
      };

      // Apply colors with roles
      selectedPalette.colors.forEach((color) => {
        if (color.role) {
          colorVars[color.role] = color.hex;
        }
      });

      onPaletteSelect(colorVars);
    }
  };

  return (
    <div className="w-full md:w-64">
      <Select value={selectedPaletteId} onValueChange={handlePaletteChange}>
        <SelectTrigger className="h-10 w-full rounded-md bg-primary px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90">
          <span className="mr-2">🎨</span>
          <SelectValue placeholder="Select a palette" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Your Palettes</SelectLabel>
            {palettes?.map(
              (palette) =>
                palette.isPublic && (
                  <SelectItem key={palette.id} value={palette.id}>
                    {palette.name}
                  </SelectItem>
                )
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
      <p className="pt-2 text-sm text-muted-foreground">
        {palettes?.length
          ? `${palettes.length} palette${palettes.length !== 1 ? "s" : ""} available`
          : "No palettes found"}
      </p>
    </div>
  );
}
