"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  LandingHero,
  LandingFeatures,
  LandingCTA,
} from "@/components/landing/LandingSections";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <LandingHero />
        <LandingFeatures />
        <LandingCTA />
      </main>
      <Footer />
    </>
  );
}
