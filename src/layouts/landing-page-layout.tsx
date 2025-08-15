import LandingNavbar from "@/components/navbar/landing-navbar";
import { Outlet } from "react-router-dom";

export default function LandingLayout() {
  return (
    <main>
      <LandingNavbar />
      <Outlet />
    </main>
  );
}
