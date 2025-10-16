import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSSColorVariablesObject, Palette } from "@/types/palette";

interface PreviewComponentProps {
  palette?: Palette;
  currentColors?: CSSColorVariablesObject;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
}

export function MobileUIPreviewCard({
  currentColors, // eslint-disable-line @typescript-eslint/no-unused-vars -- used indirectly through CSS variables
}: PreviewComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mobile Preview</CardTitle>
        <CardDescription>
          See how your colors look in a mobile UI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="preview-container preview-bg-background overflow-hidden rounded-lg border shadow-md">
          {/* Mobile Preview Header - With hamburger menu */}
          <header className="sticky top-0 z-10 flex items-center justify-between rounded-md border-b border-[var(--preview-border)] bg-[var(--preview-card)] p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <div className="preview-bg-primary flex h-8 w-8 items-center justify-center rounded-md">
                <span className="text-sm font-bold dark:text-[var(--preview-card-foreground)]">
                  CP
                </span>
              </div>
            </div>
            {/* Hamburger Menu Button */}
            <button className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--preview-card-foreground)]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
          </header>

          {/* Hero Section - Using preview-background and preview-foreground */}
          <section className="px-4 py-12 text-center">
            <div className="mx-auto space-y-6">
              <div className="space-y-2">
                <span className="inline-block rounded-full bg-[var(--preview-secondary)] px-3 py-1 text-xs font-medium text-[var(--preview-primary-foreground)]">
                  New Features
                </span>
                <h1 className="text-3xl font-bold tracking-tight dark:text-[var(--preview-primary-foreground)]">
                  Create Beautiful Color Palettes
                </h1>
              </div>
              <p className="text-sm text-[var(--preview-muted-foreground)]">
                Design, save, and share color schemes for your next project with
                our intuitive tools.
              </p>
              <div className="flex flex-col gap-3">
                <Button className="h-10 w-full rounded-md bg-[var(--preview-primary)] px-4 py-2 font-medium text-[var(--preview-primary-foreground)] shadow-sm transition-all hover:opacity-90">
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-md border border-[var(--preview-border)] bg-[var(--preview-background)] px-4 py-2 font-medium text-[var(--preview-foreground)] transition-all hover:opacity-90"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </section>

          {/* Features Section with Tabs - Using various preview classes */}
          <section className="my-6 rounded-lg bg-[var(--preview-accent)] px-4 py-12">
            <div className="mx-auto">
              <div className="mb-8 text-center">
                <span className="mb-2 inline-block rounded-full bg-[var(--preview-primary)] px-3 py-1 text-xs font-medium text-[var(--preview-primary-foreground)]">
                  What We Offer
                </span>
                <h2 className="text-2xl font-bold dark:text-[var(--preview-primary-foreground)]">
                  Key Features
                </h2>
              </div>

              <Tabs defaultValue="create" className="w-full">
                <TabsList className="mb-6 grid w-full grid-cols-3 bg-[var(--preview-muted)] text-[var(--preview-muted-foreground)]">
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="organize">Organize</TabsTrigger>
                  <TabsTrigger value="export">Export</TabsTrigger>
                </TabsList>

                <TabsContent value="create" className="space-y-4">
                  <Card className="bg-[var(--preview-card)]">
                    <CardHeader>
                      <CardTitle className="text-[var(--preview-card-foreground)]">
                        Color Generation
                      </CardTitle>
                      <CardDescription className="text-[var(--preview-muted-foreground)]">
                        Create harmonious color schemes instantly
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="h-10 rounded bg-[var(--preview-primary)]"></div>
                        <div className="h-10 rounded bg-[var(--preview-secondary)]"></div>
                        <div className="h-10 rounded bg-[var(--preview-accent-foreground)]"></div>
                        <div className="h-10 rounded bg-[var(--preview-muted)]"></div>
                        <div className="h-10 rounded bg-[var(--preview-foreground)]"></div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="organize" className="space-y-4">
                  <Card className="bg-[var(--preview-card)]">
                    <CardHeader>
                      <CardTitle className="text-[var(--preview-card-foreground)]">
                        Save & Organize
                      </CardTitle>
                      <CardDescription className="text-[var(--preview-muted-foreground)]">
                        Keep your palettes organized
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-[var(--preview-primary)] text-[var(--preview-primary-foreground)]">
                          Branding
                        </Badge>
                        <Badge className="bg-[var(--preview-secondary)] text-[var(--preview-secondary-foreground)]">
                          Web
                        </Badge>
                        <Badge className="bg-[var(--preview-accent-foreground)] text-[var(--preview-foreground)]">
                          Mobile
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="export" className="space-y-4">
                  <Card className="bg-[var(--preview-card)]">
                    <CardHeader>
                      <CardTitle className="text-[var(--preview-card-foreground)]">
                        Export Options
                      </CardTitle>
                      <CardDescription className="text-[var(--preview-muted-foreground)]">
                        Export in multiple formats
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded border border-[var(--preview-border)] p-3">
                        <p className="font-mono text-xs text-[var(--preview-card-foreground)]">
                          :root{" "}
                        </p>
                        <p className="font-mono text-xs text-[var(--preview-card-foreground)]">
                          {" "}
                          --primary: #3b82f6;
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </section>

          {/* Footer - Using column layout for mobile */}
          <footer className="mt-8 rounded-md border-t border-[var(--preview-border)] bg-[var(--preview-card)] p-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--preview-primary)]">
                  <span className="text-sm font-bold text-[var(--preview-primary-foreground)]">
                    CP
                  </span>
                </div>
                <span className="font-bold text-[var(--preview-card-foreground)]">
                  Color Palette Manager
                </span>
              </div>

              <p className="text-sm text-[var(--preview-muted-foreground)]">
                2025 Color Palette Manager. All rights reserved.
              </p>

              <div className="flex w-full flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[var(--preview-card-foreground)] hover:opacity-80"
                >
                  Privacy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[var(--preview-card-foreground)] hover:opacity-80"
                >
                  Terms
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-[var(--preview-card-foreground)] hover:opacity-80"
                >
                  Contact
                </Button>
              </div>
            </div>
          </footer>
        </div>
      </CardContent>
    </Card>
  );
}
