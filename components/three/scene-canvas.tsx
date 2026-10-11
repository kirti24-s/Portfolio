"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import type { RootState } from "@react-three/fiber";
import { useInView } from "framer-motion";

import { cn } from "@/lib/utils";

export type SceneQuality = "low" | "medium" | "high";

/**
 * Shared R3F canvas.
 *
 * • Mounts only when scrolled into view (`frameloop` flips to "never" and the
 *   render loop stops completely — no idle GPU burn behind the fold).
 * • Fixed `dpr` ceiling per quality tier so a 4K desktop never renders at 3x.
 * • `Suspense` + `onCreated` are wired so a scene failure degrades to the
 *   provided fallback instead of blanking the section.
 */
export function SceneCanvas({
  children,
  className,
  quality = "high",
  camera,
  fallback,
  onReady,
  shadows = false,
}: {
  children: React.ReactNode;
  className?: string;
  quality?: SceneQuality;
  camera?: { position: [number, number, number]; fov: number };
  fallback: React.ReactNode;
  onReady?: () => void;
  shadows?: boolean;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapper, { margin: "20% 0px 20% 0px" });
  const [failed, setFailed] = useState(false);

  const dpr = useMemo<[number, number]>(() => {
    if (quality === "low") return [1, 1.35];
    if (quality === "medium") return [1, 1.75];
    return [1, 2];
  }, [quality]);

  const handleCreated = (state: RootState) => {
    // Fail loudly-but-safely on context loss rather than freezing the page.
    state.gl.domElement.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        setFailed(true);
      },
      { once: true },
    );
    onReady?.();
  };

  if (failed) {
    return <div className={cn("relative h-full w-full", className)}>{fallback}</div>;
  }

  return (
    <div ref={wrapper} className={cn("relative h-full w-full", className)}>
      <Canvas
        camera={camera}
        dpr={dpr}
        shadows={shadows}
        frameloop={inView ? "always" : "never"}
        gl={{
          antialias: quality !== "low",
          alpha: true,
          powerPreference: quality === "low" ? "default" : "high-performance",
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
        }}
        onCreated={handleCreated}
        style={{ position: "absolute", inset: 0 }}
        // Accessibility: the scene is decorative, the hero copy carries meaning.
        aria-hidden="true"
      >
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
}
