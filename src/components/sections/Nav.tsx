"use client";

import { useEffect, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/Logo";
import { useScroll } from "@/components/SmoothScroll";
import { Button } from "@/components/ui/Button";
import { MonogramWatermark } from "@/components/nav/MonogramWatermark";
import { gsap, ScrollTrigger, useGSAP, MQ, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { menuColumns, socials, type MenuLink } from "@/content/site";
import styles from "./Nav.module.css";

/**
 * Two-step menu (after the reference): over the hero the bar is transparent and full width; past the
 * hero it freezes as a light floating pill. Step one: hovering the pill widens it to full width and the
 * full logo returns. Step two: Menu drops the pill open into a three-column panel.
 */
export function Nav() {
  const root = useRef<HTMLElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);
  const [solid, setSolid] = useState(false);
  const scroll = useScroll();

  // Entrance after the preloader, and the hero → solid switch.
  useGSAP(
    () => {
      const el = root.current!;
      gsap.matchMedia().add(MQ.motion, () => {
        // clearProps: a lingering transform would make the header a containing block for fixed children.
        const enter = gsap
          .timeline({ paused: true })
          .from(el, { yPercent: -140, autoAlpha: 0, duration: 1.2, clearProps: "transform,opacity,visibility" }, 0.9);
        return onIntroDone(() => enter.play());
      });
      const past = () => window.scrollY > window.innerHeight * 0.85;
      const st = ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: () => setSolid(past()),
        onRefresh: () => setSolid(past()),
      });
      setSolid(past());
      return () => st.kill();
    },
    { scope: root },
  );

  // Step two: drop the panel open / fold it away.
  useGSAP(
    (_, contextSafe) => {
      const panel = panelRef.current!;
      const rm = prefersReducedMotion();
      const d = (s: number) => (rm ? 0 : s);
      const q = gsap.utils.selector(panel);
      const run = contextSafe!(() => {
        gsap.killTweensOf([panel, ...q("[data-m-card]"), ...q("[data-m-row]"), ...q("[data-m-line]")]);
        if (open) {
          gsap
            .timeline()
            .set(panel, { visibility: "visible" })
            .fromTo(panel, { height: 0 }, { height: "auto", duration: d(0.7), ease: "expo.out" }, d(0.12))
            .fromTo(q("[data-m-card]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: d(0.55), stagger: 0.06, ease: "power3.out" }, d(0.2))
            .fromTo(
              q("[data-m-row]"),
              { opacity: 0, y: 10, filter: "blur(4px)" },
              { opacity: 1, y: 0, filter: "blur(0px)", duration: d(0.5), stagger: 0.03, ease: "power3.out" },
              d(0.28),
            )
            .fromTo(q("[data-m-line]"), { scaleX: 0 }, { scaleX: 1, duration: d(0.7), stagger: 0.03, ease: "expo.out" }, d(0.3))
            .fromTo(q("[data-watermark-stroke]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: d(2), ease: "power2.inOut" }, d(0.3))
            .fromTo(q("[data-watermark-fill]"), { opacity: 0 }, { opacity: 0.05, duration: d(1), ease: "power1.out" }, d(1.2));
        } else {
          gsap
            .timeline()
            .to([...q("[data-m-card]"), ...q("[data-m-row]")], { opacity: 0, y: -6, duration: d(0.2), ease: "power1.in" })
            .to(panel, { height: 0, duration: d(0.5), ease: "power3.inOut" }, d(0.08))
            .set(panel, { visibility: "hidden" });
        }
      });
      run();
    },
    { scope: root, dependencies: [open] },
  );

  useEffect(() => {
    if (!open) {
      scroll.start();
      return;
    }
    scroll.stop();
    const id = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true }), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const nodes = Array.from(shellRef.current!.querySelectorAll<HTMLElement>("a, button"));
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(id);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, scroll]);

  const go = (href: string) => (e: React.MouseEvent) => {
    if (!href.startsWith("#")) {
      setOpen(false);
      return; // external: let the browser open it
    }
    e.preventDefault();
    setOpen(false);
    // #top is the sticky hero, which always reports itself at the viewport top, so scroll to 0 instead.
    const target = href === "#top" ? 0 : href;
    window.setTimeout(() => scroll.scrollTo(target), open ? 420 : 0);
    history.replaceState(null, "", href);
  };

  const fine = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const wide = !solid || open || hover;

  return (
    <header ref={root} className={styles.nav} data-solid={solid || open} data-wide={wide} data-open={open}>
      <button
        type="button"
        className={styles.scrim}
        aria-hidden="true"
        tabIndex={-1}
        onClick={() => setOpen(false)}
      />
      <div
        ref={shellRef}
        className={styles.shell}
        onPointerEnter={() => fine() && setHover(true)}
        onPointerLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHover(false)}
      >
        <div className={styles.bar} data-nav-bar>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={styles.burger} aria-hidden="true">
              <i />
              <i />
            </span>
            <span className={styles.toggleLabel} aria-hidden="true">
              <span>Menu</span>
              <span>Close</span>
            </span>
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
          </button>

          <a href="#top" className={styles.logo} onClick={go("#top")} aria-label="Pramukh Group, back to top">
            <BrandLogo className={styles.logoSvg} title={null} />
          </a>

          <Button href="#enquire" tone="nav" className={styles.cta} onClick={go("#enquire")}>
            Enquire
          </Button>
        </div>

        <nav ref={panelRef} id="site-menu" className={styles.panel} aria-label="Site menu" aria-hidden={!open} inert={!open}>
          {/* data-lenis-prevent: page scroll is stopped while open, so Lenis must let this list scroll natively. */}
          <div className={styles.columns} data-lenis-prevent>
            {menuColumns.map((col) => (
              <div key={col.title} className={styles.col} data-card={col.card} data-m-card>
                {!col.card && <MonogramWatermark className={styles.wm} />}
                <p className={styles.colTitle} data-m-row>
                  {col.title}
                </p>
                <ul className={col.twoUp ? styles.twoUp : undefined}>
                  {col.links.map((l) => (
                    <li key={l.label} className={styles.row} data-m-row>
                      <MenuRow link={l} onClick={go(l.href)} />
                    </li>
                  ))}
                </ul>
                {col.socials && (
                  <div className={styles.socials} data-m-row>
                    {socials.map((s) => (
                      <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} (opens in a new tab)`}>
                        <SocialIcon name={s.label} />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

/** A menu row: label with optional count or badge; a hairline below that a hover line sweeps across. */
function MenuRow({ link, onClick }: { link: MenuLink; onClick: (e: React.MouseEvent) => void }) {
  const ext = link.external ? { target: "_blank", rel: "noopener noreferrer" } : {};
  return (
    <a href={link.href} className={styles.link} onClick={onClick} {...ext}>
      <span className={styles.linkLabel}>{link.label}</span>
      {link.count !== undefined && (
        <sup className={styles.count}>
          {link.count}
          <span className="sr-only"> ongoing projects</span>
        </sup>
      )}
      {link.badge && <span className={styles.badge}>{link.badge}</span>}
      {link.external && <span className="sr-only"> (official page, opens in a new tab)</span>}
      <span className={styles.line} data-m-line aria-hidden="true" />
    </a>
  );
}

function SocialIcon({ name }: { name: string }) {
  const p = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, "aria-hidden": true } as const;
  switch (name) {
    case "Instagram":
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </svg>
      );
    case "Facebook":
      return (
        <svg {...p}>
          <path d="M14 8.5h2.5V5H14c-2.2 0-3.5 1.5-3.5 3.6V11H8v3.4h2.5V21H14v-6.6h2.4L17 11h-3V9.1c0-.4.3-.6.6-.6z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg {...p}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="2.5" />
          <path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.6 2.3-2.6s2.2.9 2.2 2.6V16" />
        </svg>
      );
    default:
      return (
        <svg {...p}>
          <rect x="2.8" y="5.5" width="18.4" height="13" rx="4" />
          <path d="M10.3 9.4v5.2l4.4-2.6z" fill="currentColor" />
        </svg>
      );
  }
}
