"use client";

import { useRef } from "react";
import { Img } from "@/components/ui/Img";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useScroll } from "@/components/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP, MQ } from "@/lib/gsap";
import type { MediaKey } from "@/content/media";
import { officialLinks } from "@/content/site";
import styles from "./Build.module.css";

type Slide = { title: string; body: string; bg: MediaKey; inset: MediaKey; cta: string; href: string };

const slides: Slide[] = [
  {
    title: "Residential",
    body: "From 1.5 BHK apartments to riverside 5 BHK penthouses and 4 to 5 BHK bungalows: One Tapi and Agastya in Surat, Aristo and Swarit in Vapi, Shivanta in Silvassa and Marina Bay in Daman.",
    bg: "vedanta/hero",
    inset: "aranya-iii/night",
    cta: "Explore residences",
    href: officialLinks.projects,
  },
  {
    title: "Commercial",
    body: "Showrooms, offices, cafés and restaurants across Zenith, the Orbit series and Orbit Plaza in Surat, and Orbit in Vapi.",
    bg: "zenith/hero",
    inset: "orbit-5/tower",
    cta: "Explore commercial",
    href: officialLinks.surat,
  },
  {
    title: "Hospitality",
    body: "Two hotels in Surat: Lemon Tree, under development, and Treat, upcoming. The same care shapes the clubhouses and lounges inside our residences.",
    bg: "hospitality/lounge",
    inset: "hospitality/banquet",
    cta: "Explore Surat projects",
    href: officialLinks.surat,
  },
  {
    title: "Industrial Park",
    body: "Samruddhi: ongoing industrial plotting at Niyol, Surat, with residential plotting proposed at Anantara, Hazira.",
    bg: "land/banner",
    inset: "industrial/park",
    cta: "Enquire about plots",
    href: officialLinks.contact,
  },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function Build() {
  const root = useRef<HTMLElement>(null);
  const pinRef = useRef<ScrollTrigger | null>(null);
  const scroll = useScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      // One pinned stage at every size; louvres open each new background, cards trade places.
      // Phones scrub over a shorter distance so each slide takes a comfortable thumb-swipe or two.
      mm.add(MQ.motion, () => {
        const phone = window.innerWidth < 1024;
        const pace = phone ? 0.85 : 1.1;
        const bgs = q("[data-slide]");
        const cards = q("[data-card]");

        // The stage's opening crop repaints the whole screen each frame, so phones skip it.
        if (!phone)
          gsap.fromTo(
          "[data-stage]",
          { clipPath: "inset(0% 3.5% 0% 3.5% round 18px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: { trigger: "[data-stage]", start: "top bottom", end: "top top", scrub: true },
          },
        );

        gsap.set(cards.slice(1), { opacity: 0, yPercent: 14, pointerEvents: "none" });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-stage]",
            start: "top top",
            end: () => `+=${window.innerHeight * (slides.length - 1) * pace}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
        pinRef.current = tl.scrollTrigger ?? null;

        for (let i = 1; i < slides.length; i++) {
          const at = `s${i}`;
          tl.addLabel(at, i === 1 ? 0.15 : "+=0.25")
            .fromTo(
              bgs[i],
              phone ? { autoAlpha: 0 } : { "--louvre": "0%" },
              phone ? { autoAlpha: 1, duration: 1, ease: "power1.inOut", immediateRender: true } : { "--louvre": "104%", duration: 1, ease: "power2.inOut", immediateRender: true },
              at,
            )
            .fromTo(bgs[i].querySelector("img"), { scale: 1.16 }, { scale: 1, duration: 1.2 }, at)
            .to(bgs[i - 1].querySelector("img"), { scale: 1.08, duration: 1 }, at)
            .to(cards[i - 1], { opacity: 0, yPercent: -12, duration: 0.45, ease: "power2.in" }, at)
            .set(cards[i - 1], { pointerEvents: "none" }, `${at}+=0.3`)
            .to(cards[i], { opacity: 1, yPercent: 0, duration: 0.6, ease: "power3.out" }, `${at}+=0.4`)
            .set(cards[i], { pointerEvents: "auto" }, `${at}+=0.4`)
            .fromTo(
              cards[i].querySelector("[data-inset]"),
              { clipPath: "inset(0% 0% 100% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.out" },
              `${at}+=0.45`,
            );
        }
        tl.to({}, { duration: 0.35 });

        return () => {
          pinRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // Keyboard users reach every card: focusing one scrolls the pinned stage to it.
  const onCardFocus = (i: number) => () => {
    const st = pinRef.current;
    if (!st || Math.round(st.progress * (slides.length - 1)) === i) return;
    const target = st.start + (st.end - st.start) * (i / (slides.length - 1)) * 0.92;
    scroll.scrollTo(target);
  };

  return (
    <section ref={root} id="build" data-nav-theme="light" className={styles.build} aria-labelledby="build-title">
      <header className={`container ${styles.head}`}>
        <p className={`eyebrow ${styles.eyebrow}`} data-reveal>
          What we build
        </p>
        <SplitReveal as="h2" id="build-title" className={`display ${styles.title}`}>
          Every space, built with the same care
        </SplitReveal>
      </header>

      <div className={styles.stage} data-stage data-nav-theme="dark">
        {slides.map((s, i) => (
          <div key={s.title} className={styles.slideWrap} data-slide-wrap>
            <div className={`frame ${styles.bg}`} data-slide>
              <Img k={s.bg} sizes="100vw" quality={70} />
            </div>
            <article className={styles.card} data-card onFocus={onCardFocus(i)} aria-labelledby={`build-card-${i}`}>
              <p className={styles.count} aria-hidden="true">
                {pad(i + 1)} <span /> {pad(slides.length)}
              </p>
              <h3 id={`build-card-${i}`} className={styles.cardTitle}>
                {s.title}
              </h3>
              <div className={`frame ${styles.inset}`} data-inset>
                <Img k={s.inset} sizes="(max-width: 640px) 80vw, 340px" />
              </div>
              <p className={styles.cardBody}>{s.body}</p>
              <Button href={s.href} tone="outline" icon="external" external>
                {s.cta}
              </Button>
            </article>
          </div>
        ))}
        <p className={`${styles.side} ${styles.sideLeft} bracket`} aria-hidden="true">
          What we build
        </p>
        <p className={`${styles.side} ${styles.sideRight} bracket`} aria-hidden="true">
          Keep scrolling
        </p>
      </div>
    </section>
  );
}
