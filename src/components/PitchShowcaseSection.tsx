import PitchBlock from "./PitchBlock";
import ShowcaseBlock from "./ShowcaseBlock";

export default function PitchShowcaseSection() {
  return (
    <section className="snap-start min-h-screen w-full flex flex-col justify-center px-6 py-20 md:py-28">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-20 md:gap-24">
        <PitchBlock />
        <ShowcaseBlock />
      </div>
    </section>
  );
}