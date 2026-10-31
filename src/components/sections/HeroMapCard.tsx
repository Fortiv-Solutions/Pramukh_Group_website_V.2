"use client";

import type { MouseEvent } from "react";
import { Img } from "@/components/ui/Img";
import { useScroll } from "@/components/SmoothScroll";
import { logoPaths } from "@/components/brand/logo-paths";
import { CITY_MARKERS, GEO, mapProjects, project } from "@/content/locations";
import styles from "./HeroMapCard.module.css";

/**
 * A small double-bezel card in the hero's lower right: a mini corridor map overlapping a project
 * photograph, a nested arrow, and a two-line label. It scrolls to the "Where we build" map.
 * Phones get a compact frosted pill instead ("Map" + a pin disc), level with the hero's button.
 */
function MiniMap() {
  return (
    <svg viewBox="300 30 470 470" preserveAspectRatio="xMidYMid slice">
      <rect x="0" y="0" width="1000" height="800" className={styles.sea} />
      <path d={GEO.land} className={styles.land} />
      <path d={GEO.tapi} className={styles.river} />
      <path d={GEO.damanganga} className={styles.river} />
      {CITY_MARKERS.map((m) => {
        const [x, y] = project(m.lat, m.lng);
        return (
          <circle key={m.city} cx={x} cy={y} r="13" className={styles.dot} />
        );
      })}
    </svg>
  );
}

export function HeroMapCard() {
  const scroll = useScroll();
  const go = (e: MouseEvent) => {
    e.preventDefault();
    scroll.scrollTo("#where");
  };
  // The entrance tween runs on the wrapper: the card's own CSS transform transition would otherwise make
  // GSAP read a mid-transition value as its resting state and leave the card offset.
  return (
    <>
      <div className={styles.miniSlot} data-hero-card>
        <a href="#where" className={styles.mini} onClick={go}>
          <span className={styles.miniLabel}>Map</span>
          <span className={styles.miniPin} aria-hidden="true">
            <svg viewBox={logoPaths.mark.box.join(" ")}>
              <path d={logoPaths.mark.paths[0]} />
            </svg>
          </span>
          <span className="sr-only">
            : explore {mapProjects.length} projects across 4 cities
          </span>
        </a>
      </div>
      <div className={styles.slot} data-hero-card>
        <a href="#where" className={styles.card} onClick={go}>
          <span className={styles.core}>
            <span className={styles.top}>
              <span className={styles.thumbs} aria-hidden="true">
                <span className={`${styles.thumb} ${styles.mapThumb}`}>
                  <MiniMap />
                </span>
                <span className={`frame ${styles.thumb} ${styles.photoThumb}`}>
                  <Img k="one-tapi/night" sizes="72px" />
                </span>
              </span>
              <span className={styles.arrow} aria-hidden="true">
                <svg viewBox="0 0 20 20">
                  <path d="M6 14 14 6M7.5 6H14v6.5" />
                </svg>
              </span>
            </span>
            <span className={styles.label}>
              <span className={`display ${styles.title}`}>
                Explore
                <br />
                the map
              </span>
              <span className={styles.meta}>
                {mapProjects.length} projects · 4 cities
              </span>
            </span>
          </span>
        </a>
      </div>
    </>
  );
}
