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
import { PreviewComponentProps } from "./types";

export function MobileUIPreviewCard({ currentColors }: PreviewComponentProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // currentColors is used indirectly through CSS variables injected at the document root level
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
            </div>
            {/* Hamburger Menu Button */}
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md"
              style={{ color: "var(--preview-card-foreground)" }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: "var(--preview-foreground)" }}
                >
                  Create Beautiful Color Palettes
                </h1>
              </div>
              <p
                className="text-sm"
                style={{ color: "var(--preview-muted)" }}
              >
                Design, save, and share color schemes for your next
                project with our intuitive tools.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  className="h-10 w-full rounded-md px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "var(--preview-primary)",
                    color: "var(--preview-primary-foreground)",
                  }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outline"
                  className="h-10 w-full rounded-md border px-4 py-2 font-medium transition-all hover:border-0 hover:bg-[var(--preview-primary)]"
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
            className="my-6 rounded-lg px-4 py-12"
            style={{ backgroundColor: "var(--preview-accent)" }}
          >
            <div className="mx-auto">
              <div className="mb-8 text-center">
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
                  className="text-2xl font-bold"
                  style={{ color: "var(--preview-card)" }}
                >
                  Key Features
                </h2>
              </div>

              <Tabs defaultValue="create" className="w-full">
                <TabsList
                  className="mb-6 grid w-full grid-cols-3"
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
                          className="h-10 rounded"
                          style={{
                            backgroundColor: "var(--preview-primary)",
                          }}
                        ></div>
                        <div
                          className="h-10 rounded"
                          style={{
                            backgroundColor: "var(--preview-secondary)",
                          }}
                        ></div>
                        <div
                          className="h-10 rounded"
                          style={{
                            backgroundColor:
                              "var(--preview-accent-foreground)",
                          }}
                        ></div>
                        <div
                          className="h-10 rounded"
                          style={{
                            backgroundColor: "var(--preview-muted)",
                          }}
                        ></div>
                        <div
                          className="h-10 rounded"
                          style={{
                            backgroundColor: "var(--preview-foreground)",
                          }}
                        ></div>
                      </div>
                    </CardContent>
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
                        Keep your palettes organized
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
                      </div>
                    </CardContent>
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
                        Export in multiple formats
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        className="rounded border p-3"
                        style={{ borderColor: "var(--preview-border)" }}
                      >
                        <p
                          className="font-mono text-xs"
                          style={{
                            color: "var(--preview-card-foreground)",
                          }}
                        >
                          :root{" "}
                        </p>
                        <p
                          className="font-mono text-xs"
                          style={{
                            color: "var(--preview-card-foreground)",
                          }}
                        >
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
          <footer className="preview-bg-card mt-8 rounded-md border-t p-6">
            <div className="flex flex-col items-center gap-4 text-center">
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
              
              <p className="preview-text-muted-foreground text-sm">
                2025 Color Palette Manager. All rights reserved.
              </p>
              
              <div className="flex flex-col gap-2 w-full">
                <Button
                  variant="ghost"
                  size="sm"
                  className="preview-text-card-foreground hover:preview-bg-muted w-full"
                >
                  Privacy
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="preview-text-card-foreground hover:preview-bg-muted w-full"
                >
                  Terms
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="preview-text-card-foreground hover:preview-bg-muted w-full"
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
