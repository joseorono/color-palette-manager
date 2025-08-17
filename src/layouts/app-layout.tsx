import AppNavbar from "@/components/navbar/app-navbar";
import { Outlet } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

export default function AppLayout() {
  return (
    <NuqsAdapter>
      <main className="mx-auto">
        <AppNavbar />
        <Outlet />
      </main>
    </NuqsAdapter>
  );
}
