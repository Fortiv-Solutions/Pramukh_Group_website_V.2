"use client";

import { useRef } from "react";
import { Img } from "@/components/ui/Img";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import type { MediaKey } from "@/content/media";
import { coreValues, vision } from "@/content/site";
import styles from "./Ownership.module.css";

type Stage = { title: string; role: string; body: string; image: MediaKey; caption: string };

/** Paraphrased from the All-in Ownership™ copy on pramukh.com. */
const stages: Stage[] = [
  {
    title: "Foresight",
    role: "A developer’s foresight",
    body: "Every project starts with proactive planning and early attention to detail, protecting value before ground is broken.",
    image: "one-tapi/topdown",
    caption: "One Tapi, Surat",
  },
  {
    title: "Discipline",
    role: "A manager’s discipline",
    body: "Teams align fast and decisions are made early, so there are no surprises later.",
    image: "green-county/porch",
    caption: "Green County, Vapi",
  },
  {
    title: "Integration",
    role: "One team, end to end",
    body: "Development, construction and operations work as one. Removing silos strengthens execution at every stage.",
    image: "aranya-iii/hero",
    caption: "Aranya III, Surat",
  },
  {
    title: "Commitment",
    role: "A stakeholder’s long view",
    body: "A long-term commitment carries every project from concept to completion, and beyond.",
    image: "one-tapi/garden",
    caption: "One Tapi, Surat",
  },
];

/**
 * What the group holds itself to: the philosophy section's promises, folded in as the second half of
 * the ownership story (the sixth, "All-in Ownership", is this section itself). The original standalone
 * section is kept in components/sections/Philosophy.tsx and _undo/ if it is ever wanted back.
 */
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
];

export function Ownership() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const q = gsap.utils.selector(root);

      // The photo panel changes with each stage as it scrolls into place. Desktop: panel beside the stages.
      // Phones and tablets: the panel pins to the top of the screen and the stages pass beneath it.
      const stageMotion = (phone: boolean) => () => {
        const items = q("[data-stage-item]");
        const imgs = q("[data-own-img]");

        items.forEach((item, i) => {
          gsap.from(item.querySelectorAll(":scope > :not([class*=inlineImg])"), {
            y: 40,
            autoAlpha: 0,
            duration: 1.2,
            stagger: 0.08,
            scrollTrigger: { trigger: item, start: phone ? "top 74%" : "top 72%", toggleActions: "play none none none" },
          });
          if (i === 0) return;
          gsap
            .timeline({
              scrollTrigger: { trigger: item, start: phone ? "top 80%" : "top 85%", end: phone ? "top 46%" : "top 35%", scrub: 0.6 },
            })
            .fromTo(imgs[i], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" }, 0)
            .fromTo(imgs[i].querySelector("img"), { scale: 1.25 }, { scale: 1, ease: "none" }, 0)
            .to(imgs[i - 1].querySelector("img"), { scale: 1.08, ease: "none" }, 0);
        });

        gsap.fromTo(
          "[data-own-progress]",
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-own-body]", start: "top 60%", end: "bottom 60%", scrub: true } },
        );
      };
      mm.add(`${MQ.desktop} and ${MQ.motion}`, stageMotion(false));
      mm.add(`${MQ.mobile} and ${MQ.motion}`, stageMotion(true));

      mm.add(MQ.motion, () => {
        gsap.from("[data-principle]", {
          y: 36,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-principles]", start: "top 82%", toggleActions: "play none none none" },
        });
        gsap.from("[data-own-panel]", {
          clipPath: "inset(12% 12% 12% 12% round 16px)",
          duration: 1.8,
          scrollTrigger: { trigger: "[data-own-body]", start: "top 80%", toggleActions: "play none none none" },
        });
        gsap.from("[data-own-fade]", {
          y: 28,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-own-fade]", start: "top 88%", toggleActions: "play none none none" },
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="ownership" data-nav-theme="dark" className={styles.ownership} aria-labelledby="ownership-title">
      <div className="container">
        <header className={styles.head}>
          <p className={`eyebrow ${styles.eyebrow}`}>
            All-in Ownership<sup>™</sup>
          </p>
          <SplitReveal as="h2" id="ownership-title" className={`display ${styles.title}`} stagger={0.12}>
            We take ownership.
            <br />
            <span className={styles.titleAccent}>From vision to delivery.</span>
          </SplitReveal>
          <p className={styles.lede} data-own-fade>
            Owning every detail of every project, without compromise, and delivering with total commitment from start
            to finish. It is how Pramukh operates.
          </p>
        </header>

        <div className={styles.body} data-own-body>
          <div className={styles.panelCol}>
            <div className={styles.panel} data-own-panel aria-hidden="true">
              {stages.map((s, i) => (
                <figure key={s.title} className={`frame ${styles.panelImg}`} data-own-img style={{ zIndex: i }}>
                  <Img k={s.image} sizes="(max-width: 1023px) 1px, 45vw" />
                  <figcaption>{s.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className={styles.stages}>
            <span className={styles.rail} aria-hidden="true">
              <span data-own-progress />
            </span>
            <ol>
              {stages.map((s, i) => (
                <li key={s.title} className={styles.stage} data-stage-item>
                  <div className={`frame ${styles.inlineImg}`}>
                    <Img k={s.image} sizes="(max-width: 1023px) 92vw, 1px" />
                  </div>
                  <p className={styles.stageMeta}>
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    {s.role}
                  </p>
                  <h3 className={`display ${styles.stageTitle}`}>{s.title}</h3>
                  <p className={styles.stageBody}>{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className={styles.principles} id="philosophy" data-principles>
          <div className={styles.principlesHead}>
            <p className={`eyebrow ${styles.eyebrow}`}>Our philosophy</p>
            <SplitReveal as="h3" className={`display ${styles.principlesTitle}`}>
              Where excellence is standard.
            </SplitReveal>
          </div>
          <ol className={styles.principleList}>
            {principles.map((p, i) => (
              <li key={p.title} className={styles.principle} data-principle>
                <span className={styles.principleNum} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className={`display ${styles.principleTitle}`}>{p.title}</h4>
                <p className={styles.principleBody}>{p.body}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.close}>
          <SplitReveal as="p" className={`display ${styles.closeLine}`} by="words">
            We don&rsquo;t pass the buck. <span className={styles.titleAccent}>We take it forward.</span>
          </SplitReveal>
          <p className={styles.closeSmall} data-own-fade>
            From concept to completion and beyond, All-in Ownership<sup>™</sup> keeps every project sharper, smoother
            and built to last.
          </p>
        </div>
      </div>
    </section>
  );
}
