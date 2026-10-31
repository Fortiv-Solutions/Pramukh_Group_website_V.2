"use client";

import { useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/Logo";
import { useScroll } from "@/components/SmoothScroll";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { markIntroDone } from "@/lib/intro";
import styles from "./Preloader.module.css";

/** The CSS entrance (logo assembling) finishes at ~2.4s; never exit before it. */
const MIN_MS = 2500;
/** Stop waiting for slow assets after this long. */
const MAX_WAIT_MS = 6000;

const whenLoaded = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });

/**
 * Full-screen intro: only the centred logo, assembling itself letter by letter in CSS from first paint
 * (no wait for hydration). GSAP waits for fonts and page load, then plays the exit.
 * The light panel then lifts like a curtain while the hero louvre opens beneath it.
 */
export function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);
  const scroll = useScroll();

  useGSAP(
    (_, contextSafe) => {
      const el = root.current!;
      if (prefersReducedMotion()) {
        markIntroDone();
        setGone(true);
        return;
      }

      // Start every visit at the top so the opening plays (deep links to a section are respected).
      if (!location.hash) {
        history.scrollRestoration = "manual";
        window.scrollTo(0, 0);
      }
      scroll.stop();

      const minTime = new Promise((r) => setTimeout(r, MIN_MS));
      const ready = Promise.race([
        Promise.all([document.fonts?.ready ?? Promise.resolve(), whenLoaded()]),
        new Promise((r) => setTimeout(r, MAX_WAIT_MS)),
      ]);

      const exit = contextSafe!(() => {
        el.dataset.phase = "exit"; // drops the CSS entrance animations so GSAP owns the styles
        gsap
          .timeline({ defaults: { ease: "power3.in" } })
          // y is in logo units: one row height, so every glyph (including ®) clears its mask.
          .to("[data-logo='word'] path", { y: -170, duration: 0.55, stagger: 0.03 })
          .to("[data-logo='tagline'] path", { y: -95, duration: 0.5, stagger: 0.012 }, "<0.04")
          .to("[data-logo='mark']", { yPercent: -18, autoAlpha: 0, duration: 0.55 }, "<")
          // The light curtain lifts off the hero. A transform (composited), not a clip-path repaint.
          .add(() => {
            markIntroDone();
            scroll.start();
          }, "-=0.2")
          .to(el, { yPercent: -100, duration: 1, ease: "expo.inOut", force3D: true }, "<")
          .add(() => setGone(true));
      });

      let cancelled = false;
      Promise.all([ready, minTime]).then(() => {
        if (!cancelled) exit();
      });

      return () => {
        cancelled = true;
        scroll.start();
      };
    },
    { scope: root },
  );

  if (gone) return null;

  return (
    <div ref={root} className={styles.preloader} aria-hidden="true" data-preloader>
      <div className={styles.logo}>
        <BrandLogo title={null} maskId="pl-row" className={styles.logoSvg} />
      </div>
    </div>
  );
}
