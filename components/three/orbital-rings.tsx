"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { PointerRef } from "@/hooks/use-pointer-ref";

const RING_CONFIG = [
  { radius: 2.85, tube: 0.008, tilt: [1.42, 0.2, 0.4] as const, speed: 0.09, accent: false },
  { radius: 3.5, tube: 0.006, tilt: [1.1, -0.4, 1.1] as const, speed: -0.06, accent: true },
  { radius: 4.2, tube: 0.005, tilt: [1.62, 0.6, -0.3] as const, speed: 0.045, accent: false },
];

/**
 * ORBITAL SYSTEM — three tilted rings with satellite bodies drifting along
 * them, plus a horizontal "orbit plane" line that anchors the composition.
 * Pointer movement adds a gentle yaw so the whole system feels touchable.
 */
export function OrbitalRings({
  pointer,
  quality = "high",
}: {
  pointer: RefObject<PointerRef>;
  quality?: "low" | "medium" | "high";
}) {
  const system = useRef<THREE.Group>(null);
  const rings = useRef<(THREE.Group | null)[]>([]);

  const satellites = useMemo(
    () =>
      [
        { radius: 2.85, speed: 0.45, offset: 0, size: 0.045, color: "#ccff00" },
        { radius: 3.5, speed: -0.3, offset: 2.1, size: 0.032, color: "#e7ecf3" },
        { radius: 4.2, speed: 0.22, offset: 4.3, size: 0.038, color: "#ccff00" },
      ] as const,
    [],
  );

  const satellitesRef = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    if (system.current) {
      system.current.rotation.y +=
        (pointer.current.smoothX * 0.34 - system.current.rotation.y) * Math.min(dt * 1.5, 1);
      system.current.rotation.x +=
        (-pointer.current.smoothY * 0.24 - system.current.rotation.x) * Math.min(dt * 1.5, 1);
    }

    rings.current.forEach((ring, index) => {
      if (!ring) return;
      ring.rotation.z += dt * RING_CONFIG[index].speed;
    });

    satellitesRef.current.forEach((satellite, index) => {
      if (!satellite) return;
      const config = satellites[index];
      const angle = performance.now() * 0.00025 * config.speed + config.offset;
      satellite.position.set(
        Math.cos(angle) * config.radius,
        Math.sin(angle * 0.6) * 0.14,
        Math.sin(angle) * config.radius,
      );
    });
  });

  const ringCount = quality === "low" ? 2 : 3;

  return (
    <group ref={system}>
      {RING_CONFIG.slice(0, ringCount).map((ring, index) => (
        <group
          key={ring.radius}
          ref={(node) => {
            rings.current[index] = node;
          }}
          rotation={[ring.tilt[0], ring.tilt[1], ring.tilt[2]]}
        >
          <mesh>
            <torusGeometry args={[ring.radius, ring.tube * 6, 6, quality === "low" ? 72 : 160]} />
            <meshBasicMaterial
              color={ring.accent ? "#ccff00" : "#e7ecf3"}
              transparent
              opacity={ring.accent ? 0.42 : 0.16}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}

      {satellites.slice(0, ringCount).map((satellite, index) => (
        <mesh
          key={satellite.color + index}
          ref={(node) => {
            satellitesRef.current[index] = node;
          }}
          scale={satellite.size}
        >
          <sphereGeometry args={[1, 12, 12]} />
          <meshBasicMaterial color={satellite.color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}
