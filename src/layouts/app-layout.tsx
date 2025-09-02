import AppNavbar from "@/components/navbar/app-navbar";
import { Outlet } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout() {
  return (
    <ThemeProvider>
      <NuqsAdapter>
        <main className="mx-auto  sm:bg-green-500 md:bg-blue-500 lg:bg-yellow-500 xl:bg-purple-500 2xl:bg-orange-500">
          <AppNavbar />
          <Outlet />
          <Toaster />
        </main>
      </NuqsAdapter>
    </ThemeProvider>
  );
}
