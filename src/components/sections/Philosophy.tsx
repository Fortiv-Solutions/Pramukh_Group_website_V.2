"use client";

import { useRef } from "react";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { coreValues, vision } from "@/content/site";
import styles from "./Philosophy.module.css";

const principles = [
  { title: "Premium within reach", body: vision },
  {
    title: "Transparency that performs",
    body: "We don’t believe in overpromising. We believe in consistent performance: staying focused, acting responsibly and delivering without unnecessary noise.",
  },
  {
    title: "Commitment to quality",
    body: "Quality construction was the first of three reasons the group was founded. Every project is well-planned, well-located and well-executed.",
  },
  {
    title: "Timely delivery",
    body: "To deliver what is promised, on time. Demand for our residential and commercial projects is a testament to quality construction and timely delivery.",
  },
  {
    title: "Trust, teamwork & excellence",
    body: `Our guiding principles: ${coreValues.join(", ").toLowerCase().replace(/^./, (c) => c.toUpperCase())}.`,
  },
  {
    title: "All-in Ownership™",
    body: "Owning every detail of every project, without compromise, and delivering with total commitment from start to finish.",
  },
];

export function Philosophy() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const track = q("[data-track]")[0] as HTMLElement;
        const distance = () => track.scrollWidth - track.clientWidth;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: "[data-pin]",
            start: "top top",
            end: () => `+=${distance() + window.innerHeight * 0.35}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        tl.to(track, { x: () => -distance(), ease: "none", duration: 1 }).to(
          "[data-progress]",
          { scaleX: 1, ease: "none", duration: 1 },
          0,
        );
        tl.to({}, { duration: 0.12 });
      });

      mm.add(MQ.motion, () => {
        gsap.from("[data-card]", {
          y: 80,
          autoAlpha: 0,
          duration: 1.3,
          stagger: 0.08,
          scrollTrigger: { trigger: "[data-track]", start: "top 88%", toggleActions: "play none none none" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="philosophy" data-nav-theme="light" className={styles.philosophy} aria-labelledby="philosophy-title">
      <div className={styles.pin} data-pin>
        <header className={`container ${styles.head}`}>
          <p className="eyebrow" data-reveal>
            Our philosophy
          </p>
          <SplitReveal as="h2" id="philosophy-title" className={`display ${styles.title}`}>
            Where excellence
            <br />
            is standard.
          </SplitReveal>
        </header>

        <ol className={styles.track} data-track>
          {principles.map((p, i) => (
            <li key={p.title} className={styles.card} data-card data-accent={i === principles.length - 1}>
              <span className={styles.num} aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.cardBody}>{p.body}</p>
            </li>
          ))}
        </ol>

        <div className={`container ${styles.progressWrap}`} aria-hidden="true">
          <div className={styles.progress}>
            <span data-progress />
          </div>
        </div>
      </div>
    </section>
  );
}
