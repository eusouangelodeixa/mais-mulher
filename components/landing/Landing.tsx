import { TopBanner } from "./TopBanner";
import { SiteHeader } from "./SiteHeader";
import { Hero } from "./Hero";
import { ProblemSection } from "./ProblemSection";
import { HowItWorks } from "./HowItWorks";
import { WhatsAppSection } from "./WhatsAppSection";
import { FeaturesSection } from "./FeaturesSection";
import { LocalTrust } from "./LocalTrust";
import { Mission } from "./Mission";
import { Pricing } from "./Pricing";
import { FAQ } from "./FAQ";
import { FinalCTA } from "./FinalCTA";
import { SiteFooter } from "./SiteFooter";

/**
 * Landing page pública do +Mulher (tema dark premium, escopado em `.landing`).
 * Todas as seções convergem para o CTA de cadastro.
 */
export function Landing() {
  return (
    <div className="landing min-h-dvh bg-background font-sans text-foreground antialiased">
      <TopBanner />
      <SiteHeader />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <WhatsAppSection />
        <FeaturesSection />
        <LocalTrust />
        <Mission />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
