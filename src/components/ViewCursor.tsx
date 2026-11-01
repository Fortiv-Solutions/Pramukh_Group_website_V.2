"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import styles from "./ViewCursor.module.css";

/**
 * Contextual cursor: over any element marked data-cursor="View" (or "Play", "Explore"), the pointer
 * becomes a small ivory disc carrying that word. Mouse and trackpad only; touch screens never see it.
 * It trails the pointer slightly, arrives with an ease-out and leaves faster, and presses with the click.
 * Under reduced motion it tracks the pointer exactly and only fades.
 */
export function ViewCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduce = prefersReducedMotion();
    const root = document.documentElement;
    root.setAttribute("data-view-cursor", "");
    gsap.set(el, { xPercent: -50, yPercent: -50, scale: reduce ? 1 : 0.4, autoAlpha: 0 });
    const xTo = gsap.quickTo(el, "x", { duration: reduce ? 0 : 0.45, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: reduce ? 0 : 0.45, ease: "power3.out" });

    let x = -200;
    let y = -200;
    let active: HTMLElement | null = null;

    const show = (target: HTMLElement) => {
      label.textContent = target.dataset.cursor || "View";
      gsap.to(el, { autoAlpha: 1, scale: 1, duration: reduce ? 0.2 : 0.4, ease: "expo.out", overwrite: "auto" });
    };
    const hide = () => {
      gsap.to(el, { autoAlpha: 0, scale: reduce ? 1 : 0.4, duration: 0.2, ease: "power2.in", overwrite: "auto" });
    };
    const settle = (target: HTMLElement | null) => {
      if (target === active) return;
      active = target;
      if (target) show(target);
      else hide();
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // First contact: jump to the pointer instead of sweeping in from the corner.
      if (x < 0) gsap.set(el, { x: e.clientX, y: e.clientY });
      x = e.clientX;
      y = e.clientY;
      xTo(x);
      yTo(y);
      settle((e.target as Element | null)?.closest<HTMLElement>("[data-cursor]") ?? null);
    };
    // Scrolling moves content under a still pointer: re-test what is beneath it once per frame.
    let raf = 0;
    const onScroll = () => {
      if (raf || x < 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        settle(document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cursor]") ?? null);
      });
    };
    const onDown = () => active && !reduce && gsap.to(el, { scale: 0.86, duration: 0.12, ease: "power2.out", overwrite: "auto" });
    const onUp = () => {
      if (active && !reduce) gsap.to(el, { scale: 1, duration: 0.35, ease: "back.out(2.2)", overwrite: "auto" });
      // A click can move or hide its target (a volume leaving the shelf): look again once it has.
      window.setTimeout(() => settle(document.elementFromPoint(x, y)?.closest<HTMLElement>("[data-cursor]") ?? null), 80);
    };
    const onLeave = () => settle(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    root.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("mouseleave", onLeave);
      root.removeAttribute("data-view-cursor");
    };
  });

  return (
    <div ref={ref} className={styles.cursor} aria-hidden="true">
      <span ref={labelRef}>View</span>
    </div>
  );
}
