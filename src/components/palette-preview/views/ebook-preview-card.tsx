import { CSSColorVariablesObject } from "@/types/palette";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EbookPreviewCardProps {
  /**
   * The current colors to use for the preview
   */
  currentColors?: CSSColorVariablesObject;
}

/**
 * EbookPreviewCard component that displays an e-book UI with the provided colors
 */
export function EbookPreviewCard({ currentColors }: EbookPreviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>E-Book Preview</CardTitle>
        <CardDescription>
          See how your colors look in an e-book interface
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="preview-container overflow-hidden rounded-lg border shadow-md">
          {/* E-book Reader Interface */}
          <div 
            className="flex h-[600px] flex-col"
            style={{ backgroundColor: "var(--preview-background)" }}
          >
            {/* E-book Header */}
            <header 
              className="flex items-center justify-between border-b p-4"
              style={{ 
                backgroundColor: "var(--preview-card)",
                borderColor: "var(--preview-border)"
              }}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ 
                    backgroundColor: "var(--preview-primary)",
                    color: "var(--preview-primary-foreground)"
                  }}
                >
                  <span className="text-sm font-bold">EB</span>
                </div>
                <span 
                  className="font-medium"
                  style={{ color: "var(--preview-card-foreground)" }}
                >
                  E-Book Reader
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  className="rounded-full p-2 transition-colors hover:opacity-80"
                  style={{ color: "var(--preview-muted-foreground)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20v-6m0 0V4m0 10h6m-6 0H6"/></svg>
                </button>
                <button 
                  className="rounded-full p-2 transition-colors hover:opacity-80"
                  style={{ color: "var(--preview-muted-foreground)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </button>
                <button 
                  className="rounded-full p-2 transition-colors hover:opacity-80"
                  style={{ color: "var(--preview-muted-foreground)" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
                </button>
              </div>
            </header>

            {/* E-book Content */}
            <div className="flex flex-1">
              {/* Sidebar */}
              <div 
                className="w-16 border-r p-2"
                style={{ 
                  backgroundColor: "var(--preview-card)",
                  borderColor: "var(--preview-border)"
                }}
              >
                <div className="flex flex-col items-center gap-6 pt-4">
                  <button 
                    className="rounded-full p-2 transition-colors hover:opacity-80"
                    style={{ 
                      backgroundColor: "var(--preview-primary)",
                      color: "var(--preview-primary-foreground)"
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                  </button>
                  <button 
                    className="rounded-full p-2 transition-colors hover:opacity-80"
                    style={{ color: "var(--preview-muted-foreground)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  </button>
                  <button 
                    className="rounded-full p-2 transition-colors hover:opacity-80"
                    style={{ color: "var(--preview-muted-foreground)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </button>
                  <button 
                    className="rounded-full p-2 transition-colors hover:opacity-80"
                    style={{ color: "var(--preview-muted-foreground)" }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div 
                className="flex-1 overflow-y-auto p-8"
                style={{ backgroundColor: "var(--preview-background)" }}
              >
                <div className="mx-auto max-w-2xl">
                  <h1 
                    className="mb-6 text-center text-3xl font-bold"
                    style={{ color: "var(--preview-foreground)" }}
                  >
                    The Art of Color Theory
                  </h1>
                  
                  <div 
                    className="mb-8 rounded-lg p-4"
                    style={{ 
                      backgroundColor: "var(--preview-accent)",
                      color: "var(--preview-accent-foreground)"
                    }}
                  >
                    <p className="italic">
                      "Color is a power which directly influences the soul." — Wassily Kandinsky
                    </p>
                  </div>

                  <p 
                    className="mb-4 leading-relaxed"
                    style={{ color: "var(--preview-foreground)" }}
                  >
                    Chapter 1: Understanding Color Harmonies
                  </p>

                  <p 
                    className="mb-4 leading-relaxed"
                    style={{ color: "var(--preview-foreground)" }}
                  >
                    Color harmony refers to the theory of combining colors in a way that is harmonious to the eye. There are several classic color schemes that are considered harmonious, including complementary, analogous, triadic, and tetradic.
                  </p>

                  <h2 
                    className="mb-3 mt-6 text-xl font-semibold"
                    style={{ color: "var(--preview-foreground)" }}
                  >
                    Complementary Colors
                  </h2>

                  <p 
                    className="mb-4 leading-relaxed"
                    style={{ color: "var(--preview-foreground)" }}
                  >
                    Complementary colors are pairs of colors that are opposite each other on the color wheel. When placed next to each other, they create a strong contrast and can make each other appear brighter.
                  </p>

                  <div className="my-6 flex justify-center">
                    <div className="flex h-20 w-full max-w-md rounded-lg overflow-hidden">
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: "var(--preview-primary)" }}
                      ></div>
                      <div 
                        className="flex-1"
                        style={{ backgroundColor: "var(--preview-secondary)" }}
                      ></div>
                    </div>
                  </div>

                  <p 
                    className="mb-4 leading-relaxed"
                    style={{ color: "var(--preview-foreground)" }}
                  >
                    The high contrast of complementary colors creates a vibrant look, especially when used at full saturation. This color scheme must be managed well so it is not jarring.
                  </p>

                  <p 
                    className="mb-4 leading-relaxed"
                    style={{ color: "var(--preview-muted-foreground)" }}
                  >
                    Continue reading to learn about analogous color schemes and how they differ from complementary colors in both appearance and application...
                  </p>
                </div>
              </div>
            </div>

            {/* E-book Footer */}
            <footer 
              className="flex items-center justify-between border-t p-4"
              style={{ 
                backgroundColor: "var(--preview-card)",
                borderColor: "var(--preview-border)"
              }}
            >
              <button 
                className="rounded px-4 py-2 font-medium"
                style={{ 
                  backgroundColor: "var(--preview-muted)",
                  color: "var(--preview-muted-foreground)"
                }}
              >
                Previous
              </button>
              <span 
                className="font-medium"
                style={{ color: "var(--preview-card-foreground)" }}
              >
                Page 1 of 24
              </span>
              <button 
                className="rounded px-4 py-2 font-medium"
                style={{ 
                  backgroundColor: "var(--preview-primary)",
                  color: "var(--preview-primary-foreground)"
                }}
              >
                Next
              </button>
            </footer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
