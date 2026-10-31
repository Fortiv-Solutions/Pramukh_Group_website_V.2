"use client";

import { useRef } from "react";
import { TextLink } from "@/components/ui/Button";
import { Counter } from "@/components/ui/Counter";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, SplitText, useGSAP, MQ } from "@/lib/gsap";
import { officialLinks, stats } from "@/content/site";
import styles from "./Intro.module.css";

export function Intro() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Statement: words ink in as you read down the section.
        const statement = root.current!.querySelector<HTMLElement>("[data-statement]")!;
        const split = SplitText.create(statement, { type: "words", aria: "none" });
        gsap.fromTo(
          split.words,
          { opacity: 0.16 },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.05,
            scrollTrigger: { trigger: statement, start: "top 82%", end: "bottom 52%", scrub: true },
          },
        );

        gsap.from("[data-stat]", {
          y: 60,
          autoAlpha: 0,
          duration: 1.3,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-stats]", start: "top 88%", toggleActions: "play none none none" },
        });
        gsap.from("[data-fade]", {
          y: 24,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-fade]", start: "top 90%", toggleActions: "play none none none" },
        });

        return () => split.revert();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" data-nav-theme="light" className={styles.intro} aria-labelledby="about-title">
      <div className="container">
        <div className={styles.meta} aria-hidden="true">
          <span data-reveal>Pramukh Group</span>
          <span data-reveal>A class of its own</span>
          <span data-reveal>Established in 1993</span>
        </div>

        <div className={styles.grid}>
          <div className={styles.side}>
            <p className={`eyebrow ${styles.label}`} data-reveal>
              About Pramukh
            </p>
            <div className={styles.sideBody}>
              <SplitReveal as="h2" id="about-title" className={`display ${styles.heading}`}>
                More than three decades of building trust.
              </SplitReveal>
              <p className={styles.small} data-fade>
                Established in 1993 and formerly known as PDPL Group, Pramukh was founded by Shri. Natubhai R. Bhatu
                for three reasons: to provide quality construction, to deliver what is promised on time, and to offer
                value for money. The group has kept those promises ever since.
              </p>
            </div>
          </div>

          <div className={styles.main}>
            <p className={styles.statement} data-statement>
              By delivering Gujarat&rsquo;s finest residential and commercial spaces, Pramukh Group has carved a niche
              across Surat, Vapi, Silvassa and Daman, with every project well-planned, well-located and well-executed.
            </p>
            <div data-fade>
              <TextLink href={officialLinks.about} external>
                Our story
              </TextLink>
            </div>
          </div>
        </div>

        <ul className={styles.stats} data-stats aria-label="Pramukh Group in numbers">
          {stats.map((s) => (
            <li key={s.label} className={styles.stat} data-stat>
              <Counter value={s.value} suffix={s.suffix} className={styles.statValue} />
              <span className={styles.statLabel}>{s.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
