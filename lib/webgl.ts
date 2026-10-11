"use client";

import { useEffect, useState } from "react";

/**
 * Cheap, cached WebGL capability probe.
 * Returns `null` while unknown (server + first paint) so the UI can decide
 * between mounting the 3D scene and the CSS/SVG fallback without a flash of
 * either, and without ever throwing on machines without WebGL.
 */
let cached: boolean | null = null;

export function detectWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    cached = Boolean(gl);
    if (cached && gl) {
      // Some drivers report a context then fail on the real one — verify a tiny
      // program compiles before committing to the 3D scene.
      const shader = gl.createShader(gl.VERTEX_SHADER);
      if (!shader) {
        cached = false;
        return cached;
      }
      gl.shaderSource(shader, "void main(){gl_Position=vec4(0.0);}");
      gl.compileShader(shader);
      cached = Boolean(gl.getShaderParameter(shader, gl.COMPILE_STATUS));
      gl.deleteShader(shader);
    }
  } catch {
    cached = false;
  }
  return cached;
}

export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    setSupported(detectWebGL());
  }, []);
  return supported;
}
