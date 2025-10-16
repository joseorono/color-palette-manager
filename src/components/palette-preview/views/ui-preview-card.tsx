import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CSSColorVariablesObject, Palette } from "@/types/palette";

interface PreviewComponentProps {
  palette?: Palette;
  currentColors?: CSSColorVariablesObject;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
}

export function UIPreviewCard({ currentColors }: PreviewComponentProps) {
  return (
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
              <button className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--preview-muted)]" style={{ color: "var(--preview-card-foreground)" }}>
                Features
              </button>
              <button className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--preview-muted)]" style={{ color: "var(--preview-card-foreground)" }}>
                Pricing
              </button>
              <button className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--preview-muted)]" style={{ color: "var(--preview-card-foreground)" }}>
                About
              </button>
              <button
                className="rounded-md px-4 py-2 text-sm font-medium transition-colors hover:opacity-90"
                style={{
                  backgroundColor: "var(--preview-secondary)",
                  color: "var(--preview-primary-foreground)",
                }}
              >
                Sign Up
              </button>
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
                <button
                  className="h-10 min-w-[120px] rounded-md px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "var(--preview-primary)",
                    color: "var(--preview-primary-foreground)",
                  }}
                >
                  Get Started
                </button>
                <button
                  className="h-10 min-w-[120px] rounded-md border px-4 py-2 font-medium transition-all hover:bg-[var(--preview-primary)] hover:text-[var(--preview-primary-foreground)]"
                  style={{
                    borderColor: "var(--preview-border)",
                    color: "var(--preview-card-foreground)",
                  }}
                >
                  Learn More
                </button>
              </div>
            </div>
          </section>

          {/* Features Section with Tabs - Using various preview classes */}
          <section
            className="my-8 rounded-lg px-6 py-16"
            style={{ backgroundColor: "var(--preview-secondary)" }}
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

              <div className="w-full">
                <div
                  className="mb-8 grid w-full grid-cols-3 gap-2 rounded-md p-1"
                  style={{ backgroundColor: "var(--preview-muted)" }}
                >
                  <button className="rounded-md px-3 py-2 text-sm font-medium transition-colors" style={{ backgroundColor: "var(--preview-card)", color: "var(--preview-card-foreground)" }}>Create</button>
                  <button className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--preview-card)]" style={{ color: "var(--preview-muted-foreground)" }}>Organize</button>
                  <button className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--preview-card)]" style={{ color: "var(--preview-muted-foreground)" }}>Export</button>
                </div>

                <div className="space-y-4">
                  <div
                    className="rounded-lg border shadow-sm"
                    style={{ backgroundColor: "var(--preview-card)", borderColor: "var(--preview-border)" }}
                  >
                    <div className="p-6">
                      <h3
                        className="text-2xl font-semibold leading-none tracking-tight"
                        style={{
                          color: "var(--preview-card-foreground)",
                        }}
                      >
                        Color Generation
                      </h3>
                      <p
                        className="mt-2 text-sm"
                        style={{
                          color: "var(--preview-muted-foreground)",
                        }}
                      >
                        Create harmonious color schemes instantly
                      </p>
                    </div>
                    <div className="px-6 pb-6">
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
                    </div>
                    <div className="flex items-center p-6 pt-0">
                      <span
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors"
                        style={{
                          borderColor: "var(--preview-secondary)",
                          color: "var(--preview-foreground)",
                        }}
                      >
                        AI-Powered
                      </span>
                    </div>
                  </div>
                </div>
              </div>
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
                    color: "var(--preview-accent-foreground)",
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
              <div className="rounded-lg border shadow-sm" style={{ backgroundColor: "var(--preview-card)", borderColor: "var(--preview-border)" }}>
                <div className="p-6">
                  <h3
                    className="text-2xl font-semibold leading-none tracking-tight"
                    style={{ color: "var(--preview-card-foreground)" }}
                  >
                    Settings
                  </h3>
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--preview-muted-foreground)" }}
                  >
                    Manage your preferences
                  </p>
                </div>
                <div className="space-y-6 px-6 pb-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="dark-mode"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        style={{
                          color: "var(--preview-card-foreground)",
                        }}
                      >
                        Dark Mode
                      </label>
                      <button
                        id="dark-mode"
                        type="button"
                        role="switch"
                        aria-checked="false"
                        className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ backgroundColor: "var(--preview-muted)" }}
                      >
                        <span className="pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform translate-x-0" style={{ backgroundColor: "var(--preview-card)" }}></span>
                      </button>
                    </div>
                    <div className="h-px w-full" style={{ backgroundColor: "var(--preview-border)" }}></div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="auto-save"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        style={{
                          color: "var(--preview-card-foreground)",
                        }}
                      >
                        Auto Save
                      </label>
                      <button
                        id="auto-save"
                        type="button"
                        role="switch"
                        aria-checked="true"
                        className="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ backgroundColor: "var(--preview-primary)" }}
                      >
                        <span className="pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform translate-x-5" style={{ backgroundColor: "var(--preview-card)" }}></span>
                      </button>
                    </div>
                    <div className="h-px w-full" style={{ backgroundColor: "var(--preview-border)" }}></div>
                    <div className="space-y-2">
                      <label
                        htmlFor="api-key"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        style={{
                          color: "var(--preview-card-foreground)",
                        }}
                      >
                        API Key
                      </label>
                      <input
                        id="api-key"
                        type="text"
                        placeholder="Enter your API key"
                        className="flex h-10 w-full rounded-md border px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                          borderColor: "var(--preview-border)",
                          color: "var(--preview-card-foreground)",
                          backgroundColor: "transparent",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center p-6 pt-0">
                  <button className="h-10 min-w-[120px] rounded-md px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90" style={{ backgroundColor: "var(--preview-primary)", color: "var(--preview-primary-foreground)" }}>
                    Save Changes
                  </button>
                </div>
              </div>
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
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex h-10 w-full rounded-md border-2 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                  style={{
                    borderColor: "var(--preview-primary)",
                    color: "var(--preview-card-foreground)",
                    backgroundColor: "var(--preview-card)",
                  }}
                />
                <button
                  className="min-w-[100px] rounded-md px-4 py-2 font-medium shadow-sm transition-all hover:opacity-90"
                  style={{
                    backgroundColor: "var(--preview-primary)",
                    color: "var(--preview-primary-foreground)",
                  }}
                >
                  Subscribe
                </button>
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
                <button
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--preview-muted)]"
                  style={{ color: "var(--preview-card-foreground)" }}
                >
                  Privacy
                </button>
                <button
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--preview-muted)]"
                  style={{ color: "var(--preview-card-foreground)" }}
                >
                  Terms
                </button>
                <button
                  className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--preview-muted)]"
                  style={{ color: "var(--preview-card-foreground)" }}
                >
                  Contact
                </button>
              </div>
            </div>
          </footer>
        </div>
      </CardContent>
    </Card>
  );
}
