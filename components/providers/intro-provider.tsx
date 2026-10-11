"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type IntroState = {
  /** False while the loading curtain is still on screen. */
  introDone: boolean;
  /** True when the curtain should render at all (skipped on repeat visits). */
  showIntro: boolean;
  complete: () => void;
};

const IntroContext = createContext<IntroState>({
  introDone: true,
  showIntro: false,
  complete: () => {},
});

const STORAGE_KEY = "obsidian:intro-played";

/**
 * Coordinates the loading curtain with the hero animation so the headline
 * starts exactly as the curtain lifts — never before the user can see it, and
 * never stuck hidden if the curtain is skipped (repeat visits, reduced motion,
 * failed JS).
 */
export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ introDone: boolean; showIntro: boolean }>({
    // Server + first client render agree: nothing has played yet.
    introDone: false,
    showIntro: false,
  });

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let played = false;
    try {
      played = window.sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      played = false;
    }

    const skip = reduced || played;
    setState({ introDone: skip, showIntro: !skip });

    // Hard safety net: whatever happens to the curtain, the page becomes
    // interactive and revealed within 3.2s.
    const timeout = window.setTimeout(() => setState((s) => ({ ...s, introDone: true })), 3200);
    return () => window.clearTimeout(timeout);
  }, []);

  const complete = useCallback(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode — the curtain simply plays again */
    }
    setState({ introDone: true, showIntro: false });
  }, []);

  const value = useMemo<IntroState>(
    () => ({ introDone: state.introDone, showIntro: state.showIntro, complete }),
    [complete, state.introDone, state.showIntro],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro(): IntroState {
  return useContext(IntroContext);
}
