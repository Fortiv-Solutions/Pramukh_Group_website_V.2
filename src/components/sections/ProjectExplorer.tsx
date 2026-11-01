"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { BrandLogo } from "@/components/brand/Logo";
import { logoPaths } from "@/components/brand/logo-paths";
import { Img } from "@/components/ui/Img";
import { Arrow, Button } from "@/components/ui/Button";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { useScroll } from "@/components/SmoothScroll";
import { gsap, useGSAP, MQ, prefersReducedMotion } from "@/lib/gsap";
import { projects, type City, type Project } from "@/content/projects";
import type { MediaKey } from "@/content/media";
import styles from "./ProjectExplorer.module.css";

/** One hardcover volume per city. The cover photograph is one of that city's own projects. */
type Volume = { city: City; cover: MediaKey; position: string };
const VOLUMES: Volume[] = [
  { city: "Silvassa", cover: "yogi-woods/hero", position: "30% 50%" },
  { city: "Vapi", cover: "vedanta/hero", position: "50% 50%" },
  { city: "Surat", cover: "one-tapi/night", position: "50% 50%" },
  { city: "Daman", cover: "marina-bay/hero", position: "50% 50%" },
];

const pad = (n: number) => String(n).padStart(2, "0");
const plural = (n: number) => `${n} ${n === 1 ? "project" : "projects"}`;

/** The printed face of a volume. Sized in container units so the shelf copy and the book's cover match. */
function CoverFace({ v, index, count, sizes }: { v: Volume; index: number; count: number; sizes: string }) {
  return (
    <span className={styles.face}>
      <Img k={v.cover} sizes={sizes} position={v.position} />
      <span className={styles.shade} aria-hidden="true" />
      <span className={styles.foil} aria-hidden="true" />
      <span className={styles.spine} aria-hidden="true" />
      <span className={styles.faceTop}>
        <BrandLogo title={null} className={styles.faceLogo} />
      </span>
      <span className={styles.faceFoot}>
        <span className={styles.faceVol}>Vol. {pad(index + 1)}</span>
        <span className={`display ${styles.faceCity}`}>{v.city}</span>
        <span className={styles.faceRule} aria-hidden="true" />
        <span className={styles.faceCount}>{plural(count)}</span>
      </span>
    </span>
  );
}

/** The inside cover: the group's opening words. On a spread it is the left-hand page; on phones the top page. */
function JourneyContent() {
  return (
    <>
      <svg className={styles.journeyMark} viewBox={logoPaths.mark.box.join(" ")} aria-hidden="true" data-page-item>
        <path d={logoPaths.mark.paths[0]} />
      </svg>
      <span className={styles.label} data-page-item>
        Since 1993
      </span>
      <p className={`display ${styles.journeyTitle}`} data-page-item>
        The journey begins.
      </p>
      <p className={styles.journeyBody} data-page-item>
        Since its inception, Pramukh Group has been setting benchmarks in Gujarat&rsquo;s real estate. Established
        in 1993 and formerly known as PDPL Group, it was founded by Shri. Natubhai R. Bhatu for three reasons: to
        provide quality construction, to deliver what is promised on time, and to offer value for money.
      </p>
      <p className={styles.journeyBody} data-page-item>
        Since then, the group has kept fulfilling those promises, striving for better results every day.
      </p>
      <p className={styles.journeySign} data-page-item>
        Shri. Natubhai R. Bhatu
        <span>Founder &amp; Chairman</span>
      </p>
    </>
  );
}

/** Left-hand page of a project spread: the photograph as a plate, with its caption. */
function PlatePage({ p, n }: { p: Project; n: number }) {
  return (
    <div className={styles.platePage}>
      <span className={`frame ${styles.platePageImg}`}>
        <Img k={p.detail ?? p.image} sizes="(min-width: 768px) 820px, 92vw" />
      </span>
      <span className={styles.plateCaption}>
        Plate {pad(n)} · {p.name}
        <span className={styles.plateLocality}>, {p.locality}</span>
      </span>
    </div>
  );
}

/** Right-hand page of a project spread: everything about the project, and the way to its official page. */
function DetailPage({ p, n, total, volume, inert = false }: { p: Project; n: number; total: number; volume: string; inert?: boolean }) {
  return (
    <div className={styles.detail}>
      <span className={styles.label}>
        Vol. {volume} · {pad(n)} / {pad(total)}
      </span>
      <span className={`frame ${styles.detailPhoto}`}>
        <Img k={p.image} sizes="(max-width: 767px) 92vw, 1px" />
      </span>
      <h4 className={`display ${styles.detailName}`}>{p.name}</h4>
      <p className={styles.detailWhere}>
        {p.locality}, {p.city}
      </p>
      {p.headline && <p className={styles.detailHeadline}>{p.headline}</p>}
      <p className={styles.detailBody}>{p.description}</p>
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
      <div className={styles.detailCta}>
        <Button href={p.href} tone="dark" icon="external" external magnetic={false} tabIndex={inert ? -1 : undefined}>
          {`Explore ${p.name}`}
        </Button>
      </div>
    </div>
  );
}

/** The contents: live rows on the page; the same rows, inert, on a leaf that is being turned. */
function ContentsList({
  list,
  activeSlug,
  onPick,
  onHover,
}: {
  list: Project[];
  activeSlug?: string;
  onPick?: (n: number) => void;
  onHover?: (slug: string) => void;
}) {
  return (
    <ol className={styles.contents} data-lenis-scrollable>
      {list.map((p, i) => {
        const inner = (
          <>
            <span className={styles.entryNum}>{pad(i + 1)}</span>
            <span className={`frame ${styles.thumb}`}>
              <Img k={p.image} sizes="(max-width: 767px) 112px, 80px" />
            </span>
            <span className={styles.entryText}>
              <span className={`display ${styles.entryName}`}>{p.name}</span>
              <span className={styles.entryMeta}>
                {p.locality} · {p.category}
              </span>
              {p.status && <span className={styles.entryStatus}>{p.status}</span>}
            </span>
            <span className={styles.explore}>
              Page {pad(i + 1)}
              <Arrow dir="right" />
            </span>
          </>
        );
        return (
          <li key={p.slug} data-page-item={onPick ? "" : undefined}>
            {onPick ? (
              <button
                type="button"
                className={styles.entry}
                data-active={activeSlug === p.slug || undefined}
                onMouseEnter={() => onHover?.(p.slug)}
                onFocus={() => onHover?.(p.slug)}
                onClick={() => onPick(i + 1)}
              >
                {inner}
                <span className="sr-only">: turn to the {p.name} page</span>
              </button>
            ) : (
              <span className={styles.entry} data-active={activeSlug === p.slug || undefined}>
                {inner}
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

type Turn = { from: number; to: number; dir: 1 | -1 };

/**
 * Projects as a shelf of four city volumes, after the book-cover reference: a volume lifts and tilts
 * under the pointer; choosing one pulls it off the shelf to the centre, the cover swings open on its spine
 * and the first spread shows the city (inside cover) and its contents. Every project then has a spread of
 * its own (a photographic plate, and its details), reached by turning pages: the arrows, the arrow keys, or
 * a contents entry. Back, or another city, closes the book onto the shelf. Data is the shared `projects`
 * list; nothing is duplicated.
 */
export function ProjectExplorer() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const turnerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const fromRef = useRef<DOMRect | null>(null);
  const pendingRef = useRef<City | null>(null);
  const scroll = useScroll();
  const [open, setOpen] = useState<City | null>(null);
  const [active, setActive] = useState("");
  // Spread 0 is the inside cover and contents; spread k (1..n) is the k-th project.
  const [spread, setSpread] = useState(0);
  const [turn, setTurn] = useState<Turn | null>(null);

  const byCity = useMemo(
    () => Object.fromEntries(VOLUMES.map((v) => [v.city, projects.filter((p) => p.city === v.city)])) as Record<City, Project[]>,
    [],
  );
  const coverOf = (city: City) => root.current?.querySelector<HTMLButtonElement>(`[data-cover="${city}"]`) ?? null;

  const openCity = (city: City) => {
    const btn = coverOf(city);
    if (!btn || tlRef.current) return;
    fromRef.current = btn.getBoundingClientRect();
    setActive(byCity[city][0]?.slug ?? "");
    setSpread(0);
    setTurn(null);
    setOpen(city);
  };

  const close = (next: City | null = null) => {
    const tl = tlRef.current;
    if (!tl || tl.reversed() || turn) return;
    pendingRef.current = next;
    // The cover closes over the first spread, as it opened.
    setSpread(0);
    if (prefersReducedMotion()) {
      tl.progress(0);
      tl.eventCallback("onReverseComplete")?.();
      return;
    }
    tl.timeScale(next ? 1.9 : 1.45).reverse();
  };

  const list = open ? byCity[open] : [];
  const last = list.length;

  /** Turn to a spread: a paper leaf lifts off one page and lands on the other side of the spine. */
  const goTo = (to: number) => {
    if (!open || turn || to === spread || to < 0 || to > last || !tlRef.current || tlRef.current.isActive()) return;
    if (prefersReducedMotion()) return setSpread(to);
    setTurn({ from: spread, to, dir: to > spread ? 1 : -1 });
  };

  // Shelf entrance, and the hover tilt on each volume (fine pointers with motion only).
  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        // Opacity, not autoAlpha: hidden (visibility) elements drop out of the Tab order, and keyboard users
        // must be able to reach a volume before it has scrolled into view.
        gsap.from("[data-slot]", {
          y: 110,
          rotationX: -16,
          opacity: 0,
          transformOrigin: "50% 100%",
          duration: 1.5,
          stagger: 0.11,
          ease: "expo.out",
          scrollTrigger: { trigger: "[data-shelf]", start: "top 80%", toggleActions: "play none none none" },
        });
        gsap.from("[data-ledge]", {
          scaleX: 0,
          duration: 1.6,
          ease: "expo.inOut",
          scrollTrigger: { trigger: "[data-shelf]", start: "top 80%", toggleActions: "play none none none" },
        });
      });
      mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motion}`, () => {
        const offs = gsap.utils.toArray<HTMLElement>("[data-cover]").map((btn) => {
          const tilt = btn.querySelector<HTMLElement>("[data-tilt]")!;
          gsap.set(tilt, { transformPerspective: 900 });
          const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3.out" });
          const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3.out" });
          const move = contextSafe!((e: PointerEvent) => {
            const r = btn.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 16);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 11);
          });
          const enter = contextSafe!(() => gsap.to(tilt, { y: -14, duration: 0.6, ease: "power3.out", overwrite: "auto" }));
          const leave = contextSafe!(() => {
            rx(0);
            ry(0);
            gsap.to(tilt, { y: 0, duration: 0.8, ease: "power3.out", overwrite: "auto" });
          });
          btn.addEventListener("pointermove", move);
          btn.addEventListener("pointerenter", enter);
          btn.addEventListener("pointerleave", leave);
          return () => {
            btn.removeEventListener("pointermove", move);
            btn.removeEventListener("pointerenter", enter);
            btn.removeEventListener("pointerleave", leave);
          };
        });
        return () => offs.forEach((off) => off());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Opening choreography, built when a city mounts and reversed to close.
  useGSAP(
    () => {
      if (!open) return;
      const stage = stageRef.current!;
      const book = bookRef.current!;
      const leaf = book.querySelector<HTMLElement>("[data-leaf]")!;
      const cover = coverOf(open)!;
      const q = gsap.utils.selector(root);

      // The stage grows with the book while it is open, so a long page (a project's page after the contents) never runs under the next section.
      const reader = book.parentElement!.parentElement as HTMLElement;
      const shelfHeight = stage.offsetHeight;
      const fit = () => (stage.style.minHeight = `${Math.max(shelfHeight, reader.offsetHeight)}px`);
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(reader);

      // FLIP: the book's closed cover starts exactly where the volume stood on the shelf.
      gsap.set(book, { xPercent: -25 });
      const to = leaf.getBoundingClientRect();
      const box = book.getBoundingClientRect();
      const from = fromRef.current ?? to;
      gsap.set(book, { transformOrigin: `${to.left - box.left + to.width / 2}px ${to.top - box.top + to.height / 2}px` });

      const finish = () => {
        tlRef.current = null;
        ro.disconnect();
        stage.style.minHeight = "";
        requestAnimationFrame(() => window.dispatchEvent(new Event("pramukh:reader")));
        const next = pendingRef.current;
        pendingRef.current = null;
        setOpen(null);
        if (next) requestAnimationFrame(() => requestAnimationFrame(() => openCity(next)));
        else coverOf(open)?.focus({ preventScroll: true });
      };

      const tl = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut" },
        // Focus whichever title is showing (inside cover on a spread, the page itself on phones).
        onComplete: () =>
          Array.from(book.querySelectorAll<HTMLElement>("[data-book-title]"))
            .find((el) => el.offsetParent)
            ?.focus({ preventScroll: true }),
        onReverseComplete: finish,
      });
      tl.set(cover, { visibility: "hidden" }, 0)
        .fromTo(
          book,
          {
            x: from.left + from.width / 2 - (to.left + to.width / 2),
            y: from.top + from.height / 2 - (to.top + to.height / 2),
            scale: from.width / to.width,
            rotationY: -14,
          },
          { x: 0, y: 0, scale: 1, rotationY: 0, duration: 0.95 },
          0,
        )
        .to(q(`[data-slot]:not([data-slot="${open}"])`), { autoAlpha: 0, y: 26, duration: 0.5, stagger: 0.04, ease: "power2.in" }, 0)
        .to(q("[data-ledge], [data-shelf-hint]"), { autoAlpha: 0, duration: 0.4, ease: "power2.in" }, 0)
        .fromTo(leaf, { rotationY: 0 }, { rotationY: -180, duration: 1.15, ease: "power2.inOut" }, 0.8);
      tl.fromTo(book, { xPercent: -25 }, { xPercent: 0, duration: 1.15, ease: "power2.inOut" }, 0.8);
      tl.fromTo(
        book.querySelectorAll("[data-page-item]"),
        { y: 18, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.06, ease: "power3.out" },
        1.4,
      ).fromTo(q("[data-reader-bar], [data-pager]"), { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.5);

      tlRef.current = tl;
      if (prefersReducedMotion()) tl.progress(1);
      else tl.play();
      window.dispatchEvent(new Event("pramukh:reader"));

      // Bring the open book into view below the floating nav (the reader's bar sits at the stage's top).
      const r = stage.getBoundingClientRect();
      const offscreen = r.top < 88 || r.bottom > window.innerHeight + 4;
      if (offscreen) scroll.scrollTo(window.scrollY + r.top - 96);
      return () => ro.disconnect();
    },
    { scope: root, dependencies: [open] },
  );

  // A page turn: the leaf lifts off its page and lands on the other side of the spine, its shading deepening
  // as it stands upright and clearing as it lies flat.
  useGSAP(
    () => {
      if (!turn) return;
      const leaf = turnerRef.current!;
      const [front, back] = leaf.querySelectorAll<HTMLElement>("[data-turn-shade]");
      gsap
        .timeline({
          onComplete: () => {
            setSpread(turn.to);
            setTurn(null);
          },
        })
        .fromTo(leaf, { rotationY: 0 }, { rotationY: turn.dir > 0 ? -180 : 180, duration: 1.05, ease: "power2.inOut" }, 0)
        .fromTo(front, { opacity: 0 }, { opacity: 0.32, duration: 0.52, ease: "power1.in" }, 0)
        .fromTo(back, { opacity: 0.32 }, { opacity: 0, duration: 0.53, ease: "power1.out" }, 0.52);
    },
    { scope: root, dependencies: [turn] },
  );

  // Desktop: the open spread leans gently toward the pointer.
  useGSAP(
    (_, contextSafe) => {
      if (!open) return;
      const mm = gsap.matchMedia();
      mm.add(`(hover: hover) and (pointer: fine) and ${MQ.motion} and (min-width: 768px)`, () => {
        const stage = stageRef.current!;
        const tilt = stage.querySelector<HTMLElement>("[data-book-tilt]")!;
        gsap.set(tilt, { transformPerspective: 2200 });
        const rx = gsap.quickTo(tilt, "rotationX", { duration: 1, ease: "power3.out" });
        const ry = gsap.quickTo(tilt, "rotationY", { duration: 1, ease: "power3.out" });
        const move = contextSafe!((e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 5);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 3.5);
        });
        const leave = contextSafe!(() => {
          rx(0);
          ry(0);
        });
        stage.addEventListener("pointermove", move);
        stage.addEventListener("pointerleave", leave);
        return () => {
          stage.removeEventListener("pointermove", move);
          stage.removeEventListener("pointerleave", leave);
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [open] },
  );

  // Touch: a horizontal swipe across the book turns the page (a mouse drag does too). A swipe never
  // also counts as a tap on whatever it started on.
  const swipe = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY, moved: false };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s0 = swipe.current;
    if (!s0) return;
    const dx = e.clientX - s0.x;
    const dy = e.clientY - s0.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      s0.moved = true;
      goTo(spread + (dx < 0 ? 1 : -1));
    } else swipe.current = null;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (swipe.current?.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
    swipe.current = null;
  };

  // Keyboard: Escape closes the volume, the arrow keys turn its pages.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") goTo(spread + 1);
      else if (e.key === "ArrowLeft") goTo(spread - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const vol = open ? VOLUMES.find((v) => v.city === open)! : null;
  const volIndex = vol ? VOLUMES.indexOf(vol) : 0;
  const volume = pad(volIndex + 1);
  const current = list.find((p) => p.slug === active) ?? list[0];
  // While a leaf turns, the static pages already show what the leaf will uncover.
  const leftShown = turn ? (turn.dir > 0 ? turn.from : turn.to) : spread;
  const rightShown = turn ? (turn.dir > 0 ? turn.to : turn.from) : spread;
  const at = (k: number) => list[k - 1];

  return (
    <section ref={root} id="projects" data-nav-theme="light" className={styles.explorer} aria-labelledby="projects-title">
      <div className="container">
        <header className={styles.head}>
          <p className={styles.tag} data-reveal>
            <span className={styles.dot} aria-hidden="true" />
            Projects
          </p>
          <SplitReveal as="h2" id="projects-title" className={`display ${styles.title}`}>
            Four cities, one standard.
          </SplitReveal>
          <p className={styles.lede} data-reveal>
            Every Pramukh project, collected by city. Open a volume and turn its pages to see each residence and commercial
            space.
          </p>
        </header>

        <div ref={stageRef} className={styles.stage} data-open={open || undefined}>
          <div className={styles.shelfWrap}>
            <ul className={styles.shelf} data-shelf aria-label="City volumes">
              {VOLUMES.map((v, i) => (
                <li key={v.city} className={styles.slot} data-slot={v.city}>
                  <button
                    type="button"
                    className={styles.cover}
                    data-cover={v.city}
                    data-cursor="Open"
                    aria-expanded={open === v.city}
                    aria-controls="city-volume"
                    onClick={() => (open ? close(v.city === open ? null : v.city) : openCity(v.city))}
                  >
                    <span className={styles.tilt} data-tilt>
                      <CoverFace v={v} index={i} count={byCity[v.city].length} sizes="(min-width: 1024px) 820px, (min-width: 768px) 50vw, 130vw" />
                    </span>
                    <span className="sr-only">: open the {v.city} collection</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className={styles.ledge} data-ledge aria-hidden="true" />
            <p className={styles.hint} data-shelf-hint>
              <span className={styles.hintWide}>Choose a city to open its collection</span>
              <span className={styles.hintTouch}>Swipe the shelf, then tap a city</span>
            </p>
          </div>

          {vol && (
            <div className={styles.reader} id="city-volume" role="region" aria-label={`${vol.city} projects`}>
              <div className={styles.readerBar} data-reader-bar>
                <button type="button" className={styles.back} onClick={() => close()}>
                  <Arrow dir="left" />
                  All cities
                </button>
                <ul className={styles.switcher} aria-label="Other cities">
                  {VOLUMES.map((v) => (
                    <li key={v.city}>
                      <button type="button" aria-current={v.city === open ? "true" : undefined} onClick={() => v.city !== open && close(v.city)}>
                        {v.city}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.bookTilt} data-book-tilt>
                <div
                  ref={bookRef}
                  className={styles.book}
                  onPointerDown={onPointerDown}
                  onPointerUp={onPointerUp}
                  onPointerCancel={() => (swipe.current = null)}
                  onClickCapture={onClickCapture}
                >
                  {/* The cover leaf: printed face outside, the city's title page inside. First in the DOM so the title
                      precedes the contents in the Tab order; it still stacks above the page (z-index). */}
                  <div className={styles.leaf} data-leaf>
                    <div className={styles.leafFront} aria-hidden="true">
                      <CoverFace v={vol} index={volIndex} count={list.length} sizes="(min-width: 768px) 1040px, 200vw" />
                    </div>
                    <div className={styles.leafBack}>
                      <JourneyContent />
                    </div>
                  </div>

                  {/* Left-hand page of a project spread, laid over the inside cover. */}
                  {leftShown > 0 && at(leftShown) && (
                    <div className={styles.leftPage} aria-hidden={turn ? true : undefined}>
                      <PlatePage p={at(leftShown)} n={leftShown} />
                    </div>
                  )}

                  {/* Right-hand page: the contents, or a project's details. */}
                  <div className={styles.page} data-page data-detail={rightShown > 0 || undefined} data-lenis-scrollable>
                    <div className={styles.contentsBlock} inert={rightShown > 0 || undefined}>
                      {/* The volume's title, above its contents. */}
                      <div className={styles.pageHeadSingle} data-page-item>
                        <span className={styles.label}>Pramukh · Vol. {volume}</span>
                        <h3 className={`display ${styles.singleCity}`} data-book-title tabIndex={-1}>
                          {vol.city}
                        </h3>
                        <span className={styles.count}>{plural(list.length)}</span>
                      </div>
                      <p className={styles.contentsLabel} data-page-item>
                        Contents
                      </p>
                      <ContentsList list={list} activeSlug={current?.slug} onPick={goTo} onHover={setActive} />
                      {list.length <= 3 && current && (
                        <div className={styles.note} data-page-item>
                          <p className={styles.noteHead}>{current.headline ?? current.configuration}</p>
                          <p className={styles.noteBody}>{current.description}</p>
                        </div>
                      )}
                    </div>
                    {rightShown > 0 && at(rightShown) && (
                      <div className={styles.detailLayer} aria-hidden={turn ? true : undefined}>
                        <DetailPage p={at(rightShown)} n={rightShown} total={last} volume={volume} inert={!!turn} />
                      </div>
                    )}
                  </div>

                  {/* The leaf being turned: the page it lifts on its face, the page it brings on its back. */}
                  {turn && (
                    <div ref={turnerRef} className={styles.turner} data-dir={turn.dir > 0 ? "next" : "prev"} aria-hidden="true" inert>
                      <div className={styles.turnFace}>
                        {turn.dir > 0 ? (
                          turn.from === 0 ? (
                            <div className={styles.turnContents}>
                              <p className={styles.contentsLabel}>Contents</p>
                              <ContentsList list={list} activeSlug={current?.slug} />
{list.length <= 3 && current && (
                        <div className={styles.note}>
                          <p className={styles.noteHead}>{current.headline ?? current.configuration}</p>
                          <p className={styles.noteBody}>{current.description}</p>
                        </div>
                      )}
                            </div>
                          ) : (
                            <DetailPage p={at(turn.from)} n={turn.from} total={last} volume={volume} inert />
                          )
                        ) : (
                          <PlatePage p={at(turn.from)} n={turn.from} />
                        )}
                        <span className={styles.turnShade} data-turn-shade />
                      </div>
                      <div className={`${styles.turnFace} ${styles.turnBack}`}>
                        {turn.dir > 0 ? (
                          <PlatePage p={at(turn.to)} n={turn.to} />
                        ) : turn.to === 0 ? (
                          <div className={styles.turnContents}>
                            <p className={styles.contentsLabel}>Contents</p>
                            <ContentsList list={list} activeSlug={current?.slug} />
{list.length <= 3 && current && (
                        <div className={styles.note}>
                          <p className={styles.noteHead}>{current.headline ?? current.configuration}</p>
                          <p className={styles.noteBody}>{current.description}</p>
                        </div>
                      )}
                          </div>
                        ) : (
                          <DetailPage p={at(turn.to)} n={turn.to} total={last} volume={volume} inert />
                        )}
                        <span className={styles.turnShade} data-turn-shade />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <nav className={styles.pager} data-pager aria-label={`${vol.city} pages`}>
                <button type="button" onClick={() => goTo(spread - 1)} disabled={spread === 0 || !!turn} aria-label="Previous page">
                  <Arrow dir="left" />
                </button>
                <p className={styles.folio} aria-live="polite">
                  {spread === 0 ? "Contents" : `${pad(spread)} · ${at(spread)?.name}`}
                  <span>
                    {" "}
                    · {spread + 1} of {last + 1}
                  </span>
                </p>
                <button type="button" onClick={() => goTo(spread + 1)} disabled={spread === last || !!turn} aria-label="Next page">
                  <Arrow dir="right" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
