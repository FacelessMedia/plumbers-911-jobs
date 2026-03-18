import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { WhySection } from "@/components/why-section";
import { CompensationSection } from "@/components/compensation-section";
import { BenefitsSection } from "@/components/benefits-section";
import { WhatYouDoSection } from "@/components/what-you-do-section";
import { RequirementsSection } from "@/components/requirements-section";
import { UrgencySection } from "@/components/urgency-section";
import { ApplyFormSection } from "@/components/apply-form-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <WhySection />
      <CompensationSection />
      <BenefitsSection />
      <WhatYouDoSection />
      <RequirementsSection />
      <UrgencySection />
      <ApplyFormSection />
      <Footer />
    </main>
  );
}
