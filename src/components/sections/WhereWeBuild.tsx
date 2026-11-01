"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Map as MapLibreMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { logoPaths } from "@/components/brand/logo-paths";
import { Counter } from "@/components/ui/Counter";
import { SplitReveal } from "@/components/ui/SplitReveal";
import { gsap, useGSAP, MQ, prefersReducedMotion } from "@/lib/gsap";
import { pipeline } from "@/content/site";
import { CITY_MARKERS, GEO, mapProjects, project, TOWNS, VIEWS, type MapCity } from "@/content/locations";
import styles from "./WhereWeBuild.module.css";

type View = "All" | MapCity;
const CITY_ORDER: MapCity[] = ["Silvassa", "Vapi", "Surat", "Daman"];
const TILT: Record<View, number> = { All: 0, Surat: 32, Vapi: 34, Silvassa: 34, Daman: 30 };
const pct = (lat: number, lng: number) => {
  const [x, y] = project(lat, lng);
  return { left: `${x / 10}%`, top: `${y / 8}%` };
};
/** On taller stages (phones) the overview zooms in to fill the frame, held back slightly so Surat's pin
    clears the top edge; city views are framed by width, so they keep their zoom. */
const zoomFor = (v: View, stage: HTMLElement | null) => {
  if (v !== "All") return VIEWS[v].zoom;
  const r = stage ? stage.clientHeight / stage.clientWidth : 0.8;
  return VIEWS[v].zoom * Math.max(1, (r / 0.8) * 0.9);
};

/**
 * Satellite basemap: Esri World Imagery with Esri's place-name reference layer on top. Production use of
 * Esri basemaps needs an ArcGIS account (free tier) and its attribution, which the map shows.
 */
const SATELLITE_STYLE = {
  version: 8 as const,
  sources: {
    imagery: {
      type: "raster" as const,
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "Imagery © Esri, Maxar, Earthstar Geographics",
    },
    places: {
      type: "raster" as const,
      tiles: ["https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"],
      tileSize: 256,
      maxzoom: 19,
    },
  },
  layers: [
    { id: "imagery", type: "raster" as const, source: "imagery", paint: { "raster-saturation": -0.12, "raster-contrast": 0.06 } },
    { id: "places", type: "raster" as const, source: "places", paint: { "raster-opacity": 0.85 } },
  ],
};
/** Map zoom for a view: the same framing as the illustrated map (its zoom factor `s` shows 1.6°/s across). */
const mapZoom = (s: number, width: number) => Math.log2((width * 360 * s) / (256 * 1.6));
/** City views lean in and turn slightly; the overview looks straight down. */
const PITCH: Record<View, number> = { All: 0, Surat: 52, Vapi: 55, Silvassa: 55, Daman: 50 };
const BEARING: Record<View, number> = { All: 0, Surat: -14, Vapi: -10, Silvassa: -12, Daman: -8 };
/** The overview frames all four cities, with room for the pins (which stand above their point) and the chip. */
const CITY_BOUNDS: [[number, number], [number, number]] = [
  [Math.min(...CITY_MARKERS.map((m) => m.lng)), Math.min(...CITY_MARKERS.map((m) => m.lat))],
  [Math.max(...CITY_MARKERS.map((m) => m.lng)), Math.max(...CITY_MARKERS.map((m) => m.lat))],
];
const OVERVIEW_PADDING = { top: 90, bottom: 70, left: 70, right: 90 };

/** Monogram glyph, reused by markers and pins. */
function Mono({ className }: { className?: string }) {
  const [x, y, w, h] = logoPaths.mark.box;
  return (
    <svg className={className} viewBox={`${x} ${y} ${w} ${h}`} aria-hidden="true">
      <path d={logoPaths.mark.paths[0]} />
    </svg>
  );
}

/**
 * "Where we build": a custom map of the Surat–Daman corridor. City tabs fly the camera to each city
 * and tilt the plane into 3D; Pramukh-monogram pins drop in, and pins and the project list highlight
 * each other. Pins sit at locality level (see content/locations.ts).
 */
export function WhereWeBuild() {
  const root = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const satRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [satellite, setSatellite] = useState(false);
  // Camera: focus point (plane units), zoom, tilt (deg). The SVG ground follows via CSS variables;
  // markers and pins live in a flat overlay, projected through the same tilt so they never clip.
  const cam = useRef({ fx: 0, fy: 0, s: 1, t: 0 });
  const [view, setView] = useState<View>("All");
  const [active, setActive] = useState<string | null>(null);

  // Pins sharing a locality fan out in a small spiral (screen pixels, independent of zoom).
  const pins = useMemo(() => {
    const seen = new Map<string, number>();
    return mapProjects.map((p) => {
      const key = `${p.city}:${p.lat},${p.lng}`;
      const i = seen.get(key) ?? 0;
      seen.set(key, i + 1);
      const r = i === 0 ? 0 : 16 * Math.sqrt(i);
      const a = i * 2.39996;
      return { ...p, ox: Math.round(r * Math.cos(a)), oy: Math.round(r * Math.sin(a)) };
    });
  }, []);
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    mapProjects.forEach((p) => (c[p.city] = (c[p.city] ?? 0) + 1));
    return c;
  }, []);
  const list = view === "All" ? [] : mapProjects.filter((p) => p.city === view);
  // Overview panel: every city, biggest first, with the localities its projects sit in.
  const cityIndex = useMemo(
    () =>
      CITY_ORDER.map((c) => ({
        city: c,
        places: Array.from(new Set(mapProjects.filter((p) => p.city === c).map((p) => p.locality))).slice(0, 4).join(" · "),
      })).sort((a, b) => (counts[b.city] ?? 0) - (counts[a.city] ?? 0)),
    [counts],
  );

  const apply = useCallback(() => {
    const stage = stageRef.current;
    const plane = planeRef.current;
    const overlay = overlayRef.current;
    if (!stage || !plane || !overlay) return;
    const map = mapRef.current;
    if (map) {
      overlay.querySelectorAll<HTMLElement>("[data-lng]").forEach((el) => {
        const pt = map.project([Number(el.dataset.lng), Number(el.dataset.lat)]);
        const X = pt.x + Number(el.dataset.ox ?? 0);
        const Y = pt.y + Number(el.dataset.oy ?? 0);
        el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) translate(-50%, -100%)`;
        el.style.zIndex = String(Math.round(Y));
      });
      overlay.dataset.ready = "true";
      return;
    }
    const c = cam.current;
    plane.style.setProperty("--fx", String(c.fx));
    plane.style.setProperty("--fy", String(c.fy));
    plane.style.setProperty("--s", String(c.s));
    stage.style.setProperty("--tilt", `${c.t}deg`);
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const unit = (w / 1000) * c.s;
    const rad = (c.t * Math.PI) / 180;
    const sin = Math.sin(rad);
    const cos = Math.cos(rad);
    const P = 1400; // must match the CSS perspective
    const ox = w * 0.5;
    const oy = h * 0.62; // must match the CSS transform-origin
    overlay.querySelectorAll<HTMLElement>("[data-x]").forEach((el) => {
      const x0 = w / 2 + (Number(el.dataset.x) - c.fx) * unit + Number(el.dataset.ox ?? 0);
      const y0 = h / 2 + (Number(el.dataset.y) - c.fy) * unit + Number(el.dataset.oy ?? 0);
      const dx = x0 - ox;
      const dy = y0 - oy;
      const k = P / (P - dy * sin);
      const X = ox + dx * k;
      const Y = oy + dy * cos * k;
      const sc = Math.min(1.12, Math.max(0.82, k));
      el.style.transform = `translate3d(${X.toFixed(1)}px, ${Y.toFixed(1)}px, 0) translate(-50%, -100%) scale(${sc.toFixed(3)})`;
      el.style.zIndex = String(Math.round(Y));
    });
    overlay.dataset.ready = "true";
  }, []);

  // Initial camera, resize handling and the section entrance.
  useGSAP(
    () => {
      const v = VIEWS.All;
      const [fx, fy] = project(v.lat, v.lng);
      const z = zoomFor("All", stageRef.current);
      Object.assign(cam.current, { fx, fy, s: z, t: 0 });
      apply();
      const ro = new ResizeObserver(() => {
        const vv = VIEWS[viewRef.current];
        cam.current.s = zoomFor(viewRef.current, stageRef.current);
        [cam.current.fx, cam.current.fy] = project(vv.lat, vv.lng);
        apply();
      });
      ro.observe(stageRef.current!);
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const enter = { trigger: stageRef.current, start: "top 80%", toggleActions: "play none none none" };
        gsap.from(stageRef.current, { clipPath: "inset(8% 6% 8% 6% round 18px)", duration: 1.6, ease: "expo.out", clearProps: "clipPath", scrollTrigger: enter });
        gsap.fromTo(cam.current, { s: z * 0.82 }, { s: z, duration: 2.2, ease: "expo.out", onUpdate: apply, scrollTrigger: enter });
        gsap.from("[data-marker] > *", { y: -24, autoAlpha: 0, duration: 0.9, stagger: 0.1, delay: 0.5, ease: "back.out(1.8)", scrollTrigger: enter });
      });
      return () => {
        ro.disconnect();
        mm.revert();
      };
    },
    { scope: root },
  );

  useEffect(() => {
    const host = satRef.current;
    const stage = stageRef.current;
    if (!host || !stage) return;
    let map: MapLibreMap | null = null;
    let cancelled = false;
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        try {
          const maplibre = (await import("maplibre-gl")).default;
          if (cancelled) return;
          const v = VIEWS[viewRef.current];
          const overview = viewRef.current === "All";
          map = new maplibre.Map({
            container: host,
            style: SATELLITE_STYLE,
            ...(overview
              ? { bounds: CITY_BOUNDS, fitBoundsOptions: { padding: OVERVIEW_PADDING } }
              : { center: [v.lng, v.lat] as [number, number], zoom: mapZoom(zoomFor(viewRef.current, stage), stage.clientWidth) }),
            pitch: PITCH[viewRef.current],
            bearing: BEARING[viewRef.current],
            attributionControl: { compact: true },
            cooperativeGestures: true,
            dragRotate: false,
            pitchWithRotate: false,
            maxPitch: 70,
          });
          map.scrollZoom.disable();
          map.on("move", apply);
          map.once("load", () => {
            if (cancelled) return;
            mapRef.current = map;
            apply();
            setSatellite(true);
          });
        } catch {
          // No WebGL or the module failed: the illustrated map carries on.
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(stage);
    const ro = new ResizeObserver(() => {
      const m = mapRef.current;
      if (!m) return;
      m.resize();
      const vv = VIEWS[viewRef.current];
      if (viewRef.current === "All") m.fitBounds(CITY_BOUNDS, { padding: OVERVIEW_PADDING, duration: 0 });
      else m.jumpTo({ center: [vv.lng, vv.lat], zoom: mapZoom(zoomFor(viewRef.current, stage), stage.clientWidth) });
    });
    ro.observe(stage);
    return () => {
      cancelled = true;
      io.disconnect();
      ro.disconnect();
      mapRef.current = null;
      map?.remove();
    };
  }, [apply]);

  // Fly the camera whenever the view changes.
  const viewRef = useRef<View>("All");
  const firstRun = useRef(true);
  useGSAP(
    () => {
      viewRef.current = view;
      if (firstRun.current) {
        firstRun.current = false;
        return;
      }
      const v = VIEWS[view];
      const [fx, fy] = project(v.lat, v.lng);
      const d = prefersReducedMotion() ? 0 : 1;
      const map = mapRef.current;
      if (map && view === "All")
        map.fitBounds(CITY_BOUNDS, { padding: OVERVIEW_PADDING, pitch: 0, bearing: 0, duration: 2000 * d, essential: true });
      else if (map)
        map.flyTo({
          center: [v.lng, v.lat],
          zoom: mapZoom(zoomFor(view, stageRef.current), stageRef.current!.clientWidth),
          pitch: PITCH[view],
          bearing: BEARING[view],
          duration: 2200 * d,
          essential: true,
        });
      else
        gsap.to(cam.current, { fx, fy, s: zoomFor(view, stageRef.current), t: TILT[view], duration: 1.6 * d, ease: "power3.inOut", onUpdate: apply, onComplete: apply, overwrite: "auto" });
      if (view !== "All")
        gsap.fromTo(
          `[data-pin][data-city="${view}"] [data-pin-body]`,
          { y: -22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 * d, stagger: 0.035 * d, delay: 0.9 * d, ease: "back.out(2)", overwrite: true },
        );
      gsap.fromTo("[data-list] > li", { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 * d, stagger: 0.025 * d, ease: "power3.out", overwrite: true });
    },
    { scope: root, dependencies: [view] },
  );

  const choose = (v: View) => {
    setActive(null);
    setView(v);
  };

  return (
    <section ref={root} id="where" data-nav-theme="light" className={styles.where} aria-labelledby="where-title">
      <div className="container">
        <header className={styles.head}>
          <div>
            <SplitReveal as="h2" id="where-title" className={`display ${styles.title}`}>
              Where we build.
            </SplitReveal>
            <p className={styles.lede} data-reveal>
              Four cities along the South Gujarat coast. Choose a city on the map or in the list to see every Pramukh project there.
            </p>
          </div>
          <ul className={styles.pipeline} aria-label="Under development now">
            {pipeline.map((s) => (
              <li key={s.label} data-reveal>
                <Counter value={s.value} suffix={s.suffix} decimals={"decimals" in s ? s.decimals : 0} className={styles.pipelineValue} />
                <span>{s.label}</span>
              </li>
            ))}
          </ul>
        </header>


        <div className={styles.layout}>
          <div className={styles.mapCol}>
            <div className={styles.shell}>
            <div ref={stageRef} className={styles.stage} data-view={view} data-satellite={satellite || undefined} role="group" aria-label="Map of Pramukh projects">
              <div ref={satRef} className={styles.sat} aria-hidden="true" />
              <div className={styles.tilt}>
                <div ref={planeRef} className={styles.plane}>
                  <svg className={styles.geo} viewBox="0 0 1000 800" preserveAspectRatio="none" aria-hidden="true">
                    <path d={GEO.land} className={styles.land} />
                    <path d={GEO.highway} className={styles.highway} />
                    <path d={GEO.tapi} className={styles.river} />
                    <path d={GEO.damanganga} className={styles.river} />
                    <path d={GEO.coast} className={styles.coast} />
                  </svg>

                  <span className={styles.sea} style={pct(20.78, 72.36)} aria-hidden="true">
                    Arabian Sea
                  </span>
                  {TOWNS.map((t) => (
                    <span key={t.name} className={styles.town} style={pct(t.lat, t.lng)} aria-hidden="true">
                      {t.name}
                    </span>
                  ))}

                </div>
              </div>
              <span className={styles.vignette} aria-hidden="true" />
              <div ref={overlayRef} className={styles.overlay}>
              {CITY_MARKERS.map((m) => (
                <button
                  key={m.city}
                  type="button"
                  className={styles.marker}
                  data-x={project(m.lat, m.lng)[0]}
                  data-y={project(m.lat, m.lng)[1]}
                  data-lng={m.lng}
                  data-lat={m.lat}
                  data-marker
                  data-side={m.city === "Daman" ? "left" : m.city === "Vapi" ? "left-low" : undefined}
                  data-visible={view === "All"}
                  tabIndex={view === "All" ? 0 : -1}
                  onClick={() => choose(m.city)}
                  aria-label={`Show ${counts[m.city]} projects in ${m.city}`}
                >
                  <span className={styles.markerDot}>
                    <Mono className={styles.markerMono} />
                  </span>
                  <span className={styles.markerLabel}>
                    {m.city}
                    <sup>{counts[m.city]}</sup>
                  </span>
                </button>
              ))}

              {pins.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  className={styles.pin}
                  data-x={project(p.lat, p.lng)[0]}
                  data-y={project(p.lat, p.lng)[1]}
                  data-lng={p.lng}
                  data-lat={p.lat}
                  data-ox={p.ox}
                  data-oy={p.oy}
                  data-pin
                  data-city={p.city}
                  data-visible={view === p.city}
                  data-active={active === p.name}
                  tabIndex={view === p.city ? 0 : -1}
                  onMouseEnter={() => setActive(p.name)}
                  onMouseLeave={() => setActive((a) => (a === p.name ? null : a))}
                  onFocus={() => setActive(p.name)}
                  onClick={() => setActive((a) => (a === p.name ? null : p.name))}
                  aria-label={`${p.name}, ${p.locality}, ${p.city}`}
                >
                  <span className={styles.pinBody} data-pin-body>
                    <span className={styles.pinHead}>
                      <Mono className={styles.pinMono} />
                    </span>
                    <span className={styles.pinCard} aria-hidden="true">
                      <strong>{p.name}</strong>
                      <span>
                        {p.locality} · {p.config}
                      </span>
                      {p.status && <em>{p.status}</em>}
                    </span>
                  </span>
                </button>
              ))}
              </div>
              <p className={styles.chip} aria-live="polite">
                {view === "All" ? "South Gujarat coast" : `${view} · ${counts[view]} ${counts[view] === 1 ? "project" : "projects"}`}
              </p>
              <p className={styles.legend}>
                <span className={styles.legendPin} aria-hidden="true">
                  <Mono className={styles.legendMono} />
                </span>
                Pramukh project · indicative location{satellite ? " · drag to explore" : ""}
              </p>
              {view !== "All" && (
                <button type="button" className={styles.back} onClick={() => choose("All")}>
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M17 10H4M9 4.5 3.5 10 9 15.5" />
                  </svg>
                  All cities
                </button>
              )}
            </div>
            </div>
          </div>

          <div className={styles.panel}>
            <ul className={styles.list} data-list data-all={view === "All" || undefined} data-lenis-scrollable aria-label={view === "All" ? "Overview" : `Projects in ${view}`}>
              {view === "All"
                ? [
                    <li key="intro" className={styles.empty}>
                      <span className={`display ${styles.emptyNum}`}>{mapProjects.length}</span>
                      <span className={styles.emptyLabel}>projects on the map</span>
                    </li>,
                    ...cityIndex.map(({ city, places }) => (
                      <li key={city} className={styles.cityRowItem}>
                        <button type="button" className={styles.cityRow} onClick={() => choose(city)}>
                          <span className={`display ${styles.cityRowName}`}>{city}</span>
                          <span className={styles.cityRowPlaces}>{places}</span>
                          <span className={styles.cityRowCount}>
                            {counts[city]} {counts[city] === 1 ? "project" : "projects"}
                          </span>
                          <span className={styles.cityRowArrow} aria-hidden="true">
                            <svg viewBox="0 0 20 20">
                              <path d="M3 10h13M11 4.5 16.5 10 11 15.5" />
                            </svg>
                          </span>
                        </button>
                      </li>
                    )),
                  ]
                : list.map((p) => (
                    <li key={p.name}>
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.row}
                        data-active={active === p.name}
                        onMouseEnter={() => setActive(p.name)}
                        onMouseLeave={() => setActive((a) => (a === p.name ? null : a))}
                        onFocus={() => setActive(p.name)}
                      >
                        <span className={styles.rowName}>{p.name}</span>
                        <span className={styles.rowMeta}>
                          {p.locality} · {p.config}
                        </span>
                        {p.status && <span className={styles.rowStatus}>{p.status}</span>}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
