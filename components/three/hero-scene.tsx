"use client";

import { type RefObject } from "react";
import { Environment, Lightformer } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

import type { PointerRef } from "@/hooks/use-pointer-ref";
import { CoreObject } from "@/components/three/core-object";
import { OrbitalRings } from "@/components/three/orbital-rings";
import { ParticleField } from "@/components/three/particle-field";
import { SceneCanvas, type SceneQuality } from "@/components/three/scene-canvas";
import { damp } from "@/lib/utils";

/**
 * Lighting + a locally rendered chrome environment.
 *
 * `Environment` with Lightformer children bakes an HDR-style cube map from
 * geometry in-scene (one render, then cached) — no external .hdr fetch, so the
 * metal reflects studio light even offline and adds zero network weight.
 */
function StudioEnvironment({ quality }: { quality: SceneQuality }) {
  return (
    <Environment resolution={quality === "low" ? 64 : 256} frames={1}>
      <color attach="background" args={["#04060a"]} />
      <Lightformer
        form="rect"
        intensity={2.6}
        position={[0, 4, -6]}
        scale={[12, 6, 1]}
        color="#ffffff"
      />
      <Lightformer
        form="rect"
        intensity={2.2}
        rotation-y={Math.PI / 2}
        position={[-8, 1, 0]}
        scale={[10, 4, 1]}
        color="#ccff00"
      />
      <Lightformer
        form="rect"
        intensity={1.4}
        rotation-y={-Math.PI / 2}
        position={[8, -1, 0]}
        scale={[10, 4, 1]}
        color="#8fb4ff"
      />
      <Lightformer
        form="ring"
        intensity={1.6}
        position={[0, -5, 2]}
        scale={6}
        color="#ccff00"
      />
    </Environment>
  );
}

function Scene({
  pointer,
  scroll,
  quality,
}: {
  pointer: RefObject<PointerRef>;
  scroll: RefObject<number>;
  quality: SceneQuality;
}) {
  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const camera = state.camera;
    const p = pointer.current;

    // Subtle camera drift = depth. Applied to the camera, never to the object
    // that the pointer already rotates, so the two motions never fight.
    const targetX = p.smoothX * 0.42;
    const targetY = p.smoothY * 0.3 + scroll.current * 0.5;
    camera.position.x = damp(camera.position.x, targetX, 0.94, dt);
    camera.position.y = damp(camera.position.y, targetY, 0.94, dt);
    camera.position.z = damp(camera.position.z, 6.4 + scroll.current * 1.4, 0.94, dt);
    camera.lookAt(0, 0, 0);
  });

  const particleCount = quality === "low" ? 220 : quality === "medium" ? 520 : 950;

  return (
    <>
      <color attach="background" args={["#04060a"]} />
      <fog attach="fog" args={["#04060a", 9, 21]} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 3]} intensity={0.7} color="#ffffff" />
      <pointLight position={[0, 0, 0]} intensity={9} distance={7} color="#ccff00" />
      <pointLight position={[-5, 3, 4]} intensity={22} distance={16} color="#ccff00" />
      <pointLight position={[6, -2, 2]} intensity={16} distance={16} color="#6f8cff" />

      <StudioEnvironment quality={quality} />

      <CoreObject pointer={pointer} scroll={scroll} quality={quality} />
      <OrbitalRings pointer={pointer} quality={quality} />
      <ParticleField pointer={pointer} count={particleCount} />
    </>
  );
}

export function HeroScene({
  pointer,
  scroll,
  quality,
  fallback,
  onReady,
}: {
  pointer: RefObject<PointerRef>;
  scroll: RefObject<number>;
  quality: SceneQuality;
  fallback: React.ReactNode;
  onReady?: () => void;
}) {
  return (
    <SceneCanvas
      quality={quality}
      camera={{ position: [0, 0, 6.4], fov: 38 }}
      fallback={fallback}
      onReady={onReady}
      className="h-full w-full"
    >
      <Scene pointer={pointer} scroll={scroll} quality={quality} />
    </SceneCanvas>
  );
}
