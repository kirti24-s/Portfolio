/**
 * Fixed atmospheric overlay: film grain, vignette and a very faint scanline.
 * Static, `pointer-events: none`, no animation — costs nothing per frame but
 * makes the flat blacks feel like a rendered environment rather than a div.
 */
export function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[55] overflow-hidden" aria-hidden="true">
      <div className="grain absolute inset-0 opacity-[0.035] mix-blend-soft-light" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_50%,transparent_35%,rgba(0,0,0,0.55)_100%)]" />
      <div className="animate-scanline absolute inset-x-0 top-0 h-[35vh] bg-gradient-to-b from-transparent via-volt/[0.025] to-transparent" />
    </div>
  );
}
