"use client";

import { gsap, ScrollTrigger, SplitText, useGSAP, MQ } from "@/lib/gsap";

/**
 * One entrance system for text that has no choreography of its own.
 *
 *   data-reveal            rises 28px and fades in; siblings entering together stagger
 *                          (JSX renders a bare data-reveal as the value "true", so that is matched too)
 *   data-reveal="lines"    splits into lines that rise out of masks (paragraphs)
 *   data-reveal-at="mobile" only below 1024px (e.g. text that is pinned/crossfaded on desktop)
 *
 * Mounted after every section so its triggers are measured with all pin spacing in place.
 */
export function TextReveals() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    const setup = (scope: "all" | "mobile") => () => {
      const pick = (sel: string) =>
        gsap.utils
          .toArray<HTMLElement>(sel)
          .filter((el) => (scope === "mobile" ? el.dataset.revealAt === "mobile" : el.dataset.revealAt !== "mobile"));

      // Soft rise, batched so neighbours entering together cascade.
      const soft = pick('[data-reveal=""], [data-reveal="true"], [data-reveal="up"]');
      if (soft.length) gsap.set(soft, { autoAlpha: 0, y: 28 });
      const batches = !soft.length ? [] : ScrollTrigger.batch(soft, {
        start: "top 90%",
        onEnter: (els) =>
          gsap.to(els, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08, ease: "expo.out", overwrite: true }),
      });
      // Safety net: text in the last screenful (the footer's base row) may never climb above the 90% line,
      // so reaching the end of the page reveals whatever is still waiting.
      const endGuard = !soft.length
        ? null
        : ScrollTrigger.create({
            trigger: document.body,
            start: "bottom bottom+=80",
            onEnter: () =>
              gsap.to(soft, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.06, ease: "expo.out", overwrite: "auto" }),
          });

      // Line reveal for paragraphs. Once a paragraph has risen it stays put, even if it is re-split later.
      const risen = new WeakSet<HTMLElement>();
      const splits = pick('[data-reveal="lines"]').map((el) =>
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          aria: "none",
          autoSplit: true,
          onSplit: (self) =>
            risen.has(el)
              ? undefined
              : gsap.from(self.lines, {
                  yPercent: 105,
                  duration: 1.1,
                  stagger: 0.08,
                  ease: "expo.out",
                  scrollTrigger: {
                    trigger: el,
                    start: "top 88%",
                    toggleActions: "play none none none",
                    onEnter: () => risen.add(el),
                  },
                }),
        }),
      );

      return () => {
        batches.forEach((t) => t.kill());
        endGuard?.kill();
        splits.forEach((s) => s.revert());
      };
    };
    mm.add(MQ.motion, setup("all"));
    mm.add(`${MQ.mobile} and ${MQ.motion}`, setup("mobile"));
    return () => mm.revert();
  });
  return null;
}
