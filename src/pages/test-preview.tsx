import { useEffect, useState } from "react";
import { CSSColorVariablesObject, Palette } from "@/types/palette";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { injectColorVariablesObjectToCSS } from "@/lib/preview-utils";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

/**
 * TestPreview Component
 *
 * A component that displays a preview of UI elements with the provided colors.
 *
 * @component
 *
 * @param {Object} props - Component props
 * @param {CSSColorVariablesObject} props.initialColors - Initial colors to use for the preview
 * @param {Function} [props.onColorsChange] - Callback function that receives the colors
 *   whenever they change. This allows parent components to react to color changes.
 *
 * @example
 * // Basic usage with required colors
 * <TestPreview initialColors={myColors} />
 *
 * @example
 * // With colors and change handler
 * <TestPreview
 *   initialColors={{ primary: '#ff0000', secondary: '#00ff00', ... }}
 *   onColorsChange={(colors) => console.log('Colors changed:', colors)}
 * />
 */
interface TestPreviewProps {
  initialColors?: CSSColorVariablesObject;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
}

export function TestPreview({
  initialColors,
  onColorsChange,
}: TestPreviewProps) {
  const [selectedPaletteId, setSelectedPaletteId] = useState<string>("");
  const [currentColors, setCurrentColors] = useState<
    CSSColorVariablesObject | undefined
  >(initialColors);

  // Fetch palettes from the database
  const palettes = useLiveQuery(() => db.palettes.toArray(), []);

  // Apply the colors to CSS variables
  useEffect(() => {
    if (currentColors) {
      // Inject colors to CSS variables
      injectColorVariablesObjectToCSS(currentColors);

      // Notify parent component if needed
      if (onColorsChange) {
        onColorsChange(currentColors);
      }
    }
  }, [currentColors, onColorsChange]);

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

      setCurrentColors(colorVars);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row">
        <h1 className="mb-4 text-3xl font-bold md:mb-0">
          Color Scheme Preview
        </h1>

        {/* Palette Selection Menu */}
        <div className="w-full md:w-64">
          <Select value={selectedPaletteId} onValueChange={handlePaletteChange}>
            <SelectTrigger className="h-10 w-full rounded-md bg-primary px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90">
              <span className="mr-2">🎨</span>
              <SelectValue placeholder="Select a palette" />
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
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
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
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your colors look in a real UI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="preview-container preview-bg-background overflow-hidden rounded-lg border shadow-md">
                {/* Preview Header - Using preview-background and preview-foreground */}
                <header className="preview-bg-card sticky top-0 z-10 flex items-center justify-between rounded-md p-4 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="preview-bg-primary flex h-8 w-8 items-center justify-center rounded-md">
                      <span
                        className="text-sm font-bold"
                        style={{ color: "var(--preview-primary-foreground)" }}
                      >
                        CP
                      </span>
                    </div>
                    <span
                      className="font-bold"
                      style={{ color: "var(--preview-card-foreground)" }}
                    >
                      Color Palette Manager
                    </span>
                  </div>
                  <nav
                    className="hidden items-center gap-4 md:flex"
                    style={{ color: "var(--preview-card)" }}
                  >
                    <Button variant="ghost" className="hover:preview-hover">
                      Features
                    </Button>
                    <Button variant="ghost" className="hover:preview-hover">
                      Pricing
                    </Button>
                    <Button variant="ghost" className="hover:preview-hover">
                      About
                    </Button>
                    <Button
                      className="rounded-md px-4 py-2 text-sm font-medium transition-colors"
                      style={{
                        backgroundColor: "var(--preview-secondary)",
                        color: "var(--preview-primary-foreground)",
                      }}
                    >
                      Sign Up
                    </Button>
                  </nav>
                </header>

                {/* Hero Section - Using preview-background and preview-foreground */}
                <section className="px-4 py-16 text-center">
                  <div className="mx-auto max-w-3xl space-y-8">
                    <div className="space-y-2">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          color: "var(--preview-primary-foreground)",
                          backgroundColor: "var(--preview-secondary)",
                        }}
                      >
                        New Features
                      </span>
                      <h1
                        className="text-4xl font-bold tracking-tight sm:text-5xl"
                        style={{ color: "var(--preview-foreground)" }}
                      >
                        Create Beautiful Color Palettes
                      </h1>
                    </div>
                    <p
                      className="text-lg"
                      style={{ color: "var(--preview-muted)" }}
                    >
                      Design, save, and share color schemes for your next
                      project with our intuitive tools.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                      <Button
                        className="h-10 min-w-[120px] rounded-md px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90"
                        style={{
                          backgroundColor: "var(--preview-primary)",
                          color: "var(--preview-primary-foreground)",
                        }}
                      >
                        Get Started
                      </Button>
                      <Button
                        variant="outline"
                        className="h-10 min-w-[120px] rounded-md border px-4 py-2 font-medium transition-all hover:border-0 hover:bg-[var(--preview-primary)]"
                        style={{
                          borderColor: "var(--preview-border)",
                          color: "var(--preview-card)",
                        }}
                      >
                        Learn More
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Features Section with Tabs - Using various preview classes */}
                <section
                  className="my-8 rounded-lg px-6 py-16"
                  style={{ backgroundColor: "var(--preview-accent)" }}
                >
                  <div className="mx-auto max-w-5xl">
                    <div className="mb-12 text-center">
                      <span
                        className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "var(--preview-primary)",
                          color: "var(--preview-primary-foreground)",
                        }}
                      >
                        What We Offer
                      </span>
                      <h2
                        className="text-3xl font-bold"
                        style={{ color: "var(--preview-card)" }}
                      >
                        Key Features
                      </h2>
                    </div>

                    <Tabs defaultValue="create" className="w-full">
                      <TabsList
                        className="mb-8 grid w-full grid-cols-3"
                        style={{ color: "var(--preview-card)" }}
                      >
                        <TabsTrigger value="create">Create</TabsTrigger>
                        <TabsTrigger value="organize">Organize</TabsTrigger>
                        <TabsTrigger value="export">Export</TabsTrigger>
                      </TabsList>

                      <TabsContent value="create" className="space-y-4">
                        <Card
                          style={{ backgroundColor: "var(--preview-card)" }}
                        >
                          <CardHeader>
                            <CardTitle
                              style={{
                                color: "var(--preview-card-foreground)",
                              }}
                            >
                              Color Generation
                            </CardTitle>
                            <CardDescription
                              style={{
                                color: "var(--preview-muted-foreground)",
                              }}
                            >
                              Create harmonious color schemes instantly
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-5 gap-2">
                              <div
                                className="h-12 rounded"
                                style={{
                                  backgroundColor: "var(--preview-primary)",
                                }}
                              ></div>
                              <div
                                className="h-12 rounded"
                                style={{
                                  backgroundColor: "var(--preview-secondary)",
                                }}
                              ></div>
                              <div
                                className="h-12 rounded"
                                style={{
                                  backgroundColor:
                                    "var(--preview-accent-foreground)",
                                }}
                              ></div>
                              <div
                                className="h-12 rounded"
                                style={{
                                  backgroundColor: "var(--preview-muted)",
                                }}
                              ></div>
                              <div
                                className="h-12 rounded"
                                style={{
                                  backgroundColor: "var(--preview-foreground)",
                                }}
                              ></div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Badge
                              variant="outline"
                              style={{
                                borderColor: "var(--preview-secondary)",
                                color: "var(--preview-foreground)",
                              }}
                            >
                              AI-Powered
                            </Badge>
                          </CardFooter>
                        </Card>
                      </TabsContent>

                      <TabsContent value="organize" className="space-y-4">
                        <Card
                          style={{ backgroundColor: "var(--preview-card)" }}
                        >
                          <CardHeader>
                            <CardTitle
                              style={{
                                color: "var(--preview-card-foreground)",
                              }}
                            >
                              Save & Organize
                            </CardTitle>
                            <CardDescription
                              style={{
                                color: "var(--preview-muted-foreground)",
                              }}
                            >
                              Keep your palettes organized with tags and
                              collections
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                style={{
                                  backgroundColor: "var(--preview-primary)",
                                  color: "var(--preview-primary-foreground)",
                                }}
                              >
                                Branding
                              </Badge>
                              <Badge
                                style={{
                                  backgroundColor: "var(--preview-secondary)",
                                  color: "var(--preview-secondary-foreground)",
                                }}
                              >
                                Web
                              </Badge>
                              <Badge
                                style={{
                                  backgroundColor:
                                    "var(--preview-accent-foreground)",
                                  color: "var(--preview-foreground)",
                                }}
                              >
                                Mobile
                              </Badge>
                              <Badge
                                style={{
                                  backgroundColor: "var(--preview-muted)",
                                  color: "var(--preview-muted-foreground)",
                                }}
                              >
                                UI/UX
                              </Badge>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Badge
                              style={{
                                backgroundColor: "var(--preview-primary)",
                                color: "var(--preview-primary-foreground)",
                              }}
                            >
                              Cloud Sync
                            </Badge>
                          </CardFooter>
                        </Card>
                      </TabsContent>

                      <TabsContent value="export" className="space-y-4">
                        <Card
                          style={{ backgroundColor: "var(--preview-card)" }}
                        >
                          <CardHeader>
                            <CardTitle
                              style={{
                                color: "var(--preview-card-foreground)",
                              }}
                            >
                              Export Options
                            </CardTitle>
                            <CardDescription
                              style={{
                                color: "var(--preview-muted-foreground)",
                              }}
                            >
                              Export your palettes in multiple formats
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                              <div
                                className="rounded border p-3"
                                style={{ borderColor: "var(--preview-border)" }}
                              >
                                <p
                                  className="font-mono text-sm"
                                  style={{
                                    color: "var(--preview-card-foreground)",
                                  }}
                                >
                                  :root{" "}
                                </p>
                                <p
                                  className="font-mono text-sm"
                                  style={{
                                    color: "var(--preview-card-foreground)",
                                  }}
                                >
                                  {" "}
                                  --primary: #3b82f6;
                                </p>
                                <p
                                  className="font-mono text-sm"
                                  style={{
                                    color: "var(--preview-card-foreground)",
                                  }}
                                >
                                  {" "}
                                  --secondary: #10b981;
                                </p>
                                <p
                                  className="font-mono text-sm"
                                  style={{
                                    color: "var(--preview-card-foreground)",
                                  }}
                                ></p>
                              </div>
                              <div
                                className="rounded border p-3"
                                style={{ borderColor: "var(--preview-border)" }}
                              >
                                <p
                                  className="font-mono text-sm"
                                  style={{
                                    color: "var(--preview-card-foreground)",
                                  }}
                                >
                                  $primary: #3b82f6;
                                </p>
                                <p
                                  className="font-mono text-sm"
                                  style={{
                                    color: "var(--preview-card-foreground)",
                                  }}
                                >
                                  $secondary: #10b981;
                                </p>
                                <p
                                  className="font-mono text-sm"
                                  style={{
                                    color: "var(--preview-card-foreground)",
                                  }}
                                >
                                  $accent: #f3f4f6;
                                </p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Badge
                              variant="secondary"
                              style={{
                                backgroundColor: "var(--preview-secondary)",
                                color: "var(--preview-secondary-foreground)",
                              }}
                            >
                              Developer Tools
                            </Badge>
                          </CardFooter>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                </section>

                {/* Settings Section - Using preview classes */}
                <section className="px-4 py-16">
                  <div className="mx-auto max-w-3xl">
                    <div className="mb-10 text-center">
                      <span
                        className="mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "var(--preview-accent)",
                          color: "var(--preview-accent)",
                        }}
                      >
                        Personalization
                      </span>
                      <h2
                        className="text-3xl font-bold"
                        style={{ color: "var(--preview-foreground)" }}
                      >
                        Customize Your Experience
                      </h2>
                    </div>
                    <Card style={{ backgroundColor: "var(--preview-card)" }}>
                      <CardHeader>
                        <CardTitle
                          style={{ color: "var(--preview-card-foreground)" }}
                        >
                          Settings
                        </CardTitle>
                        <CardDescription
                          style={{ color: "var(--preview-muted-foreground)" }}
                        >
                          Manage your preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="dark-mode"
                              style={{
                                color: "var(--preview-card-foreground)",
                              }}
                            >
                              Dark Mode
                            </Label>
                            <Switch id="dark-mode" />
                          </div>
                          <Separator
                            style={{ backgroundColor: "var(--preview-border)" }}
                          />
                          <div className="flex items-center justify-between">
                            <Label
                              htmlFor="auto-save"
                              style={{
                                color: "var(--preview-card-foreground)",
                              }}
                            >
                              Auto Save
                            </Label>
                            <Switch id="auto-save" defaultChecked />
                          </div>
                          <Separator
                            style={{ backgroundColor: "var(--preview-border)" }}
                          />
                          <div className="space-y-2">
                            <Label
                              htmlFor="api-key"
                              style={{
                                color: "var(--preview-card-foreground)",
                              }}
                            >
                              API Key
                            </Label>
                            <Input
                              id="api-key"
                              placeholder="Enter your API key"
                              style={{
                                borderColor: "var(--preview-border)",
                                color: "var(--preview-card-foreground)",
                              }}
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="preview-btn-primary h-10 min-w-[120px] rounded-md px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90">
                          Save Changes
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </section>

                {/* Newsletter Section - Using preview classes */}
                <section className="preview-bg-muted my-12 rounded-lg px-6 py-16">
                  <div className="mx-auto max-w-2xl space-y-6 text-center">
                    <div>
                      <span className="preview-btn-secondary mb-2 inline-block rounded-full px-3 py-1 text-xs font-medium">
                        Newsletter
                      </span>
                      <h2 className="preview-text-muted-foreground text-2xl font-bold">
                        Stay Updated
                      </h2>
                    </div>
                    <p className="preview-text-muted-foreground">
                      Subscribe to our newsletter for the latest color trends
                      and features
                    </p>
                    <div className="mx-auto flex max-w-md gap-2">
                      <Input
                        placeholder="Enter your email"
                        className="border-2 shadow-sm focus:ring-1 focus:ring-primary"
                        style={{
                          borderColor: "var(--preview-primary) !important",
                        }}
                      />
                      <Button
                        className="min-w-[100px] rounded-md px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90"
                        style={{
                          backgroundColor: "var(--preview-primary)",
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </section>

                {/* Footer - Using preview classes */}
                <footer className="preview-bg-card mt-16 rounded-md border-t p-8">
                  <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                    <div className="flex items-center gap-2">
                      <div className="preview-bg-primary flex h-8 w-8 items-center justify-center rounded-md">
                        <span className="preview-text-primary-foreground text-sm font-bold">
                          CP
                        </span>
                      </div>
                      <span className="preview-text-card-foreground font-bold">
                        Color Palette Manager
                      </span>
                    </div>
                    <p className="preview-text-muted-foreground mx-auto max-w-lg">
                      2025 Color Palette Manager. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="preview-text-card-foreground hover:preview-bg-muted"
                      >
                        Privacy
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="preview-text-card-foreground hover:preview-bg-muted"
                      >
                        Terms
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="preview-text-card-foreground hover:preview-bg-muted"
                      >
                        Contact
                      </Button>
                    </div>
                  </div>
                </footer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
