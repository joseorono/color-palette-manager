import AppNavbar from "@/components/navbar/app-navbar";
import { Outlet } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout() {
  return (
    <ThemeProvider>
      <NuqsAdapter>
        <main className="mx-auto bg-red-500 sm:bg-blue-500 md:bg-green-500 lg:bg-yellow-500">
          <AppNavbar />
          <Outlet />
          <Toaster />
        </main>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
