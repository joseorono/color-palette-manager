import { useQueryState } from "nuqs";
import { Palette } from "@/types/palette";
import { PaletteDBQueries } from "@/db/queries";
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
  currentPalette?: Palette;
}

export function PaletteSelector({ currentPalette }: PaletteSelectorProps) {
  // Use nuqs to manage paletteId URL parameter
  const [paletteId, setPaletteId] = useQueryState("paletteId", {
    defaultValue: "",
  });

  // Fetch palettes from the database using PaletteDBQueries
  const palettes = useLiveQuery(async () => {
    try {
      return await PaletteDBQueries.getAllPalettes();
    } catch (error) {
      console.error('Failed to fetch palettes:', error);
      return [];
    }
  }, []);

  // Handle palette selection by updating URL parameter
  const handlePaletteChange = (selectedPaletteId: string) => {
    setPaletteId(selectedPaletteId);
  };

  // Use currentPalette ID if provided, otherwise use URL parameter
  const selectedPaletteId = currentPalette?.id || paletteId;

  return (
    <div className="w-full md:w-64">
      <Select value={selectedPaletteId} onValueChange={handlePaletteChange}>
        <SelectTrigger className="h-10 w-full rounded-md bg-primary px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90">
          <span className="mr-2">🎨</span>
          <SelectValue placeholder="Select a palette">
            {currentPalette && !palettes?.length ? currentPalette.name : undefined}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Your Palettes</SelectLabel>
            {palettes?.map((palette) => (
              <SelectItem key={palette.id} value={palette.id}>
                {palette.name}
              </SelectItem>
            ))}
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
