import Hero from "@/components/Hero";
import PitchShowcaseSection from "@/components/PitchShowcaseSection";
import SectionDivider from "@/components/SectionDivider";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />

      <SectionDivider />
      <PitchShowcaseSection />

      <Footer />
    </>
  );
}