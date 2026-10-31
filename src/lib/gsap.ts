"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true });
  gsap.defaults({ ease: "expo.out", duration: 1.1 });
}

/** Shared media-query conditions for gsap.matchMedia(). */
export const MQ = {
  desktop: "(min-width: 1024px)",
  mobile: "(max-width: 1023.98px)",
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(MQ.reduce).matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };
