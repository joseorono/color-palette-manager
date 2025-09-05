import { Palette } from "@/types/palette";

interface PaletteDetailsSectionProps {
  palette: Palette;
}

export function PaletteDetailsSection({ palette }: PaletteDetailsSectionProps) {
  return (
    <>
      {/* Palette Colors */}
      <div>
        <h3 className="mb-3 text-lg font-medium">Palette Colors</h3>
        <div className="grid grid-cols-2 gap-3">
          {palette.colors.map((color, index) => (
            <div key={color.id || index} className="flex items-center space-x-3">
              <div
                className="h-8 w-8 rounded-md border shadow-sm flex-shrink-0"
                style={{ backgroundColor: color.hex }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {color.name || `Color ${index + 1}`}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {color.hex.toUpperCase()}
                </p>
                {color.role && (
                  <p className="text-xs text-foreground capitalize">
                    {color.role}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Palette Information */}
      <div>
        <h3 className="mb-3 text-lg font-medium">Palette Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{new Date(palette.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Updated:</span>
            <span>{new Date(palette.updatedAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Colors:</span>
            <span>{palette.colors.length}</span>
          </div>
          {palette.description && (
            <div>
              <span className="text-muted-foreground">Description:</span>
              <p className="mt-1 text-sm">{palette.description}</p>
            </div>
          )}
          {palette.tags && palette.tags.length > 0 && (
            <div>
              <span className="text-muted-foreground">Tags:</span>
              <div className="mt-1 flex flex-wrap gap-1">
                {palette.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block rounded-full bg-muted px-2 py-1 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
