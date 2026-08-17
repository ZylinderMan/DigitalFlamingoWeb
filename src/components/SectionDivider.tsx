export default function SectionDivider() {
  return (
    <div className="w-full" aria-hidden="true">
      <div className="h-px w-full bg-[var(--foreground)]/10" />
      <div className="h-px w-full bg-white/80" />
    </div>
  );
}