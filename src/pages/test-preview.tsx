import { useEffect } from "react";
import { CSSColorVariablesObject } from "@/types/palette";
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

// CSS for preview styles
const previewStyles = `
  .preview-container * {
    transition: all 0.3s ease;
  }
  
  .preview-container {
    --primary: var(--preview-primary);
    --secondary: var(--preview-secondary);
    --accent: var(--preview-accent, #ec4899);
    --background: var(--preview-background);
    --foreground: var(--preview-foreground);
    --card: var(--preview-card);
    --card-foreground: var(--preview-card-foreground);
    --border: var(--preview-border);
    --muted: var(--preview-muted);
    --muted-foreground: var(--preview-muted-foreground);
    --primary-foreground: var(--preview-primary-foreground);
    --secondary-foreground: var(--preview-secondary-foreground);
    --accent-foreground: var(--preview-accent-foreground);
    
    background-color: var(--background);
    color: var(--foreground);
    border-radius: 0.5rem;
    overflow: hidden;
  }
  
  .preview-header {
    background-color: var(--background);
    border-bottom: 1px solid var(--border);
    padding: 1rem;
  }
  
  .preview-hero {
    background-color: var(--muted);
    padding: 3rem 1rem;
    text-align: center;
  }
  
  .preview-hero h1 {
    color: var(--foreground);
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
  
  .preview-hero p {
    color: var(--muted-foreground);
    margin-bottom: 1.5rem;
  }
  
  .preview-features {
    padding: 2rem 1rem;
    background-color: var(--background);
  }
  
  .preview-features h2 {
    color: var(--foreground);
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .preview-footer {
    background-color: var(--muted);
    padding: 1rem;
    text-align: center;
    color: var(--muted-foreground);
  }
`;

/**
 * TestPreview Component
 * 
 * A component that displays a preview of UI elements with the provided colors.
 * 
 * @component
 * 
 * @param {Object} props - Component props
 * @param {CSSColorVariablesObject} props.colors - Colors to use for the preview
 * @param {Function} [props.onColorsChange] - Callback function that receives the colors
 *   whenever they change. This allows parent components to react to color changes.
 * 
 * @example
 * // Basic usage with required colors
 * <TestPreview colors={myColors} />
 * 
 * @example
 * // With colors and change handler
 * <TestPreview 
 *   colors={{ primary: '#ff0000', secondary: '#00ff00', ... }} 
 *   onColorsChange={(colors) => console.log('Colors changed:', colors)} 
 * />
 */
interface TestPreviewProps {
  colors: CSSColorVariablesObject;
  onColorsChange?: (colors: CSSColorVariablesObject) => void;
}

export function TestPreview({ colors, onColorsChange }: TestPreviewProps) {
  // Apply the colors to CSS variables
  useEffect(() => {
    // Inject colors to CSS variables
    injectColorVariablesObjectToCSS(colors);
    
    // Notify parent component if needed
    if (onColorsChange) {
      onColorsChange(colors);
    }
  }, [colors, onColorsChange]);

  return (
    <div className="container mx-auto py-8">
      <style>{previewStyles}</style>

      <h1 className="mb-6 text-3xl font-bold">Color Scheme Preview</h1>

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
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Primary</p>
                    <div
                      className="h-10 w-full rounded-md border"
                      style={{ backgroundColor: colors.primary }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Secondary</p>
                    <div
                      className="h-10 w-full rounded-md border"
                      style={{ backgroundColor: colors.secondary }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="mb-2 text-sm font-medium">Background</p>
                    <div
                      className="h-10 w-full rounded-md border"
                      style={{ backgroundColor: colors.background }}
                    />
                  </div>
                  <div>
                    <p className="mb-2 text-sm font-medium">Foreground</p>
                    <div
                      className="h-10 w-full rounded-md border"
                      style={{ backgroundColor: colors.foreground }}
                    />
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
              <div className="preview-container overflow-hidden rounded-lg border">
                {/* Preview Header */}
                <div className="preview-header flex items-center justify-between">
                  <div className="font-bold">Color Palette App</div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      Features
                    </Button>
                    <Button variant="ghost" size="sm">
                      Pricing
                    </Button>
                    <Button variant="ghost" size="sm">
                      About
                    </Button>
                    <Button size="sm">Sign Up</Button>
                  </div>
                </div>

                {/* Preview Hero */}
                <div className="preview-hero">
                  <h1>Create Beautiful Color Palettes</h1>
                  <p>
                    Design, save, and share color schemes for your next project
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button>Get Started</Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </div>

                {/* Preview Features */}
                <div className="preview-features">
                  <h2>Key Features</h2>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader>
                        <CardTitle>Color Generation</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Create harmonious color schemes with our smart color
                          generator
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Badge variant="outline">AI-Powered</Badge>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Save & Organize</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Store your favorite palettes and organize them with
                          tags
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Badge>Cloud Sync</Badge>
                      </CardFooter>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Export Options</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p>
                          Export your palettes in multiple formats for any
                          project
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Badge variant="secondary">Developer Tools</Badge>
                      </CardFooter>
                    </Card>
                  </div>
                </div>

                {/* Preview Footer */}
                <div className="preview-footer">
                  <p>© 2025 Color Palette Manager. All rights reserved.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
