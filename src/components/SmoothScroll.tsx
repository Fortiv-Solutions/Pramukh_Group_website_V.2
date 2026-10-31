"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

type ScrollApi = {
  scrollTo: (target: string | HTMLElement | number) => void;
  stop: () => void;
  start: () => void;
};

const ScrollContext = createContext<ScrollApi | null>(null);

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScroll must be used inside <SmoothScroll>");
  return ctx;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  // Remembers a lock requested before Lenis exists (child effects run before this provider's).
  const lockedRef = useRef(false);
  const [api] = useState<ScrollApi>(() => ({
    scrollTo(target) {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
        return;
      }
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (typeof el === "number") window.scrollTo({ top: el });
      else el?.scrollIntoView({ block: "start" });
    },
    stop: () => {
      lockedRef.current = true;
      lenisRef.current?.stop();
      document.documentElement.style.overflow = "hidden";
    },
    start: () => {
      lockedRef.current = false;
      lenisRef.current?.start();
      document.documentElement.style.overflow = "";
    },
  }));

  useEffect(() => {
    document.documentElement.classList.add("js");
    // Re-measure once web fonts have settled, so pinned sections use final line heights.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 0.9,
      anchors: false,
      // Nested lists marked data-lenis-scrollable scroll natively only while they overflow; otherwise the
      // page keeps scrolling over them instead of stalling on an element with nothing to scroll.
      prevent: (node) => node.hasAttribute("data-lenis-scrollable") && node.scrollHeight > node.clientHeight + 1,
    });
    lenisRef.current = lenis;
    if (lockedRef.current) lenis.stop();
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
