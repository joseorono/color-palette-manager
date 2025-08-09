import { ThemeProvider } from "@/components/theme-provider";
import HomePage from "./pages/HomePage";
function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
