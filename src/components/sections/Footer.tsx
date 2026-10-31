"use client";

import { useRef } from "react";
import { logoPaths } from "@/components/brand/logo-paths";
import { MonogramWatermark } from "@/components/nav/MonogramWatermark";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useScroll } from "@/components/SmoothScroll";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { builtBy, nav, officialLinks, offices, socials, telHref } from "@/content/site";
import styles from "./Footer.module.css";

/**
 * Closing section after the fromanother footer: a statement and call to action on the left, the
 * offices as a grid on the right, one quiet base row. Behind it, the Pramukh monogram as a watermark:
 * a soft blurred glow plus a fine gold outline that draws itself in.
 */
export function Footer() {
  const root = useRef<HTMLElement>(null);
  const scroll = useScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const enter = { trigger: root.current, start: "top 70%", toggleActions: "play none none none" };
        gsap.fromTo("[data-foot-glow]", { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 2.4, ease: "expo.out", scrollTrigger: enter });
        gsap.fromTo("[data-watermark-stroke]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.8, ease: "power2.inOut", scrollTrigger: enter });
        gsap.fromTo("[data-watermark-fill]", { opacity: 0 }, { opacity: 0.05, duration: 1.4, delay: 1.6, scrollTrigger: enter });
        gsap.from("[data-office]", {
          y: 36,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-offices]", start: "top 85%", toggleActions: "play none none none" },
        });
        // The watermark drifts slower than the page: a hint of depth.
        gsap.fromTo(
          "[data-foot-mark]",
          { yPercent: 8 },
          { yPercent: -4, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true } },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const year = new Date().getFullYear();
  const [x, y, w, h] = logoPaths.mark.box;

  return (
    <footer ref={root} id="contact" data-nav-theme="dark" className={styles.footer} aria-labelledby="contact-title">
      <div className={styles.mark} data-foot-mark aria-hidden="true">
        {/* The wrapper is what animates, so the glow keeps its own faint opacity from CSS. */}
        <span className={styles.glowWrap} data-foot-glow>
          <svg className={styles.glow} viewBox={`${x} ${y} ${w} ${h}`}>
            <path d={logoPaths.mark.paths[0]} />
          </svg>
        </span>
        <MonogramWatermark className={styles.outline} />
      </div>

      <div className={`container ${styles.main}`}>
        <div className={styles.lead}>
          <SplitReveal as="h2" id="contact-title" className={`display ${styles.title}`}>
            Let&rsquo;s build something that <span className={styles.accent}>lasts.</span>
          </SplitReveal>
          <p className={styles.lede} data-reveal>
            Discover the Pramukh approach to creating spaces that stand the test of time.
          </p>
          <div data-reveal>
            <Button href={officialLinks.contact} tone="light" external>
              Start a conversation
            </Button>
          </div>
        </div>

        <ul className={styles.offices} data-offices aria-label="Pramukh offices">
          {offices.map((o) => (
            <li key={o.city} className={styles.office} data-office>
              <OfficeMark />
              <h3 className={`display ${styles.city}`}>{o.city}</h3>
              <address className={styles.addr}>
                {o.lines.map((l) => (
                  <span key={l}>{l}</span>
                ))}
              </address>
              <a href={telHref(o.phone)} className={styles.contact}>
                {o.phone}
              </a>
              <a href={`mailto:${o.email}`} className={styles.contact}>
                {o.email}
              </a>
            </li>
          ))}
          <li className={styles.office} data-office>
            <OfficeMark />
            <h3 className={`display ${styles.city}`}>Follow</h3>
            <ul className={styles.socials}>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>

      <div className={`container ${styles.base}`}>
        <nav aria-label="Footer" className={styles.baseLinks} data-reveal>
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={(e) => {
                e.preventDefault();
                scroll.scrollTo(n.href);
              }}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className={styles.baseLinks} data-reveal>
          <a href="https://pramukh.com/maharera-and-gujrera.html" target="_blank" rel="noopener noreferrer">
            MahaRERA &amp; GujRERA
          </a>
          <a href="https://pramukh.com/privacy-policy.html" target="_blank" rel="noopener noreferrer">
            Privacy policy
          </a>
        </div>
        <p className={styles.copy}>
          <span>&copy; {year} Pramukh Group. All rights reserved.</span>
          <span className={styles.credit}>
            Built by{" "}
            <a href={builtBy.href} target="_blank" rel="noopener noreferrer">
              {builtBy.name}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}

/** A fine location pin marking each office, after the reference's location marks. */
function OfficeMark() {
  return (
    <svg className={styles.officeMark} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21.5s-6.5-6.1-6.5-11.2a6.5 6.5 0 0 1 13 0c0 5.1-6.5 11.2-6.5 11.2z" />
      <circle cx="12" cy="10.2" r="2.2" />
    </svg>
  );
}
