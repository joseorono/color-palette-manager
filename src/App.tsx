import { ThemeProvider } from "@/components/theme-provider";
import HomePage from "./pages/home-page";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard-page";
import ThemeTest from "./pages/theme-test";
import LandingPage from "./pages/landing-page";
function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
       <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/theme-test" element={<ThemeTest />} />
        <Route path="/landing" element={<LandingPage />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
