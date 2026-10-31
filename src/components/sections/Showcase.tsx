"use client";

import { useRef, useState } from "react";
import { Img } from "@/components/ui/Img";
import { TextLink } from "@/components/ui/Button";
import { useScroll } from "@/components/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import { showcase } from "@/content/projects";
import styles from "./Showcase.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const MARQUEE = "Creating spaces that stand the test of time";

export function Showcase() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const marksRef = useRef<number[]>([]);
  const [active, setActive] = useState(0);
  const scroll = useScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(MQ.motion, () => {
        gsap.fromTo(
          "[data-marquee]",
          { xPercent: 8 },
          {
            xPercent: -42,
            ease: "none",
            scrollTrigger: { trigger: "[data-marquee-wrap]", start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });

      // The same pinned, layered stage at every size. Phones get a full-screen photo with the text sliding
      // up over it, a shorter scrub distance and a gentler parallax.
      mm.add(MQ.motion, () => {
        const phone = window.innerWidth < 1024;
        const pace = phone ? 0.9 : 1.15;
        const layers = q("[data-sc-layer]");
        const infos = q("[data-sc-info]");
        const n = layers.length;

        gsap.set(layers.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });
        gsap.set(infos.slice(1), { opacity: 0, y: 40, pointerEvents: "none" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-sc-stage]",
            start: "top top",
            end: () => `+=${window.innerHeight * (n - 1) * pace}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: () => {
              const t = tl.time();
              const idx = marksRef.current.filter((m) => t >= m).length;
              setActive((a) => (a === idx ? a : idx));
            },
          },
        });
        pinRef.current = tl.scrollTrigger ?? null;
        marksRef.current = [];

        for (let i = 1; i < n; i++) {
          const at = `p${i}`;
          tl.addLabel(at, i === 1 ? 0.2 : "+=0.3");
          marksRef.current.push(tl.labels[at] + 0.5);
          tl.to(layers[i], { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power2.inOut" }, at)
            .fromTo(layers[i].querySelector("[data-sc-inset]"), { yPercent: phone ? 6 : 18, scale: phone ? 1.14 : 1.08 }, { yPercent: 0, scale: 1, duration: 1.1, ease: "power2.out" }, at)
            .to(layers[i - 1].querySelector("[data-sc-inset]"), { yPercent: phone ? -4 : -10, duration: 1 }, at)
            .to(infos[i - 1], { opacity: 0, y: -40, duration: 0.45, ease: "power2.in" }, at)
            .set(infos[i - 1], { pointerEvents: "none" }, `${at}+=0.45`)
            .to(infos[i], { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, `${at}+=0.45`)
            .set(infos[i], { pointerEvents: "auto" }, `${at}+=0.45`);
        }
        tl.to({}, { duration: 0.3 });

        return () => {
          pinRef.current = null;
          setActive(0);
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const jumpTo = (i: number, onlyIfHidden = false) => {
    const st = pinRef.current;
    if (!st || (onlyIfHidden && i === active)) return;
    const progress = i === 0 ? 0 : (marksRef.current[i - 1] + 0.05) / (st.animation?.duration() ?? 1);
    scroll.scrollTo(st.start + (st.end - st.start) * progress);
  };

  return (
    <section ref={root} id="featured" data-nav-theme="light" className={styles.showcase} aria-labelledby="featured-title">
      <div className={styles.marqueeWrap} data-marquee-wrap aria-hidden="true">
        <p className={`display ${styles.marquee}`} data-marquee>
          {MARQUEE}
          <span className={styles.star}>✱</span>
          {MARQUEE}
        </p>
      </div>

      <h2 id="featured-title" className="sr-only">
        Featured projects
      </h2>

      <div className={styles.stage} data-sc-stage data-nav-theme="dark">
        <ol className={styles.index} aria-label="Featured projects">
          {showcase.map((p, i) => (
            <li key={p.slug}>
              <button type="button" onClick={() => jumpTo(i)} aria-current={active === i ? "true" : undefined}>
                <span>[ N.{pad(i + 1)} ]</span>
                {p.name}
              </button>
            </li>
          ))}
        </ol>

        {showcase.map((p, i) => (
          <article key={p.slug} className={styles.item} data-sc-item aria-labelledby={`sc-${p.slug}`}>
            <div className={styles.visual} data-sc-layer data-variant={i % 4} style={{ zIndex: i + 1 }}>
              <div className={`frame ${styles.backdrop}`}>
                <Img k={p.image} sizes="(max-width: 1023px) 1px, 58vw" quality={70} />
              </div>
              <div className={`frame ${styles.inset}`} data-sc-inset>
                <Img k={p.image} sizes="(max-width: 1023px) 100vw, 46vw" />
                {/* Pointer shortcut to the project page; keyboard and screen readers use the text link. */}
                <a href={p.href} target="_blank" rel="noopener noreferrer" className={styles.photoLink} data-cursor="View" tabIndex={-1} aria-hidden="true" />
              </div>
            </div>

            <div className={styles.info} data-sc-info style={{ zIndex: i + 1 }} onFocus={() => jumpTo(i, true)}>
              <span className={styles.number} aria-hidden="true">
                {pad(i + 1)}
              </span>
              <div className={styles.infoBody}>
                <h3 id={`sc-${p.slug}`} className={`display ${styles.name}`}>
                  {p.name}
                </h3>
                <p className={styles.location}>
                  {p.locality}, {p.city}
                </p>
                {p.headline && (
                  <p className={styles.headline}>
                    {p.headline}
                  </p>
                )}
                <p className={styles.desc}>
                  {p.description}
                </p>
                <dl className={styles.facts}>
                  <div>
                    <dt>Category</dt>
                    <dd>{p.category}</dd>
                  </div>
                  <div>
                    <dt>Configuration</dt>
                    <dd>{p.configuration}</dd>
                  </div>
                  {p.status && (
                    <div>
                      <dt>Status</dt>
                      <dd>{p.status}</dd>
                    </div>
                  )}
                </dl>
              </div>
              <TextLink href={p.href} external className={styles.more}>
                Explore {p.name}
              </TextLink>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
