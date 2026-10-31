"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** "lines" rises each line from a mask; "words" staggers word by word. */
  by?: "lines" | "words";
  delay?: number;
  /** ScrollTrigger start. Pass false to play immediately (e.g. hero). */
  start?: string | false;
  stagger?: number;
  /** Hide the text until it is split. Off for text already concealed by other means (hero louvre). */
  preHide?: boolean;
};

/** Masked text reveal driven by SplitText. Text stays visible with reduced motion or no JS. */
export function SplitReveal({
  as: Tag = "div",
  children,
  className,
  id,
  by = "lines",
  delay = 0,
  start = "top 85%",
  stagger,
  preHide = true,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, (context) => {
        let split: SplitText | undefined;
        let offIntro = () => {};
        const create = context.add("split", () => {
          split = SplitText.create(el, {
            type: by === "lines" ? "lines" : "words,lines",
            mask: "lines",
            linesClass: "split-line",
            // aria-label is only valid on headings here; other tags keep their text readable as-is.
            aria: typeof Tag === "string" && /^h[1-6]$/.test(Tag) ? "auto" : "none",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { visibility: "visible" });
              self.masks?.forEach((m) => m.classList.add("split-mask"));
              const targets = by === "lines" ? self.lines : self.words;
              const tween = gsap.from(targets, {
                yPercent: 112,
                duration: 1.25,
                delay,
                stagger: stagger ?? (by === "lines" ? 0.09 : 0.035),
                ease: "expo.out",
                paused: start === false,
                scrollTrigger: start === false ? undefined : { trigger: el, start, toggleActions: "play none none none" },
              });
              // Entrance text: prepared now, played when the preloader hands over.
              if (start === false) {
                offIntro();
                offIntro = onIntroDone(() => tween.play());
              }
              return tween;
            },
          });
        }) as () => void;
        // Entrance text (start={false}) is split while still behind the preloader, so no layout work lands
        // on the hand-off frame; two frames first, so it is painted whole and registers as LCP.
        let raf = 0;
        if (start === false) raf = requestAnimationFrame(() => (raf = requestAnimationFrame(() => create())));
        else create();
        return () => {
          offIntro();
          cancelAnimationFrame(raf);
          split?.revert();
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id} data-split={preHide ? "hide" : "show"}>
      {children}
    </Tag>
  );
}
