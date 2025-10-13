import Hero from "@/components/landing-sections/hero";
import Features from "@/components/landing-sections/features";
import TechnicalHighlights from "@/components/technical-highlights";
import CallToAction from "@/components/landing-sections/call-to-action";
import Footer from "@/components/landing-sections/footer";

export default function LandingPage() {
  return (
    <>
      <style>{`
        .gradient-bg {
            background: linear-gradient(135deg, #e0f2fe 0%, #93e6ef 50%, #46cee6 100%);
        }
        
        .hero-gradient {
            background: linear-gradient(180deg, #f0f9ff 0%, rgba(240, 249, 255, 0.8) 100%);
        }
        
        .feature-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            background: white;
            border: 1px solid #e5e7eb;
        }
        
        .feature-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px -4px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04);
            border-color: #d1d5db;
        }
        
        .feature-icon {
            background: #f0f9ff;
            transition: all 0.3s ease;
        }
        
        .feature-card:hover .feature-icon {
            background: #e0f2fe;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #0891b2 0%, #095764 100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px -2px rgba(8, 145, 178, 0.3);
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #0a6994 0%, #082e44 100%);
            transform: translateY(-2px);
            box-shadow: 0 12px 20px -4px rgba(8, 145, 178, 0.4);
        }
        
        .btn-secondary {
            transition: all 0.3s ease;
            border: 2px solid #46cee6;
        }
        
        .btn-secondary:hover {
            background: linear-gradient(135deg, #46cee6 0%, #0891b2 100%);
            border-color: #0891b2;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 8px 16px -4px rgba(70, 206, 230, 0.3);
        }
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
