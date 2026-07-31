import { Hero } from "@/components/sections/hero";
import { AboutPreview } from "@/components/sections/about-preview";
import { FeaturedProjects } from "@/components/sections/featured-projects";
import { SkillsSection } from "@/components/sections/skills-section";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { FooterCTA } from "@/components/sections/footer-cta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <FeaturedProjects />
      <SkillsSection />
      <FeaturedArticles />
      <FooterCTA />
    </>
  );
}
