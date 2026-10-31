"use client";

import { useMemo, useRef, useState } from "react";
import { Img } from "@/components/ui/Img";
import { Arrow, TextLink } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { projects, type City } from "@/content/projects";
import { officialLinks } from "@/content/site";
import styles from "./Portfolio.module.css";

const FILTERS: ("All" | City)[] = ["All", "Surat", "Vapi", "Silvassa", "Daman"];

export function Portfolio() {
  const root = useRef<HTMLElement>(null);
  const [city, setCity] = useState<(typeof FILTERS)[number]>("All");
  const [active, setActive] = useState(projects[0].slug);
  // Preview images mount the first time a project is shown, so they load on demand.
  const [seen, setSeen] = useState<string[]>([projects[0].slug]);

  const list = useMemo(() => (city === "All" ? projects : projects.filter((p) => p.city === city)), [city]);
  const current = projects.find((p) => p.slug === active)!;

  const activate = (slug: string) => {
    if (slug === active) return;
    setSeen((s) => (s.includes(slug) ? s : [...s, slug]));
    setActive(slug);
  };

  const choose = (f: (typeof FILTERS)[number]) => {
    setCity(f);
    const first = f === "All" ? projects[0] : projects.find((p) => p.city === f);
    if (first) activate(first.slug);
  };

  // Section entrance.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-preview]", {
          clipPath: "inset(14% 10% 14% 10% round 18px)",
          duration: 1.8,
          scrollTrigger: { trigger: "[data-preview]", start: "top 85%", toggleActions: "play none none none" },
        });
        gsap.from("[data-head-fade]", {
          y: 24,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-head-fade]", start: "top 88%", toggleActions: "play none none none" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Rows stagger in whenever the filter changes (and on first view).
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-row]", {
          y: 34,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.05,
          scrollTrigger: { trigger: "[data-rows]", start: "top 85%", toggleActions: "play none none none" },
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [city], revertOnUpdate: true },
  );

  // Wipe the newly active image up over the previous one.
  useGSAP(
    () => {
      const el = root.current!.querySelector<HTMLElement>(`[data-preview-item="${active}"]`);
      if (!el) return;
      root.current!.querySelectorAll<HTMLElement>("[data-preview-item]").forEach((n) => {
        n.dataset.layer = n.dataset.layer === "top" ? "prev" : "base";
      });
      el.dataset.layer = "top";
      if (window.matchMedia(MQ.reduce).matches) return;
      gsap.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out", overwrite: true });
      gsap.fromTo(el.querySelector("img"), { scale: 1.18 }, { scale: 1, duration: 1.6, ease: "expo.out", overwrite: true });
    },
    { scope: root, dependencies: [active] },
  );

  return (
    <section ref={root} id="projects" data-nav-theme="light" className={styles.portfolio} aria-labelledby="projects-title">
      <div className="container">
        <header className={styles.head}>
          <p className={`eyebrow ${styles.eyebrow}`} data-head-fade>
            Projects
          </p>
          <SplitReveal as="h2" id="projects-title" className={`display ${styles.title}`}>
            Projects across Surat, Vapi, Silvassa &amp; Daman
          </SplitReveal>
          <div className={styles.headAside}>
            <p data-head-fade>
              Residential and commercial developments, ongoing and ready to move. Each project opens its official page
              with plans, amenities and availability.
            </p>
            <div className={styles.filters} role="group" aria-label="Filter projects by city" data-head-fade>
              {FILTERS.map((f) => {
                const count = f === "All" ? projects.length : projects.filter((p) => p.city === f).length;
                return (
                  <button key={f} type="button" aria-pressed={city === f} onClick={() => choose(f)} className={styles.filter}>
                    {f}
                    <sup>{count}</sup>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.previewCol} aria-hidden="true">
            <div className={styles.preview} data-preview>
              {projects
                .filter((p) => seen.includes(p.slug))
                .map((p) => (
                  <div key={p.slug} className={`frame ${styles.previewItem}`} data-preview-item={p.slug}>
                    <Img k={p.image} sizes="(max-width: 1023px) 1px, 40vw" />
                  </div>
                ))}
              {/* Pointer shortcut to the previewed project; the rows are the keyboard route. */}
              <a href={current.href} target="_blank" rel="noopener noreferrer" className={styles.previewLink} data-cursor="View" tabIndex={-1} />
              <div className={styles.previewCaption}>
                <span>
                  {current.locality !== current.city ? `${current.locality}, ` : ""}
                  {current.city}
                </span>
                {current.status && <span className={styles.previewStatus}>{current.status}</span>}
              </div>
            </div>
          </div>

          <ul className={styles.rows} data-rows>
            {list.map((p) => (
              <li key={p.slug} className={styles.row} data-row data-active={p.slug === active}>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.rowLink}
                  onMouseEnter={() => activate(p.slug)}
                  onFocus={() => activate(p.slug)}
                >
                  <div className={`frame ${styles.thumb}`}>
                    <Img k={p.image} sizes="(max-width: 1023px) 80vw, 1px" />
                  </div>
                  <span className={styles.rowName}>{p.name}</span>
                  <span className={styles.rowCity}>
                    {p.city}
                    {p.locality !== p.city && <em> · {p.locality}</em>}
                  </span>
                  <span className={styles.rowConfig}>{p.configuration}</span>
                  <span className={styles.rowStatus}>{p.status ?? p.category}</span>
                  <span className={styles.rowArrow} aria-hidden="true">
                    <Arrow dir="up-right" />
                  </span>
                  <span className="sr-only"> (official project page, opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.foot} data-head-fade>
          <TextLink href={officialLinks.projects} external>
            All projects, including completed
          </TextLink>
        </div>
      </div>
    </section>
  );
}
