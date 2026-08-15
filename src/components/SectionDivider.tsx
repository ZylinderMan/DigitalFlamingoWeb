export default function SectionDivider() {
  return (
    <div className="w-full" aria-hidden="true">
      <div className="h-px w-full bg-black/60" />
      <div className="h-px w-full bg-white/[0.06]" />
    </div>
  );
}