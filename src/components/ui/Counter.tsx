"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "@/lib/gsap";

type Props = { value: number; suffix?: string; decimals?: number; className?: string };

const format = (n: number, decimals: number) =>
  n.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

/** Counts up once when scrolled into view. Server-renders the final value. */
export function Counter({ value, suffix = "", decimals = 0, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const state = { n: 0 };
        el.textContent = format(0, decimals);
        gsap.to(state, {
          n: value,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          onUpdate: () => {
            el.textContent = format(state.n, decimals);
          },
        });
        return () => {
          el.textContent = format(value, decimals);
        };
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <span className={className}>
      <span className="sr-only">{`${format(value, decimals)}${suffix}`}</span>
      <span ref={ref} aria-hidden="true">
        {format(value, decimals)}
      </span>
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}
