"use client";

import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/ui/Img";
import { Arrow, TextLink } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { foundingPromises, leaders } from "@/content/site";
import styles from "./Trust.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
/** Time on each leader before the next one comes round. */
const DWELL = 3500;

/**
 * Trust: the three founding promises, then the people who keep them. Leadership after the image-slider
 * pattern: a framed portrait that wipes to the next, the details beside it, and a strip of all six
 * portraits to choose from. Names, titles and bios from pramukh.com/team.html.
 */
export function Trust() {
  const root = useRef<HTMLElement>(null);
  const [lead, setLead] = useState(0);
  const prev = useRef(0);
  const person = leaders[lead];

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
        gsap.from("[data-trust-fade]", {
          y: 24,
          autoAlpha: 0,
          duration: 1.2,
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-trust-fade]", start: "top 90%", toggleActions: "play none none none" },
        });
        gsap.fromTo(
          "[data-lead-card]",
          { clipPath: "inset(12% 12% 12% 12% round 22px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 22px)",
            duration: 1.6,
            ease: "expo.out",
            clearProps: "clipPath",
            scrollTrigger: { trigger: "[data-lead-card]", start: "top 85%", toggleActions: "play none none none" },
          },
        );
        gsap.from("[data-lead-thumb]", {
          y: 24,
          opacity: 0,
          duration: 1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-lead-strip]", start: "top 92%", toggleActions: "play none none none" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Changing leader: the new portrait wipes up over the last one, and the details rise in.
  useGSAP(
    () => {
      const from = prev.current;
      prev.current = lead;
      if (from === lead || !window.matchMedia(MQ.motion).matches) return;
      const q = gsap.utils.selector(root);
      const dir = lead > from ? 1 : -1;
      const portrait = q(`[data-portrait="${lead}"]`)[0];
      gsap.fromTo(
        portrait,
        { clipPath: dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.out" },
      );
      gsap.fromTo(portrait.querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 1.3, ease: "expo.out" });
      gsap.fromTo(q("[data-lead-detail] > *"), { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.06, ease: "expo.out" });
    },
    { scope: root, dependencies: [lead] },
  );

  const go = (i: number) => setLead((i + leaders.length) % leaders.length);

  // Autoplay: on to the next leader every DWELL ms, but only while the block is on screen, not hovered or
  // focused, and motion is allowed. Any change of leader (by hand or by timer) restarts the clock.
  const blockRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [held, setHeld] = useState(false);
  const playing = inView && !held;
  useEffect(() => {
    const el = blockRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!playing || window.matchMedia(MQ.reduce).matches) return;
    const t = window.setTimeout(() => setLead((l) => (l + 1) % leaders.length), DWELL);
    return () => window.clearTimeout(t);
  }, [playing, lead]);

  return (
    <section ref={root} id="trust" data-nav-theme="light" className={styles.trust} aria-labelledby="trust-title">
      <div className="container">
        <div className={styles.top}>
          <div className={styles.intro}>
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
                <span className={styles.chip}>Promise {pad(i + 1)}</span>
                <h3 className={styles.promiseTitle}>{p.title}</h3>
                <p className={styles.promiseBody}>{p.body}</p>
                <span className={styles.promiseFoot}>Since 1993</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Leadership */}
        <div
          ref={blockRef}
          className={styles.leadership}
          aria-labelledby="leadership-title"
          data-playing={playing || undefined}
          onPointerEnter={() => setHeld(true)}
          onPointerLeave={() => setHeld(false)}
          onFocus={() => setHeld(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHeld(false)}
        >
          <div className={styles.leadHead}>
            <p className={styles.tag} data-trust-fade>
              <span className={styles.dot} aria-hidden="true" />
              Leadership
            </p>
            <SplitReveal as="h3" id="leadership-title" className={`display ${styles.leadTitle}`}>
              The people behind the promise.
            </SplitReveal>
          </div>

          {/* Portrait beside its details; the chooser and controls close the details column, level with the
              foot of the portrait, so the block reads as one composed unit. */}
          <div className={styles.leadBody}>
            <div className={styles.cardShell}>
              <div className={styles.card} data-lead-card>
                {leaders.map((l, i) => (
                  <span key={l.name} className={`frame ${styles.portraitLayer}`} data-portrait={i} data-on={i === lead || undefined}>
                    <Img k={l.image} sizes="(min-width: 1024px) 400px, 92vw" />
                  </span>
                ))}
                <span className={styles.cardShade} aria-hidden="true" />
              </div>
            </div>

            <div className={styles.leadInfo}>
              <div className={styles.leadDetail} data-lead-detail aria-live="polite">
                <p className={styles.leadRole}>{person.title}</p>
                <h4 className={`display ${styles.leadName}`}>{person.name}</h4>
                {person.years && <p className={styles.leadYears}>{person.years}</p>}
                <p className={styles.leadBio}>{person.bio}</p>
                {person.linkedin && (
                  <div>
                    <TextLink href={person.linkedin} external>
                      LinkedIn
                    </TextLink>
                  </div>
                )}
              </div>

              <div className={styles.leadFoot}>
                <ul className={styles.strip} data-lead-strip aria-label="Choose a leader">
                  {leaders.map((l, i) => (
                    <li key={l.name} data-lead-thumb>
                      <button
                        type="button"
                        className={styles.thumbBtn}
                        aria-pressed={i === lead}
                        onClick={() => setLead(i)}
                        title={l.name.replace(/^Mr\.\s*/, "")}
                      >
                        <span className={`frame ${styles.thumb}`}>
                          <Img k={l.image} sizes="64px" />
                        </span>
                        <span className="sr-only">
                          {l.name}, {l.title}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <div className={styles.leadNav}>
                  <p className={styles.leadCount} aria-hidden="true">
                    <span>{pad(lead + 1)}</span> / {pad(leaders.length)}
                    {/* Time to the next leader; restarts with each change (keyed by the leader). */}
                    <i key={lead} className={styles.leadTimer} />
                  </p>
                  <button type="button" className={styles.navBtn} onClick={() => go(lead - 1)} aria-label="Previous leader">
                    <Arrow dir="left" />
                  </button>
                  <button type="button" className={`${styles.navBtn} ${styles.navNext}`} onClick={() => go(lead + 1)} aria-label="Next leader">
                    <Arrow dir="right" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
