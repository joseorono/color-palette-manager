import { ThemeProvider } from "@/components/theme-provider";
import HomePage from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ThemeTest from "./app/routes/theme-test";
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
      </Routes>
    </ThemeProvider>
  );
}

export default App;
