/**
 * Projects for the "Where we build" map. Names, localities, configurations and statuses are from the
 * Surat, Vapi and Silvassa city pages on pramukh.com (Daman: Marina Bay page). Lemon Tree and Treat
 * (Surat hotels) are listed without a locality, so they are not pinned.
 *
 * ⚠ Coordinates are INDICATIVE, placed at locality level (Vesu, Chala, Samarvani...), not at the site.
 * Replace with surveyed site coordinates from the Pramukh team before launch.
 */
export type MapCity = "Surat" | "Vapi" | "Silvassa" | "Daman";

export type MapProject = {
  name: string;
  city: MapCity;
  locality: string;
  config: string;
  status?: string;
  href: string;
  lat: number;
  lng: number;
};

const page = (slug: string) => `https://pramukh.com/${slug}.html`;
const SURAT = page("surat");
const VAPI = page("vapi");
const SILVASSA = page("silvassa");

/** Approximate locality centres. */
const L = {
  piplod: [21.1545, 72.7795],
  vesu: [21.1418, 72.771],
  godadara: [21.164, 72.87],
  pal: [21.1985, 72.765],
  palanpur: [21.2075, 72.774],
  bhatar: [21.1745, 72.807],
  hazira: [21.115, 72.645],
  niyol: [21.129, 72.958],
  parvatPatiya: [21.183, 72.862],
  punagam: [21.202, 72.889],
  chala: [20.388, 72.91],
  newChala: [20.38, 72.904],
  gunjan: [20.372, 72.923],
  nh48: [20.379, 72.93],
  samarvani: [20.295, 72.994],
  ringRoad: [20.27, 73.01],
  kamliFaliya: [20.265, 73.006],
  kilvaniNaka: [20.283, 73.023],
  lionsSchool: [20.276, 73.004],
  bhurkud: [20.26, 73.015],
  jailRoad: [20.279, 73.011],
  krishnaCompany: [20.2985, 72.9985],
  daman: [20.41, 72.829],
} as const;

const p = (
  name: string,
  city: MapCity,
  locality: string,
  at: readonly [number, number],
  config: string,
  status: string | undefined,
  href: string,
): MapProject => ({ name, city, locality, config, status, href, lat: at[0], lng: at[1] });

export const mapProjects: MapProject[] = [
  // Surat
  p("One Tapi", "Surat", "Piplod", L.piplod, "5 BHK penthouses", "Ongoing", page("one-tapi")),
  p("Aranya III", "Surat", "Godadara", L.godadara, "Exclusive 3 BHK apartments", "Ongoing", page("aranya-iii")),
  p("Satva", "Surat", "Vesu", L.vesu, "3 BHK apartments", "Ongoing", SURAT),
  p("Central Park", "Surat", "Pal", L.pal, "3, 3.5, 4 & 4.5 BHK apartments", "Ongoing", SURAT),
  p("Amaya", "Surat", "Palanpur", L.palanpur, "2–3 BHK apartments", "Ongoing", SURAT),
  p("Agastya", "Surat", "Vesu", L.vesu, "4 BHK apartments", "Ongoing", page("agastya")),
  p("Revanta", "Surat", "Vesu", L.vesu, "3 BHK luxury apartments", "Ongoing", page("revanta")),
  p("Ananta", "Surat", "Vesu", L.vesu, "4 BHK apartments", "Ongoing", SURAT),
  p("Zenith", "Surat", "Vesu", L.vesu, "Showrooms, offices, cafés, restaurants", "Ongoing", page("zenith")),
  p("Orbit 5", "Surat", "Vesu", L.vesu, "Offices, shops, showrooms", "Ongoing", page("orbit-5")),
  p("Orbit 4", "Surat", "Bhatar", L.bhatar, "Offices, shops, showrooms", "Ongoing", SURAT),
  p("Orbit 3", "Surat", "Vesu", L.vesu, "Showrooms, offices, cafés, restaurants", "Ongoing", SURAT),
  p("Orbit Plaza", "Surat", "Godadara", L.godadara, "Shops, showrooms", "Ongoing", SURAT),
  p("Anantara", "Surat", "Hazira", L.hazira, "Residential plotting", "Proposed", SURAT),
  p("Samruddhi", "Surat", "Niyol", L.niyol, "Industrial plotting", "Ongoing", SURAT),
  p("Aranya", "Surat", "Parvat Patiya", L.parvatPatiya, "3 BHK apartments", "Completed", SURAT),
  p("Aranya II", "Surat", "Godadara", L.godadara, "2–3 BHK eco apartments", "Completed", SURAT),
  p("Vivanta", "Surat", "Vesu", L.vesu, "3 BHK apartments", "Completed", SURAT),
  p("Orbit 2", "Surat", "Vesu", L.vesu, "Showrooms, offices", "Completed", SURAT),
  p("Orbit 1", "Surat", "Punagam–Saroli Road", L.punagam, "Showrooms, offices", "Completed", SURAT),
  // Vapi
  p("Aristo", "Vapi", "Chala", L.chala, "3, 4 & 5 BHK apartments", "Ready to move", page("aristo")),
  p("Vedanta", "Vapi", "New Chala", L.newChala, "3 & 4 BHK apartments", "Ready to move", page("vedanta")),
  p("Green County", "Vapi", "Nr. Gunjan", L.gunjan, "3 & 4 BHK ultra-luxurious apartments", "Ongoing", page("green-county")),
  p("Swarit", "Vapi", "New Chala", L.newChala, "4 & 5 BHK bungalows", "Ready to move", VAPI),
  p("Vivan", "Vapi", "New Chala", L.newChala, "1.5 & 2 BHK apartments", "Ready to move", VAPI),
  p("Silver Stone", "Vapi", "New Chala", L.newChala, "3 & 4 BHK", "Under construction", VAPI),
  p("Blue Stone", "Vapi", "New Chala", L.newChala, "2 & 3 BHK & shops", "Under construction", VAPI),
  p("Orbit", "Vapi", "Nr. NH 48", L.nh48, "Offices & showrooms", "Ready to move", VAPI),
  // Silvassa
  p("Swagat 2", "Silvassa", "Behind Lions School", L.lionsSchool, "2 BHK & shops", "Just launched", SILVASSA),
  p("Meadows 2", "Silvassa", "Kamli Faliya", L.kamliFaliya, "2 & 3 BHK & shops", "Pre-launch", SILVASSA),
  p("Harmony-2", "Silvassa", "Bhurkud Faliya", L.bhurkud, "4 & 5 BHK bungalows", "Pre-launch", SILVASSA),
  p("Nakshatra-2", "Silvassa", "Samarvani", L.krishnaCompany, "1 & mini 2 BHK & shops", "Just launched", SILVASSA),
  p("Bliss-2", "Silvassa", "Jail Road", L.jailRoad, "3 BHK", "Just launched", SILVASSA),
  p("Shivanta", "Silvassa", "Samarvani", L.samarvani, "2–3 BHK apartments", "Under construction", page("shivanta")),
  p("Yogi Woods", "Silvassa", "Ring Road", L.ringRoad, "2–3 BHK apartments", "Ongoing", page("yogi-woods")),
  p("Gardens-2", "Silvassa", "Nr. Kilvani Naka", L.kilvaniNaka, "3–4 BHK apartments", "Ready possession", SILVASSA),
  p("Swagat", "Silvassa", "Nr. Lions English School", L.lionsSchool, "1.5–2 BHK apartments", "Ready possession", page("swagat")),
  p("Meadows", "Silvassa", "Ring Road, Kamli Faliya", L.kamliFaliya, "2–3 BHK apartments", "Ready possession", SILVASSA),
  p("Harmony", "Silvassa", "Ring Road, Kamli Faliya", L.kamliFaliya, "4–5 BHK bungalows", "Ready possession", SILVASSA),
  p("Sangath", "Silvassa", "Krishna Company Road", L.krishnaCompany, "2 & 3 BHK apartments", "Ready possession", SILVASSA),
  // Daman
  p("Marina Bay", "Daman", "Daman", L.daman, "Studio, 1 & 2 BHK apartments", undefined, page("marina-bay")),
];

/* ---------- Projection: a 1000 x 800 plane over the South Gujarat coast ---------- */
export const PLANE = { w: 1000, h: 800 };
const BOUNDS = { north: 21.3, south: 20.1, west: 72.0, east: 73.6 };
/** Equirectangular, aspect-corrected for ~20.7°N (1.6° lng x cos ≈ 1.5 ≈ 1.25 x 1.2° lat). */
export function project(lat: number, lng: number): [number, number] {
  return [
    ((lng - BOUNDS.west) / (BOUNDS.east - BOUNDS.west)) * PLANE.w,
    ((BOUNDS.north - lat) / (BOUNDS.north - BOUNDS.south)) * PLANE.h,
  ];
}

/** Camera per view: centre (lat, lng) and zoom. */
export const VIEWS: Record<"All" | MapCity, { lat: number; lng: number; zoom: number }> = {
  All: { lat: 20.7, lng: 72.84, zoom: 1.0 },
  Surat: { lat: 21.16, lng: 72.8, zoom: 3.2 },
  Vapi: { lat: 20.381, lng: 72.916, zoom: 10 },
  Silvassa: { lat: 20.279, lng: 73.008, zoom: 8 },
  Daman: { lat: 20.41, lng: 72.84, zoom: 7 },
};

/** City markers for the overview. */
export const CITY_MARKERS: { city: MapCity; lat: number; lng: number }[] = [
  { city: "Surat", lat: 21.17, lng: 72.83 },
  { city: "Daman", lat: 20.414, lng: 72.832 },
  { city: "Vapi", lat: 20.378, lng: 72.912 },
  { city: "Silvassa", lat: 20.276, lng: 73.012 },
];

/** Faint reference towns on the corridor (orientation only). */
export const TOWNS: { name: string; lat: number; lng: number }[] = [
  { name: "Navsari", lat: 20.95, lng: 72.93 },
  { name: "Valsad", lat: 20.61, lng: 72.93 },
];

const path = (pts: [number, number][], close = false) =>
  pts.map(([lat, lng], i) => `${i ? "L" : "M"}${project(lat, lng).map((v) => v.toFixed(1)).join(" ")}`).join(" ") + (close ? " Z" : "");

/** Simplified geography: coastline (land polygon), the Tapi and Damanganga rivers, NH 48. */
// Extends well beyond the plane on every side so the land never shows an edge when tilted or zoomed.
const COAST: [number, number][] = [
  [22.6, 72.55], [22.0, 72.58], [21.6, 72.6], [21.3, 72.62], [21.2, 72.64], [21.13, 72.625], [21.09, 72.665], [21.03, 72.7], [20.93, 72.74],
  [20.85, 72.76], [20.75, 72.81], [20.63, 72.86], [20.52, 72.865], [20.43, 72.835], [20.41, 72.826],
  [20.33, 72.79], [20.22, 72.75], [20.1, 72.72], [19.6, 72.7], [19.0, 72.72],
];
export const GEO = {
  land: path([...COAST, [19.0, 75.0], [22.6, 75.0]], true),
  coast: path(COAST),
  tapi: path([[21.3, 73.4], [21.26, 73.08], [21.22, 72.96], [21.2, 72.89], [21.19, 72.85], [21.175, 72.81], [21.16, 72.78], [21.13, 72.73], [21.095, 72.67]]),
  damanganga: path([[20.1, 73.3], [20.2, 73.1], [20.25, 73.04], [20.285, 73.0], [20.33, 72.95], [20.37, 72.905], [20.398, 72.86], [20.412, 72.832]]),
  highway: path([[22.6, 72.95], [21.3, 72.9], [21.17, 72.865], [21.05, 72.9], [20.95, 72.93], [20.78, 72.94], [20.62, 72.935], [20.5, 72.925], [20.38, 72.925], [20.25, 72.905], [20.1, 72.885], [19.0, 72.86]]),
};
