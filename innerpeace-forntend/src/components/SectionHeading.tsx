export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      {subtitle ? (
        <p className="text-xs uppercase tracking-[0.4em] text-cocoa/70">{subtitle}</p>
      ) : null}
      <h2 className="mt-3 text-2xl font-semibold text-ink md:text-3xl">{title}</h2>
    </div>
  );
}
