/**
 * Streaming fallback shown while a route segment is preparing.
 * Deliberately cheap: no 3D, no motion — just the visual language.
 */
export default function Loading() {
  return (
    <div className="shell flex min-h-[70svh] flex-col justify-center gap-8 py-32" aria-busy="true">
      <span className="eyebrow animate-pulse text-volt">Loading</span>
      <div className="flex flex-col gap-4">
        <div className="h-14 w-[min(90%,42rem)] animate-pulse bg-carbon" />
        <div className="h-14 w-[min(70%,30rem)] animate-pulse bg-carbon" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div key={index} className="h-40 animate-pulse border border-line bg-carbon/60" />
        ))}
      </div>
      <span className="sr-only">Loading content…</span>
    </div>
  );
}
