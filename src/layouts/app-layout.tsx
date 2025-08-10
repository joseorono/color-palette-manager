import AppNavbar from "@/components/navbar/app-navbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return <main>
        <AppNavbar />
        <Outlet />
    </main>;
}
