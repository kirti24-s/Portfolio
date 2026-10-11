"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { PointerRef } from "@/hooks/use-pointer-ref";

/**
 * ATMOSPHERIC DUST — additive points drifting through the hero.
 *
 * Counts are tier-driven (never a fixed "1200 particles everywhere"), the
 * sprite is a generated radial-gradient texture so dots stay round and soft,
 * and the whole field is a single draw call.
 */
export function ParticleField({
  pointer,
  count = 900,
  radius = 16,
}: {
  pointer: RefObject<PointerRef>;
  count?: number;
  radius?: number;
}) {
  const points = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    // Seeded PRNG keeps the field stable across reloads and matching the
    // static fallback composition.
    let seed = 20240513;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      // Shell distribution: denser near the core, sparse at the edges.
      const r = radius * (0.32 + Math.pow(random(), 0.65) * 0.9);
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(random() * 2 - 1);

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.62;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      sizes[i] = 0.4 + random() * 1.1;
    }

    return { positions, sizes };
  }, [count, radius]);

  const sprite = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.35, "rgba(226,255,133,0.65)");
    gradient.addColorStop(1, "rgba(204,255,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (!points.current) return;
    points.current.rotation.y += dt * 0.02;
    points.current.rotation.x +=
      (-pointer.current.smoothY * 0.05 - points.current.rotation.x) * Math.min(dt, 1) * 2;
    points.current.position.x +=
      (pointer.current.smoothX * 0.35 - points.current.position.x) * Math.min(dt, 1) * 2;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        map={sprite ?? undefined}
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        color="#d8ff7a"
        toneMapped={false}
      />
    </points>
  );
}
