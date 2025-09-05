import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CSSColorVariablesObject, Palette } from "@/types/palette";
import { PaletteDetailsSection } from "./palette-details-section";

interface PreviewComponentProps {
  palette?: Palette;
  currentColors?: CSSColorVariablesObject;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
}

export function ColorPreviewCard({ palette }: PreviewComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{palette?.name || "Color Preview"}</CardTitle>
        <CardDescription>
          {palette ? `${palette.colors.length} colors in this palette` : "No palette selected"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Palette Details */}
          {palette && <PaletteDetailsSection palette={palette} />}

          {/* Role-based Color Display */}
          {palette && (
            <>
              {/* Base Colors */}
              <div>
                <h3 className="mb-3 text-lg font-medium">Base Colors</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Primary</p>
                    <div
                      className="h-12 w-full rounded-md shadow-sm border"
                      style={{ 
                        backgroundColor: palette.colors.find(c => c.role === 'primary')?.hex || '#6366f1'
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Secondary</p>
                    <div
                      className="h-12 w-full rounded-md shadow-sm border"
                      style={{ 
                        backgroundColor: palette.colors.find(c => c.role === 'secondary')?.hex || '#64748b'
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Accent</p>
                    <div
                      className="h-12 w-full rounded-md shadow-sm border"
                      style={{
                        backgroundColor: palette.colors.find(c => c.role === 'accent')?.hex || '#f59e0b'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* UI Colors */}
              <div>
                <h3 className="mb-3 text-lg font-medium">UI Colors</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Background</p>
                    <div
                      className="h-12 w-full rounded-md border shadow-sm"
                      style={{ 
                        backgroundColor: palette.colors.find(c => c.role === 'background')?.hex || '#ffffff'
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Card</p>
                    <div
                      className="h-12 w-full rounded-md shadow-sm border"
                      style={{ 
                        backgroundColor: palette.colors.find(c => c.role === 'card')?.hex || '#f8fafc'
                      }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Muted</p>
                    <div
                      className="h-12 w-full rounded-md shadow-sm border"
                      style={{ 
                        backgroundColor: palette.colors.find(c => c.role === 'muted')?.hex || '#f1f5f9'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Text Colors */}
              <div>
                <h3 className="mb-3 text-lg font-medium">Text Colors</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className="rounded-md p-3 border"
                    style={{ 
                      backgroundColor: palette.colors.find(c => c.role === 'background')?.hex || '#ffffff'
                    }}
                  >
                    <p className="mb-2 text-sm font-medium" style={{ 
                        color: palette.colors.find(c => c.role === 'foreground')?.hex || '#000000'
                      }}>On Background
                      
                    </p>
                    <p
                      className="font-medium"
                      style={{ 
                        color: palette.colors.find(c => c.role === 'foreground')?.hex || '#0f172a'
                      }}
                    >
                      Primary Text
                    </p>
                    <p
                      className="text-sm"
                      style={{ 
                        color: palette.colors.find(c => c.role === 'muted-foreground')?.hex || '#64748b'
                      }}
                    >
                      Muted Text
                    </p>
                  </div>
                  <div
                    className="rounded-md p-3 border"
                    style={{ 
                      backgroundColor: palette.colors.find(c => c.role === 'card')?.hex || '#f8fafc'
                    }}
                  >
                    <p className="mb-2 text-sm font-medium" style={{ 
                       color: palette.colors.find(c => c.role === 'card-foreground')?.hex || '#000000'
                      }}>On Card</p>
                    <p
                      className="font-medium"
                      style={{ 
                        color: palette.colors.find(c => c.role === 'card-foreground')?.hex || '#0f172a'
                      }}
                    >
                      Card Text
                    </p>
                    <p
                      className="text-sm"
                      style={{ 
                        color: palette.colors.find(c => c.role === 'muted-foreground')?.hex || '#64748b'
                      }}
                    >
                      Muted Text
                    </p>
                  </div>
                </div>
              </div>

              {/* Button Examples */}
              <div>
                <h3 className="mb-3 text-lg font-medium">Button Examples</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center rounded-md p-3">
                    <p className="mb-2 text-sm font-medium">Primary</p>
                    <div
                      className="flex h-10 w-full items-center justify-center rounded-md font-medium shadow-sm"
                      style={{
                        backgroundColor: palette.colors.find(c => c.role === 'primary')?.hex || '#6366f1',
                        color: palette.colors.find(c => c.role === 'primary-foreground')?.hex || '#ffffff',
                      }}
                    >
                      Button
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md p-3">
                    <p className="mb-2 text-sm font-medium">Secondary</p>
                    <div
                      className="flex h-10 w-full items-center justify-center rounded-md font-medium shadow-sm"
                      style={{
                        backgroundColor: palette.colors.find(c => c.role === 'secondary')?.hex || '#64748b',
                        color: palette.colors.find(c => c.role === 'secondary-foreground')?.hex || '#ffffff',
                      }}
                    >
                      Button
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md p-3">
                    <p className="mb-2 text-sm font-medium">Accent</p>
                    <div
                      className="flex h-10 w-full items-center justify-center rounded-md font-medium shadow-sm"
                      style={{
                        backgroundColor: palette.colors.find(c => c.role === 'accent')?.hex || '#f59e0b',
                        color: palette.colors.find(c => c.role === 'accent-foreground')?.hex || '#ffffff',
                      }}
                    >
                      Button
                    </div>
                  </div>
                </div>
              </div>

              {/* Border Examples */}
              <div>
                <h3 className="mb-3 text-lg font-medium">Border Examples</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="flex flex-col items-center justify-center">
                    <p className="mb-2 text-sm font-medium">Default</p>
                    <div
                      className="h-12 w-full rounded-md border-2 shadow-sm"
                      style={{ 
                        borderColor: palette.colors.find(c => c.role === 'border')?.hex || '#e2e8f0'
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="mb-2 text-sm font-medium">Primary</p>
                    <div
                      className="h-12 w-full rounded-md border-2 shadow-sm"
                      style={{ 
                        borderColor: palette.colors.find(c => c.role === 'primary')?.hex || '#6366f1'
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="mb-2 text-sm font-medium">Secondary</p>
                    <div
                      className="h-12 w-full rounded-md border-2 shadow-sm"
                      style={{ 
                        borderColor: palette.colors.find(c => c.role === 'secondary')?.hex || '#64748b'
                      }}
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <p className="mb-2 text-sm font-medium">Muted</p>
                    <div
                      className="h-12 w-full rounded-md border-2 shadow-sm"
                      style={{ 
                        borderColor: palette.colors.find(c => c.role === 'muted')?.hex || '#f1f5f9'
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}


          {!palette && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No palette selected</p>
              <p className="text-sm text-muted-foreground mt-1">
                Select a palette to view its colors and information
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
