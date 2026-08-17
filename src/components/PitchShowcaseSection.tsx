import PitchBlock from "./PitchBlock";
import ShowcaseBlock from "./ShowcaseBlock";

export default function PitchShowcaseSection() {
  return (
    <section className="min-h-screen w-full flex flex-col justify-center px-6 py-20 md:py-28">
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-20 md:gap-24">
        <div data-snap-section>
          <PitchBlock />
        </div>
        <div data-snap-section>
          <ShowcaseBlock />
        </div>
      </div>
    </section>
  );
}