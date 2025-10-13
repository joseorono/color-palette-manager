import Hero from "@/components/landing-sections/hero";
import Features from "@/components/landing-sections/features";
import TechnicalHighlights from "@/components/technical-highlights";
import CallToAction from "@/components/landing-sections/call-to-action";
import Footer from "@/components/landing-sections/footer";

export default function LandingPage() {
  return (
    <>
      <style>{`
        :root {
            --brand-dark: #2D3748;
            --brand-light: #F7FAFC;
            --brand-cyan-light: #9DECF9;
            --brand-cyan: #63B3ED;
            --brand-teal: #319795;
            --brand-teal-dark: #2C7A7B;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #F7FAFC 0%, #9DECF9 50%, #63B3ED 100%);
        }
        
        .hero-gradient {
            background: linear-gradient(180deg, #F7FAFC 0%, rgba(247, 250, 252, 0.8) 100%);
        }
        
        .feature-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #319795 0%, #2C7A7B 100%);
            transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #2C7A7B 0%, #285E61 100%);
            transform: translateY(-1px);
            box-shadow: 0 10px 15px -3px rgba(44, 122, 123, 0.3);
        }
        
        .btn-secondary {
            transition: all 0.3s ease;
        }
        
        .btn-secondary:hover {
            background-color: #319795;
            color: white;
            transform: translateY(-1px);
        }
        
        .text-brand-dark { color: var(--brand-dark); }
        .bg-brand-light { background-color: var(--brand-light); }
        .text-brand-teal { color: var(--brand-teal); }
        .bg-brand-teal { background-color: var(--brand-teal); }
        .hover\\:bg-brand-teal-dark:hover { background-color: var(--brand-teal-dark); }
        .border-brand-teal { border-color: var(--brand-teal); }
        .hover\\:text-brand-teal:hover { color: var(--brand-teal); }
        .hover\\:text-brand-teal-dark:hover { color: var(--brand-teal-dark); }
      `}</style>
      <div className="bg-white text-gray-900">
        <main>
          <Hero />
          <Features />
          <TechnicalHighlights />
          <CallToAction />
        </main>
        <Footer />
      </div>
    </>
  );
}
