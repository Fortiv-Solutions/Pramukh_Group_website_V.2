"use client";

import { useRef } from "react";
import { Img } from "@/components/ui/Img";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { foundingPromises } from "@/content/site";
import styles from "./Trust.module.css";


export function Trust() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-promise]", {
          x: 140,
          autoAlpha: 0,
          duration: 1.4,
          stagger: 0.12,
          scrollTrigger: { trigger: "[data-promises]", start: "top 82%", toggleActions: "play none none none" },
        });
        gsap.from("[data-portrait] img", {
          scale: 1.3,
          duration: 1.8,
          scrollTrigger: { trigger: "[data-portrait]", start: "top 88%", toggleActions: "play none none none" },
        });
        gsap.from("[data-trust-fade]", {
          y: 24,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-trust-fade]", start: "top 90%", toggleActions: "play none none none" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="trust" data-nav-theme="light" className={styles.trust} aria-labelledby="trust-title">
      <div className="container">
        <div className={styles.top}>
          <div className={styles.intro}>
            <div className={`frame ${styles.portrait}`} data-portrait>
              <Img k="brand/founder" sizes="120px" />
            </div>
            <SplitReveal as="h2" id="trust-title" className={`display ${styles.title}`}>
              Trust built over time.
            </SplitReveal>
            <p className={styles.lede} data-trust-fade>
              Shri. Natubhai R. Bhatu established Pramukh Group in 1993 with three reasons in mind. More than thirty
              years later, they remain the measure of every project.
            </p>
          </div>

          <ol className={styles.promises} data-promises aria-label="The three founding promises">
            {foundingPromises.map((p, i) => (
              <li key={p.title} className={styles.promise} data-promise>
                <span className={styles.chip}>Promise {String(i + 1).padStart(2, "0")}</span>
                <h3 className={styles.promiseTitle}>{p.title}</h3>
                <p className={styles.promiseBody}>{p.body}</p>
                <span className={styles.promiseFoot}>Since 1993</span>
              </li>
            ))}
          </ol>
        </div>

      </div>
    </section>
  );
}
