"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useScroll } from "@/components/SmoothScroll";
import { HeroMapCard } from "./HeroMapCard";
import { gsap, ScrollTrigger, useGSAP, MQ, prefersReducedMotion } from "@/lib/gsap";
import { onIntroDone } from "@/lib/intro";
import { getImageProps } from "next/image";
import { media, pickHeroVideo, PORTRAIT_MQ, video } from "@/content/media";
import styles from "./Hero.module.css";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scroll = useScroll();

  useGSAP(
    () => {
      const el = root.current!;
      const vid = videoRef.current!;

      // Load the loop only after the poster (LCP) is on screen and the page is idle.
      const loadVideo = () => {
        if (prefersReducedMotion() || vid.src) return;
        vid.src = pickHeroVideo();
        vid.addEventListener("playing", () => vid.setAttribute("data-playing", ""), { once: true });
        vid.play().catch(() => {});
      };
      // The cut is chosen for the viewport at load. When the viewport changes shape (phone ⇄ desktop,
      // rotation, DevTools device mode) swap to the right cut at the same moment in the loop, so a portrait
      // crop is never stretched across a landscape screen. Landscape only steps up in size, never down.
      const rank: string[] = [video.heroAerial.medium, video.heroAerial.large];
      const refit = () => {
        const current = vid.getAttribute("src");
        if (!current) return;
        const next = pickHeroVideo();
        const bothLandscape = rank.includes(current) && rank.includes(next);
        if (next === current || (bothLandscape && rank.indexOf(next) < rank.indexOf(current))) return;
        const t = vid.currentTime;
        vid.src = next;
        vid.addEventListener("loadedmetadata", () => (vid.currentTime = t), { once: true });
        if (ScrollTrigger.isInViewport(el)) vid.play().catch(() => {});
      };
      let refitTimer = 0;
      const onResize = () => {
        window.clearTimeout(refitTimer);
        refitTimer = window.setTimeout(refit, 250);
      };
      window.addEventListener("resize", onResize);
      // Decoding a 1080p loop is heavy: start it only once the post-preloader opening has played,
      // so it never competes with the curtain and headline for frames. The poster covers until then.
      let videoTimer = 0;
      const offVideo = onIntroDone(() => {
        videoTimer = window.setTimeout(loadVideo, 2400);
      });

      // Pause the loop whenever the hero is out of view.
      const visibility = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onToggle: ({ isActive }) => {
          if (!vid.src) return;
          if (isActive) vid.play().catch(() => {});
          else vid.pause();
        },
      });

      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Opening: the aerial settles from a slow push-in while the copy rises in, revealed by the
        // preloader's curtain lifting. Held until the preloader hands over.
        const opening = gsap
          .timeline({ paused: true })
          .from("[data-hero-media]", { scale: 1.18, duration: 2.6, ease: "expo.out" }, 0)
          .from("[data-hero-fade]", { y: 36, autoAlpha: 0, duration: 1.4, stagger: 0.08 }, 0.25)
          .from("[data-hero-rule]", { scaleX: 0, duration: 1.6, ease: "expo.inOut" }, 0.2)
          .from("[data-hero-card]", { y: 40, autoAlpha: 0, duration: 1.4, ease: "expo.out" }, 0.85);
        const offIntro = onIntroDone(() => opening.play());

        // Exit: the hero is CSS-sticky inside a double-height track, so the next section rides over it
        // without JS pinning (no DOM reparenting, which would re-register the headline as a late LCP paint).
        gsap
          .timeline({
            scrollTrigger: { trigger: el.parentElement, start: "top top", end: () => `+=${el.offsetHeight}`, scrub: true },
          })
          .to("[data-hero-frame]", { scale: 1.12, yPercent: 6, ease: "none" }, 0)
          .to("[data-hero-content]", { yPercent: -28, autoAlpha: 0, ease: "none" }, 0)
          .to("[data-hero-shade]", { opacity: 0.75, ease: "none" }, 0);

        return offIntro;
      });

      return () => {
        visibility.kill();
        mm.revert();
        offVideo();
        window.clearTimeout(videoTimer);
        window.clearTimeout(refitTimer);
        window.removeEventListener("resize", onResize);
      };
    },
    { scope: root },
  );

  return (
    <div className={styles.track}>
      <section ref={root} className={styles.hero} id="top" data-nav-theme="dark" aria-labelledby="hero-title">
        <div className={styles.media} data-hero-media>
          <div className={`frame ${styles.frame}`} data-hero-frame>
            <HeroPoster />
            <video
              ref={videoRef}
              className={styles.video}
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
        </div>
        <div className={styles.scrim} aria-hidden="true" />
        <div className={styles.shade} data-hero-shade aria-hidden="true" />

        {/* Editorial composition: the headline anchors low-left over the darker water and greenery, leaving
            the upper frame to the tower; a hairline separates it from one base row: subline and call to action. */}
        <div className={styles.content} data-hero-content>
          {/* One lockup: its width is the headline's, so the rule and the button end on the same edge. */}
          <div className={styles.block}>
            <div className={styles.lead}>
              <p className={`eyebrow ${styles.eyebrow}`} data-hero-fade>
                Surat <span aria-hidden="true">·</span> Vapi <span aria-hidden="true">·</span> Silvassa{" "}
                <span aria-hidden="true">·</span> Daman
              </p>
              <SplitReveal as="h1" id="hero-title" className={`display ${styles.title}`} start={false} delay={0.3} stagger={0.1} preHide={false}>
                {/* Phrase spans let phones set the lines deliberately: Designed / to endure. / Built to inspire. */}
                <span className={styles.sentence}>
                  <span className={styles.phrase}>Designed</span> <span className={styles.phrase}>to endure.</span>
                </span>{" "}
                <span className={styles.sentence}>Built to inspire.</span>
              </SplitReveal>
            </div>
            <div className={styles.base}>
              <span className={styles.rule} data-hero-rule aria-hidden="true" />
              <p className={styles.lede} data-hero-fade>
                Creating spaces of distinction through thoughtful development, uncompromising quality and enduring trust.
              </p>
              <div data-hero-fade>
                <Button
                  href="#projects"
                  tone="light"
                  className={styles.cta}
                  onClick={(e) => {
                    e.preventDefault();
                    scroll.scrollTo("#projects");
                  }}
                >
                  Explore projects
                </Button>
              </div>
            </div>
          </div>
          <HeroMapCard />
        </div>
      </section>
    </div>
  );
}

/**
 * Art-directed poster: a native portrait crop on portrait phones/tablets, the landscape frame elsewhere.
 * It is the LCP element, so it is preloaded and never upscaled.
 */
function HeroPoster() {
  const land = media(video.heroAerial.poster);
  const port = media(video.heroAerial.posterPortrait);
  const common = { alt: land.alt, fill: true, priority: true, quality: 80 as const, sizes: "100vw" };
  const { props: p } = getImageProps({ ...common, src: port.src });
  const { props: l } = getImageProps({ ...common, src: land.src });
  return (
    <picture>
      <source media={PORTRAIT_MQ} srcSet={p.srcSet} sizes="100vw" />
      <img {...l} alt={land.alt} style={{ ...l.style, objectFit: "cover" }} />
    </picture>
  );
}
