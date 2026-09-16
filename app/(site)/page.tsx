// Author: Zeday | https://join.co.id
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import FeatureCards from "@/components/FeatureCards";
import LatestNews from "@/components/LatestNews";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import CTASection from "@/components/CTASection";
import { readSettings } from "@/lib/settings";
import { listTestimonials } from "@/lib/repositories/testimonials";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Sekolah dasar ramah anak dengan kurikulum modern, guru berpengalaman, dan lingkungan belajar yang aman dan menyenangkan di Palangkaraya.",
};

export default async function HomePage() {
  const { schoolWhatsapp, siteTagline } = await readSettings();
  const testimonials = listTestimonials();

  return (
    <>
      <Hero tagline={siteTagline} />
      <StatsSection />
      <FeatureCards />
      <LatestNews />
      <TestimonialCarousel testimonials={testimonials} />
      <CTASection whatsapp={schoolWhatsapp} />
    </>
  );
}
