import Hero from "@/components/landing-sections/hero";
import Features from "@/components/landing-sections/features";
import TechnicalHighlights from "@/components/technical-highlights";
import CallToAction from "@/components/landing-sections/call-to-action";
import Footer from "@/components/landing-sections/footer";
import { LandingSlider } from "@/components/landing-sections/slider";
import "./landing-page.css";

export default function LandingPage() {
  return (
    <>
      <div className="bg-white text-gray-900 dark:bg-slate-950 dark:text-gray-100">
        <Hero />
        <Features />
        <LandingSlider />
        <TechnicalHighlights />
        <CallToAction />
        <Footer />
      </div>
    </>
  );
}
