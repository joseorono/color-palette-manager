import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PreviewComponentProps } from "./types";

export function ColorPreviewCard({ currentColors }: PreviewComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Color Preview</CardTitle>
        <CardDescription>
          Displaying colors from provided palette
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Base Colors */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Base Colors</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="mb-2 text-sm font-medium">Primary</p>
                <div
                  className="h-12 w-full rounded-md shadow-sm"
                  style={{ backgroundColor: "var(--preview-primary)" }}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Secondary</p>
                <div
                  className="h-12 w-full rounded-md shadow-sm"
                  style={{ backgroundColor: "var(--preview-secondary)" }}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Accent</p>
                <div
                  className="h-12 w-full rounded-md shadow-sm"
                  style={{
                    backgroundColor: "var(--preview-accent-foreground)",
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
                  style={{ backgroundColor: "var(--preview-background)" }}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Card</p>
                <div
                  className="h-12 w-full rounded-md shadow-sm"
                  style={{ backgroundColor: "var(--preview-card)" }}
                />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">Muted</p>
                <div
                  className="h-12 w-full rounded-md shadow-sm"
                  style={{ backgroundColor: "var(--preview-muted)" }}
                />
              </div>
            </div>
          </div>

          {/* Text Colors */}
          <div>
            <h3 className="mb-3 text-lg font-medium">Text Colors</h3>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="rounded-md p-3"
                style={{ backgroundColor: "var(--preview-background)" }}
              >
                <p className="mb-2 text-sm font-medium">On Background</p>
                <p
                  className="font-medium"
                  style={{ color: "var(--preview-foreground)" }}
                >
                  Primary Text
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--preview-muted-foreground)" }}
                >
                  Muted Text
                </p>
              </div>
              <div
                className="rounded-md p-3"
                style={{ backgroundColor: "var(--preview-card)" }}
              >
                <p className="mb-2 text-sm font-medium">On Card</p>
                <p
                  className="font-medium"
                  style={{ color: "var(--preview-card-foreground)" }}
                >
                  Card Text
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--preview-muted-foreground)" }}
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
                    backgroundColor: "var(--preview-primary)",
                    color: "var(--preview-primary-foreground)",
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
                    backgroundColor: "var(--preview-secondary)",
                    color: "var(--preview-secondary-foreground)",
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
                    backgroundColor: "var(--preview-accent-foreground)",
                    color: "var(--preview-foreground)",
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
                  style={{ borderColor: "var(--preview-border)" }}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="mb-2 text-sm font-medium">Primary</p>
                <div
                  className="h-12 w-full rounded-md border-2 shadow-sm"
                  style={{ borderColor: "var(--preview-primary)" }}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="mb-2 text-sm font-medium">Secondary</p>
                <div
                  className="h-12 w-full rounded-md border-2 shadow-sm"
                  style={{ borderColor: "var(--preview-secondary)" }}
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="mb-2 text-sm font-medium">Muted</p>
                <div
                  className="h-12 w-full rounded-md border-2 shadow-sm"
                  style={{ borderColor: "var(--preview-muted)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
