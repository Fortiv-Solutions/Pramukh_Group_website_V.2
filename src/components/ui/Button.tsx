"use client";

import { useRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./Button.module.css";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  tone?: "light" | "dark" | "outline" | "outline-light" | "nav";
  icon?: "arrow" | "external" | "down";
  external?: boolean;
  /** Pull towards the cursor on fine pointers. */
  magnetic?: boolean;
};

export function Arrow({ dir = "right" }: { dir?: "right" | "up-right" | "down" | "left" }) {
  const rotate = { right: 0, "up-right": -45, down: 90, left: 180 }[dir];
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M3 10h13M11 4.5 16.5 10 11 15.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/** Two stacked arrows: on hover the first leaves along its heading and the second arrives behind it. */
function SwapArrow({ dir }: { dir: "right" | "up-right" | "down" }) {
  return (
    <span className={styles.swap} data-dir={dir} aria-hidden="true">
      <Arrow dir={dir} />
      <Arrow dir={dir} />
    </span>
  );
}

/** Label split into letters that roll up one after another (the copy below is a text-shadow). */
function RollLabel({ children }: { children: ReactNode }) {
  if (typeof children !== "string") return <span className={styles.label}>{children}</span>;
  return (
    <span className={styles.label}>
      <span className="sr-only">{children}</span>
      <span className={styles.roll} aria-hidden="true">
        {[...children].map((ch, i) => (
          <span key={i} className={styles.char} style={{ "--i": i } as CSSProperties}>
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </span>
  );
}

/** Subtle cursor attraction; springs back on leave. Fine pointers with motion allowed only. */
function useMagnetic(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useGSAP(
    (_, contextSafe) => {
      const el = ref.current;
      if (!enabled || !el) return;
      if (!window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
      const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });
      const move = contextSafe!((e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.32);
      });
      const leave = contextSafe!(() => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: true });
      });
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { dependencies: [enabled] },
  );
}

/** Pill link: fill sweep, letter roll, arrow swap, magnetic pull and press feedback. */
export function Button({ children, tone = "light", icon = "arrow", external, magnetic = true, className, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  useMagnetic(ref, magnetic);
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a ref={ref} className={`${styles.btn} ${styles[tone]} ${className ?? ""}`} {...ext} {...rest}>
      <RollLabel>{children}</RollLabel>
      <span className={styles.icon}>
        <SwapArrow dir={icon === "external" ? "up-right" : icon === "down" ? "down" : "right"} />
      </span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/** The pill as a form button: same fill sweep, letter roll and arrow swap, without the magnetic pull. */
export function SubmitButton({
  children,
  tone = "dark",
  className,
  ...rest
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & { children: string; tone?: Props["tone"] }) {
  return (
    <button type="submit" className={`${styles.btn} ${styles[tone]} ${className ?? ""}`} {...rest}>
      <RollLabel>{children}</RollLabel>
      <span className={styles.icon}>
        <SwapArrow dir="right" />
      </span>
    </button>
  );
}

/** Understated text link: the underline wipes out and redraws, the arrow swaps. */
export function TextLink({ children, external, className, ...rest }: Omit<Props, "tone" | "icon" | "magnetic">) {
  const ext = external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a className={`${styles.text} ${className ?? ""}`} {...ext} {...rest}>
      <span>{children}</span>
      <SwapArrow dir={external ? "up-right" : "right"} />
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}
