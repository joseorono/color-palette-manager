import Navbar from "@/components/nav-bar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {
    return <main>
        <Navbar />
        <Outlet />
    </main>;
}
