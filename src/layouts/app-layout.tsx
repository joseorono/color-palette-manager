import AppNavbar from "@/components/navbar/app-navbar";
import { Outlet } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { ThemeProvider } from "@/components/theme-provider";

export default function AppLayout() {
  return (
    <ThemeProvider>
      <NuqsAdapter>
        <main className="mx-auto">
          <AppNavbar />
          <Outlet />
        </main>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
