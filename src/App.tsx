import { ThemeProvider } from "@/components/theme-provider";
import PaletteEditor from "./pages/palette-editor";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard-page";
import AppLayout from "./layouts/app-layout";
import LandingLayout from "./layouts/landing-page-layout";
import { DatabaseSeeder } from "./db/seeder";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
       <Routes>
        <Route element={<AppLayout />}>
            <Route path="/" element={<PaletteEditor />} />
            <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
{/*         
        <Route element={<LandingLayout />}>
        </Route> */}

        <Route path="/db-seeder" element={<DatabaseSeeder />} />
    </Routes>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
