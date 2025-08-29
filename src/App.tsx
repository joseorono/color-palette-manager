import { ThemeProvider } from "@/components/theme-provider";
import PaletteEditor from "./pages/palette-editor";
import LandingPage from "./pages/landing-page";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard-page";
import AppLayout from "./layouts/app-layout";
import { DatabaseSeeder } from "./db/seeder";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingLayout from "./layouts/landing-page-layout";
import { ColorNameTestPage } from "./pages/tools/color-name-test";
import { ColorNamingTool } from "./pages/tools/color-naming-tool";
import { ColorMixerTool } from "./pages/tools/color-mixer-tool";
import { ShadeGeneratorTool } from "./pages/tools/shade-generator-tool";
import { ColorConverterTool } from "./pages/tools/color-converter-tool";
import { ImagePaletteExtractorTool } from "@/pages/image-palette-extractor-tool";
import { HslColorPickerTool } from "./pages/tools/hsl-color-picker-tool";
import ToolsPage from "./pages/tools-page";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import NotFoundPage from "./pages/not-found-page";
import { PalettePreviewPage } from "./pages/palette-preview-page";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system">
        <TooltipProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/app" element={<DashboardPage />} />
              <Route path="/app/dashboard" element={<DashboardPage />} />
              <Route path="/app/palette-edit" element={<PaletteEditor />} />
              <Route path="/app/color-test" element={<ColorNameTestPage />} />

              {/* <Route path="/app/test" element={<ThemeTest />} /> */}
              {/* <Route
                path="/app/palette-preview"
                element={<PaletteTabsPreview />}
              /> */}

              <Route path="/app/tools" element={<ToolsPage />} />
              <Route
                path="/app/palette-preview"
                element={
                  <PalettePreviewPage
                    initialColors={{
                      primary: "#3b82f6",
                      secondary: "#f97316",
                      accent: "#8b5cf6",
                      background: "#f8fafc",
                      foreground: "#1e293b",
                      card: "#ffffff",
                      border: "#e2e8f0",
                      muted: "#f1f5f9",
                      "primary-foreground": "#ffffff",
                      "secondary-foreground": "#ffffff",
                      "muted-foreground": "#64748b",
                      "card-foreground": "#1e293b",
                      "accent-foreground": "#ffffff",
                    }}
                    title="Color Scheme Preview"
                    initialView="desktop"
                    className=""
                    previewHeight={800}
                    containerClassName=""
                  />
                }
              />

              {/* Tools */}
              <Route
                path="/app/tools/color-naming"
                element={<ColorNamingTool />}
              />
              <Route
                path="/app/tools/color-mixer"
                element={<ColorMixerTool />}
              />
              <Route
                path="/app/tools/shade-generator"
                element={<ShadeGeneratorTool />}
              />
              <Route
                path="/app/tools/color-converter"
                element={<ColorConverterTool />}
              />
              <Route
                path="/app/tools/img-palette-extractor"
                element={<ImagePaletteExtractorTool />}
              />
              <Route
                path="/app/tools/hsl-color-picker"
                element={<HslColorPickerTool />}
              />
            </Route>

            <Route element={<LandingLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>

            <Route path="/db-seeder" element={<DatabaseSeeder />} />

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
