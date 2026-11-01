"use client";

import { useEffect, useRef, useState } from "react";
import { Img } from "@/components/ui/Img";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useScroll } from "@/components/SmoothScroll";
import { gsap, useGSAP, MQ } from "@/lib/gsap";
import { testimonials, type Testimonial } from "@/content/testimonials";
import styles from "./Voices.module.css";

const pad = (n: number) => String(n).padStart(2, "0");
const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

/**
 * Customer voices, after the reference video's testimonial row: heading, project image and arrows on
 * the left; a swipeable row of tall quote cards on the right. Each card names the project the customer
 * lives or works in. Video stories sit in the same row as full-bleed poster cards and play in a
 * lightbox. Content is mock data (see content/testimonials.ts).
 */
export function Voices() {
  const root = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const [playing, setPlaying] = useState<Testimonial | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-voice]", {
          x: 80,
          autoAlpha: 0,
          duration: 1.3,
          stagger: 0.1,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-voices-track]", start: "top 85%", toggleActions: "play none none none" },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Keep the counter and arrow states in step with native scrolling (swipe, trackpad, keyboard).
  useEffect(() => {
    const track = trackRef.current!;
    const sync = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const step = cards[1] ? cards[1].offsetLeft - cards[0].offsetLeft : track.clientWidth;
      setIndex(Math.min(cards.length - 1, Math.round(track.scrollLeft / step)));
      setAtEnd(track.scrollLeft + track.clientWidth >= track.scrollWidth - 4);
    };
    sync();
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      track.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const track = trackRef.current!;
    const cards = Array.from(track.children) as HTMLElement[];
    const next = Math.max(0, Math.min(cards.length - 1, index + dir));
    track.scrollTo({ left: cards[next].offsetLeft - cards[0].offsetLeft, behavior: "smooth" });
  };

  // Slideshow: on to the next story every few seconds, back to the first after the last. It waits while a
  // mouse is over the row or it has focus, while a video is open, off screen, or with reduced motion. On touch
  // screens a touch on the row stops it (a lifted finger is not a "leave"): it stays stopped while the reader
  // is with the stories, and starts again after a tap elsewhere or once the section has scrolled away.
  const [inView, setInView] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touched, setTouched] = useState(false);
  const held = hovered || focused || touched;
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting);
      if (!e.isIntersecting) setTouched(false);
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!touched) return;
    const away = (e: PointerEvent) => {
      if (!trackRef.current?.contains(e.target as Node)) setTouched(false);
    };
    document.addEventListener("pointerdown", away);
    return () => document.removeEventListener("pointerdown", away);
  }, [touched]);
  useEffect(() => {
    if (!inView || held || playing || window.matchMedia(MQ.reduce).matches) return;
    const t = window.setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      if (atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
      else go(1);
    }, 3500);
    return () => window.clearTimeout(t);
  });

  return (
    <section ref={root} id="voices" data-nav-theme="light" className={styles.voices} aria-labelledby="voices-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.side}>
          <div className={styles.intro}>
            <p className={styles.tag} data-reveal>
              <span className={styles.dot} aria-hidden="true" />
              Customer voices
            </p>
            <SplitReveal as="h2" id="voices-title" className={`display ${styles.title}`}>
              Voices of trust. Stories of home.
            </SplitReveal>
            <p className={styles.lede} data-reveal>
              Homeowners and business owners on living and working in a Pramukh project. Read their words, or watch
              their stories.
            </p>
          </div>
          <div className={styles.controls}>
            <button type="button" className={styles.arrow} onClick={() => go(-1)} disabled={index === 0} aria-label="Previous testimonial">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M17 10H4M9 4.5 3.5 10 9 15.5" />
              </svg>
            </button>
            <button type="button" className={`${styles.arrow} ${styles.next}`} onClick={() => go(1)} disabled={atEnd} aria-label="Next testimonial">
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M3 10h13M11 4.5 16.5 10 11 15.5" />
              </svg>
            </button>
            <p className={styles.count} aria-live="polite">
              <span>{pad(index + 1)}</span> / {pad(testimonials.length)}
            </p>
          </div>
        </div>

        <ul
          ref={trackRef}
          className={styles.track}
          data-voices-track
          tabIndex={0}
          aria-label="Customer testimonials"
          data-held={held || undefined}
          onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
          onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(false)}
          onPointerDown={(e) => e.pointerType !== "mouse" && setTouched(true)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocused(false)}
        >
          {testimonials.map((t, i) =>
            t.video ? (
              <li key={t.name} className={`${styles.card} ${styles.videoCard}`} data-voice>
                <div className={`frame ${styles.poster}`} aria-hidden="true">
                  <Img k={t.video.poster} sizes="(min-width: 1024px) 26vw, 80vw" />
                </div>
                <div className={styles.cardTop}>
                  <span className={`${styles.pill} ${styles.pillLight}`}>
                    {pad(i + 1)} {t.project}, {t.city}
                  </span>
                  <span className={styles.videoTag}>Video story</span>
                </div>
                <button type="button" className={styles.play} onClick={() => setPlaying(t)} data-cursor="Play">
                  <span className={styles.playRing} aria-hidden="true">
                    <svg viewBox="0 0 20 20">
                      <path d="M7 4.8v10.4L15.4 10z" />
                    </svg>
                  </span>
                  <span className="sr-only">
                    Play {t.name}&rsquo;s story about {t.project}
                  </span>
                </button>
                <footer className={styles.who}>
                  <p className={`display ${styles.pull}`}>&ldquo;{t.quote}&rdquo;</p>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.role}>
                    {t.role}, {t.project}
                  </p>
                </footer>
              </li>
            ) : (
              <li key={t.name} className={styles.card} data-voice data-tone={i % 3}>
                <div className={styles.cardTop}>
                  <span className={styles.pill}>
                    {pad(i + 1)} {t.project}, {t.city}
                  </span>
                  <span className={styles.avatar} aria-hidden="true">
                    {initials(t.name)}
                  </span>
                </div>
                <span className={`display ${styles.mark}`} aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className={styles.quote}>
                  <p>{t.quote}</p>
                </blockquote>
                <footer className={styles.who}>
                  <p className={styles.name}>{t.name}</p>
                  <p className={styles.role}>
                    {t.role}, {t.project}
                  </p>
                </footer>
              </li>
            ),
          )}
        </ul>
      </div>
      <VideoLightbox story={playing} onClose={() => setPlaying(null)} />
    </section>
  );
}

/** Modal player: native <dialog> (focus trap, Esc, inert page), page scroll paused while open. */
function VideoLightbox({ story, onClose }: { story: Testimonial | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const scroll = useScroll();

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg || !story) return;
    dlg.showModal();
    scroll.stop();
    if (window.matchMedia(MQ.motion).matches)
      gsap.fromTo(dlg.querySelector("[data-lb-panel]"), { y: 40, scale: 0.97, autoAlpha: 0 }, { y: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: "expo.out" });
    return () => {
      dlg.close();
      scroll.start();
    };
  }, [story, scroll]);

  return (
    <dialog
      ref={ref}
      className={styles.lightbox}
      aria-label={story ? `${story.name}, ${story.project}` : undefined}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {story?.video && (
        <div className={styles.lbPanel} data-lb-panel>
          <video className={styles.lbVideo} src={story.video.src} controls autoPlay playsInline />
          <div className={styles.lbBar}>
            <p>
              <span className={styles.lbName}>{story.name}</span>
              <span className={styles.lbRole}>
                {story.role}, {story.project}, {story.city}
              </span>
            </p>
            <button type="button" className={styles.lbClose} onClick={onClose}>
              <span className="sr-only">Close video</span>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
