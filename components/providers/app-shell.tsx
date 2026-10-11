"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MotionConfig } from "framer-motion";

import { ScrollEngineProvider, useScrollEngine } from "@/components/providers/scroll-provider";
import { IntroProvider } from "@/components/providers/intro-provider";
import { Nav } from "@/components/navigation/nav";
import { Preloader } from "@/components/navigation/preloader";
import { ScrollProgress } from "@/components/navigation/scroll-progress";
import { CustomCursor } from "@/components/navigation/custom-cursor";
import { NoiseOverlay } from "@/components/ui/noise-overlay";

/**
 * Client shell.
 *
 * Owns everything that must live *outside* Locomotive's transformed container
 * (fixed navigation, progress rail, custom cursor, overlays, the loading
 * curtain) and mounts the scroll engine exactly once for the whole app.
 *
 * Server-rendered sections arrive as `children`, so the page content itself
 * stays a Server Component.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <IntroProvider>
      {/* `reducedMotion="user"` makes every Framer Motion animation in the app
          respect the OS setting automatically. */}
      <MotionConfig reducedMotion="user">
        <ScrollEngineProvider
          overlays={
            <>
              <Nav />
              <ScrollProgress />
              <CustomCursor />
            </>
          }
        >
          <RouteScrollReset />
          {children}
        </ScrollEngineProvider>
        <Preloader />
        <NoiseOverlay />
      </MotionConfig>
    </IntroProvider>
  );
}

/** Keeps client-side route changes (the `/work/[id]` case studies) at the top. */
function RouteScrollReset() {
  const pathname = usePathname();
  const { scrollTo, refresh, ready } = useScrollEngine();

  useEffect(() => {
    if (!ready) return;
    scrollTo(0, { duration: 0 });
    // New content: let ScrollTrigger and Locomotive re-measure once painted.
    const frame = requestAnimationFrame(() => refresh());
    return () => cancelAnimationFrame(frame);
  }, [pathname, ready, refresh, scrollTo]);

  return null;
}
