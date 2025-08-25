import { ThemeProvider } from "@/components/theme-provider";
import PaletteEditor from "./pages/palette-editor";
import LandingPage from "./pages/landing-page";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard-page";
import AppLayout from "./layouts/app-layout";
import { DatabaseSeeder } from "./db/seeder";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingLayout from "./layouts/landing-page-layout";
import ThemeTest from "./pages/theme-test";
import NotFoundPage from "./pages/not-found-page";
import { ColorNameTestPage } from "./pages/color-name-test";
import { ColorNamingTool } from "./pages/color-naming-tool";
import { ColorMixerTool } from "./pages/color-mixer-tool";
import { ShadeGeneratorTool } from "./pages/shade-generator-tool";
import { ColorConverterTool } from "./pages/color-converter-tool";
import { ImagePaletteExtractorTool } from '@/pages/image-palette-extractor-tool';
import ToolsPage from "./pages/tools-page";
import { TooltipProvider } from "@radix-ui/react-tooltip";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme="system"
      >
        <TooltipProvider>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/app" element={<DashboardPage />} />
              <Route path="/app/dashboard" element={<DashboardPage />} />
              <Route path="/app/palette-edit" element={<PaletteEditor />} />
              <Route path="/app/color-test" element={<ColorNameTestPage />} />
              <Route path="/app/tools" element={<ToolsPage />} />
              <Route path="/app/test" element={<ThemeTest />} />

              {/* Tools */}
              <Route path="/app/tools/color-naming" element={<ColorNamingTool />} />
              <Route path="/app/tools/color-mixer" element={<ColorMixerTool />} />
              <Route path="/app/tools/shade-generator" element={<ShadeGeneratorTool />} />
              <Route path="/app/tools/color-converter" element={<ColorConverterTool />} />
              <Route path="/app/tools/img-palette-extractor" element={<ImagePaletteExtractorTool />} />
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
