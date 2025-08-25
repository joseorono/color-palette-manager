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
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { TestPreview } from "./pages/test-preview";

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
              <Route path="/app/test" element={
                <TestPreview 
                  colors={{
                    primary: "#3b82f6",
                    secondary: "#10b981",
                    accent: "#f3f4f6",
                    background: "#ffffff",
                    foreground: "#1f2937",
                    card: "#ffffff",
                    "card-foreground": "#1f2937",
                    border: "#e5e7eb",
                    muted: "#f3f4f6",
                    "muted-foreground": "#6b7280",
                    "primary-foreground": "#ffffff",
                    "secondary-foreground": "#ffffff",
                    "accent-foreground": "#1f2937"
                  }}
                  onColorsChange={(colors) => {
                    console.log("Colors changed:", colors);
                    // You could save these colors to state or storage
                  }}
                />
              } />
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
