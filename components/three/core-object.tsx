"use client";

import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import type { PointerRef } from "@/hooks/use-pointer-ref";
import { damp } from "@/lib/utils";

type ScrollSource = RefObject<number>;

/**
 * THE CORE — the metallic object at the centre of the hero.
 *
 * A displaced icosahedron (geometry is mutated once on mount, then normals are
 * recomputed) with a brushed-chrome physical material, wrapped in:
 *   · a slowly rotating faceted shell,
 *   · an electric-lime inner ring that lights the metal from inside,
 *   · pointer-driven tilt + scroll-driven recession.
 *
 * All per-frame work happens in a single `useFrame` on one group — React never
 * re-renders while the pointer moves.
 */
export function CoreObject({
  pointer,
  scroll,
  quality = "high",
}: {
  pointer: RefObject<PointerRef>;
  /** 0 → 1 hero scroll progress, written by the hero section (no re-renders). */
  scroll: ScrollSource;
  quality?: "low" | "medium" | "high";
}) {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const chrome = useRef<THREE.Mesh>(null);

  const detail = quality === "low" ? 2 : quality === "medium" ? 3 : 4;

  /**
   * Deterministic displacement: a hash-based pseudo-noise keeps the silhouette
   * identical between server-rendered fallback, reloads and devices.
   */
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.55, detail);
    const position = geo.attributes.position as THREE.BufferAttribute;
    const vertex = new THREE.Vector3();

    for (let i = 0; i < position.count; i += 1) {
      vertex.fromBufferAttribute(position, i);
      const n =
        Math.sin(vertex.x * 2.1 + vertex.y * 1.3) * 0.5 +
        Math.sin(vertex.y * 3.3 + vertex.z * 1.7) * 0.3 +
        Math.sin(vertex.z * 2.7 + vertex.x * 2.3) * 0.2;
      const radius = 1 + n * 0.12;
      vertex.multiplyScalar(radius);
      position.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    position.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [detail]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const p = pointer.current;
    const progress = scroll.current ?? 0;

    if (group.current) {
      // Pointer parallax: rotate towards the cursor, never snap to it.
      const targetY = p.smoothX * 0.42;
      const targetX = -p.smoothY * 0.3;
      group.current.rotation.y = damp(group.current.rotation.y, targetY, 0.9, dt);
      group.current.rotation.x = damp(group.current.rotation.x, targetX, 0.9, dt);
      // Recede and rise as the hero scrolls away.
      group.current.position.y = damp(group.current.position.y, progress * 1.5, 0.92, dt);
      group.current.position.z = damp(group.current.position.z, progress * -1.6, 0.92, dt);
      const targetScale = 1 - progress * 0.22;
      const s = damp(group.current.scale.x, targetScale, 0.92, dt);
      group.current.scale.setScalar(s);
    }

    if (chrome.current) chrome.current.rotation.y += dt * 0.16;
    if (shell.current) {
      shell.current.rotation.y -= dt * 0.1;
      shell.current.rotation.z += dt * 0.045;
    }
    if (inner.current) inner.current.rotation.y += dt * 0.5;
    if (glow.current) {
      const pulse = 1 + Math.sin(performance.now() * 0.0012) * 0.06;
      glow.current.scale.setScalar(pulse);
    }
  });

  return (
    <group ref={group}>
      {/* Faceted chrome core */}
      <mesh ref={chrome} geometry={geometry} castShadow={false}>
        <meshPhysicalMaterial
          color="#cdd4de"
          metalness={1}
          roughness={0.16}
          clearcoat={0.6}
          clearcoatRoughness={0.25}
          envMapIntensity={1.5}
          flatShading={false}
        />
      </mesh>

      {/* Wireframe shell — reads as a scan grid around the metal */}
      <mesh ref={shell} scale={1.42}>
        <icosahedronGeometry args={[1.55, 1]} />
        <meshBasicMaterial
          color="#ccff00"
          wireframe
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </mesh>

      {/* Electric-lime inner ring: lights the chrome from the inside */}
      <mesh ref={inner} rotation={[Math.PI / 2.4, 0.3, 0]}>
        <torusGeometry args={[1.05, 0.035, 8, 96]} />
        <meshStandardMaterial
          color="#ccff00"
          emissive="#ccff00"
          emissiveIntensity={3.4}
          toneMapped={false}
        />
      </mesh>

      {/* Volumetric-ish halo — additive billboard behind the core */}
      <mesh ref={glow} position={[0, 0, -1.4]} scale={3.4}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial
          color="#ccff00"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
