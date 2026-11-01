"use client";

import { useRef } from "react";
import { logoPaths } from "@/components/brand/logo-paths";
import { MonogramWatermark } from "@/components/nav/MonogramWatermark";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useScroll } from "@/components/SmoothScroll";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { builtBy, nav, officialLinks, offices, socials, telHref, whatsappHref } from "@/content/site";
import styles from "./Footer.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The closing: a statement with its two invitations and a "speak with us" card; the three offices as a
 * numbered directory with the social links; and one quiet base row. Behind it all, the monogram watermark (a soft glow and a fine gold outline).
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
        gsap.from("[data-speak]", {
          y: 40,
          opacity: 0,
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-speak]", start: "top 88%", toggleActions: "play none none none" },
        });
        gsap.from("[data-office]", {
          y: 36,
          opacity: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-offices]", start: "top 88%", toggleActions: "play none none none" },
        });
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
  const main = offices[0];

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

      {/* Invitation */}
      <div className={`container ${styles.cta}`}>
        <div className={styles.lead}>
          <p className={styles.eyebrow} data-reveal>
            <span className={styles.dot} aria-hidden="true" />
            Contact
          </p>
          <SplitReveal as="h2" id="contact-title" className={`display ${styles.title}`}>
            Let&rsquo;s build something that <span className={styles.accent}>lasts.</span>
          </SplitReveal>
          <p className={styles.lede} data-reveal>
            Discover the Pramukh approach to creating spaces that stand the test of time.
          </p>
          <div className={styles.actions} data-reveal>
            <Button
              href="#enquire"
              tone="light"
              onClick={(e) => {
                e.preventDefault();
                scroll.scrollTo("#enquire");
              }}
            >
              Schedule a private visit
            </Button>
            <Button href={officialLinks.contact} tone="outline-light" external>
              Start a conversation
            </Button>
          </div>
        </div>

        <aside className={styles.speakShell} data-speak aria-label="Speak with us">
          <div className={styles.speak}>
            <p className={styles.speakLabel}>Speak with us</p>
            <a href={telHref(main.phone)} className={`display ${styles.speakPhone}`}>
              {main.phone}
            </a>
            <p className={styles.speakNote}>{main.city} office</p>
            <div className={styles.speakLinks}>
              <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={styles.pill}>
                WhatsApp
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={`mailto:${main.email}`} className={styles.pill}>
                {main.email}
              </a>
            </div>
          </div>
        </aside>
      </div>

      {/* Directory */}
      <div className={`container ${styles.directory}`}>
        <ul className={styles.offices} data-offices aria-label="Pramukh offices">
          {offices.map((o, i) => (
            <li key={o.city} className={styles.office} data-office>
              <span className={styles.officeIndex}>{pad(i + 1)}</span>
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
            <span className={styles.officeIndex}>{pad(offices.length + 1)}</span>
            <h3 className={`display ${styles.city}`}>Follow</h3>
            <ul className={styles.socials}>
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M6 14 14 6M7.5 6H14v6.5" />
                    </svg>
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
