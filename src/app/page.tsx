import { Hero } from "@/components/sections/hero";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { AboutPreview } from "@/components/sections/about-preview";
import { SkillsSection } from "@/components/sections/skills-section";
import { FooterCTA } from "@/components/sections/footer-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <AboutPreview />
      <SkillsSection />
      <FooterCTA />
    </>
  );
}
