import { ThemeProvider } from "@/components/theme-provider";
import HomePage from "./pages/home-page";
import { Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard-page";
import AppLayout from "./layouts/app-layout";
function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
       <Routes>
        <Route element={<AppLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            {/* other routes... */}
        </Route>
    </Routes>
    </ThemeProvider>
  );
}

export default App;
