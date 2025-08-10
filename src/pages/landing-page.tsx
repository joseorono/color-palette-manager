import Header from "@/components/landing-sections/header"
import Hero from "@/components/landing-sections/hero"
import Features from "@/components/landing-sections/features"
import TechnicalHighlights from "@/components/technical-highlights"
import CallToAction from "@/components/landing-sections/call-to-action"
import Footer from "@/components/landing-sections/footer"

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900">
      <Header />
      <main>
        <Hero />
        <Features />
        <TechnicalHighlights />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}
