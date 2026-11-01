/**
 * Central asset map. Every image the site uses is listed here once.
 * To swap an image: change `source`, then run `npm run media`.
 *
 * key      → name components import (media["one-tapi/hero"])
 * source   → file in /assets (or /.media-cache for frames pulled from video)
 * width    → max output width; originals are never upscaled
 * alt      → descriptive alt text (empty string = decorative)
 */
export const SOURCE_DIR = "assets";
export const OUTPUT_DIR = "public/media";

export const images = [
  // Hero
  { key: "hero/poster", source: ".media-cache/hero-poster.jpg", width: 1920, alt: "Aerial view of One Tapi beside the Tapi river, Surat" },
  { key: "hero/poster-portrait", source: ".media-cache/hero-poster-portrait.jpg", width: 648, alt: "Aerial view of One Tapi beside the Tapi river, Surat" },

  // Intro
  { key: "intro/plans", source: "about-img-1.jpg", width: 1200, alt: "Architectural drawings dated 1993 laid out on a desk" },
  { key: "intro/gallery", source: "about-img.jpg", width: 1200, alt: "Visitors reviewing a project model at a Pramukh sales gallery" },

  // Projects
  { key: "one-tapi/hero", source: "one-tapi-banner.jpg", width: 2200, alt: "One Tapi rising above the riverside promenade in Piplod, Surat" },
  { key: "one-tapi/night", source: "one-tapi.jpg", width: 1200, alt: "One Tapi's curved facade lit at dusk" },
  { key: "one-tapi/garden", source: "one-tapi-gallery-5.jpg", width: 1200, alt: "Landscaped gardens at the base of One Tapi" },
  { key: "one-tapi/entrance", source: "entrance-view.jpg", width: 1200, alt: "Arrival court and entrance of One Tapi" },
  { key: "one-tapi/aerial", source: "bird-view-1.jpg", width: 1200, alt: "Bird's-eye view of One Tapi and its podium gardens" },
  { key: "one-tapi/topdown", source: ".media-cache/one-tapi-topdown.jpg", width: 1920, alt: "Top-down view of One Tapi's wave-shaped terraces and pool deck" },

  { key: "agastya/hero", source: "agastya-banner.jpg", width: 2000, alt: "Agastya residential towers in Vesu, Surat" },
  { key: "agastya/night", source: "agastya-gallery-3.jpg", width: 1200, alt: "Agastya facade and entrance illuminated at night" },
  { key: "agastya/court", source: "agastya-gallery-4.jpg", width: 1200, alt: "Central lawn between Agastya's towers" },

  { key: "revanta/hero", source: "revanta-banner.jpg", width: 2200, alt: "Revanta's three towers at night, Vesu, Surat" },
  { key: "aranya-iii/hero", source: "aranya-iii-banner.jpg", width: 2200, alt: "Water feature and retail frontage at Aranya III, Godadara" },
  { key: "aranya-iii/night", source: "aranya-iii.jpg", width: 1400, alt: "Aranya III towers framing a central garden at night" },

  { key: "orbit-5/hero", source: "orbit-5-banner.jpg", width: 2200, alt: "Shopfronts and arrival plaza at Orbit 5, Vesu" },
  { key: "orbit-5/tower", source: "orbit-5.jpg", width: 1200, alt: "Orbit 5 commercial tower with glass facade" },
  { key: "zenith/hero", source: "zenith-banner.jpg", width: 2200, alt: "Zenith's double-height showroom frontage in Vesu, Surat" },
  { key: "zenith/tower", source: "zenith-gallery-3.jpg", width: 1200, alt: "Zenith commercial tower with cantilevered bands" },

  { key: "aristo/hero", source: "aristo-banner.jpg", width: 2200, alt: "Aristo residential towers in Chala, Vapi" },
  { key: "vedanta/hero", source: "vedanta-banner.jpg", width: 2200, alt: "Vedanta towers among trees in New Chala, Vapi" },
  { key: "green-county/hero", source: "green-county-banner.jpg", width: 2400, alt: "Green County apartments and children's water play area, Vapi" },
  { key: "green-county/entrance", source: "green-county-gallery-1.jpg", width: 1400, alt: "Illuminated Green County entrance wall and water channel" },
  { key: "green-county/porch", source: "green-county-gallery-3.jpg", width: 1400, alt: "Covered arrival porch at Green County" },

  { key: "shivanta/hero", source: "shivanta-banner.jpg", width: 2200, alt: "Shivanta apartment blocks beyond a landscaped lawn, Silvassa" },
  { key: "yogi-woods/hero", source: "yogi-woods-banner.jpg", width: 2200, alt: "Yogi Woods towers and entrance plaza, Silvassa" },
  { key: "swagat/hero", source: "swagat-banner.jpg", width: 2200, alt: "Swagat apartment blocks along a tree-lined street, Silvassa" },
  { key: "marina-bay/hero", source: "marina-bay-banner.jpg", width: 2200, alt: "Marina Bay's twin wings lit at night, Daman" },

  { key: "swarit/street", source: "swarit-cross-street-night.jpg", width: 1400, alt: "Swarit bungalows along an internal street at dusk, New Chala, Vapi" },
  { key: "swarit/hero", source: "swarit-banner.jpg", width: 2200, alt: "Swarit bungalow frontage with palms, New Chala, Vapi" },
  { key: "harmony/hero", source: "harmony-banner.jpg", width: 2200, alt: "Harmony bungalows in Silvassa" },

  // What we build: hospitality and industrial. No imagery of the Lemon Tree / Treat hotels or the
  // Samruddhi industrial park exists in the assets or on pramukh.com, so these are honest stand-ins
  // (Pramukh hospitality interiors; Pramukh's land banner and Surat location map). Swap when available.
  { key: "hospitality/lounge", source: "social-club-and-lounge.jpg", width: 1200, alt: "Social club and lounge at One Tapi, Surat" },
  { key: "hospitality/banquet", source: "banquet-hall.jpg", width: 1200, alt: "Banquet hall at One Tapi, Surat" },
  { key: "land/banner", source: "land-banner.jpg", width: 1920, alt: "Planning a land development with a site plan and model" },
  { key: "land/surat-map", source: "surat-map.jpg", width: 1508, alt: "Map of Surat marking Pramukh's locations" },
  // Stock stand-in (Unsplash, Bernd Dittrich, photo 3MPN1ILQL7U, Unsplash License): not a Pramukh site.
  { key: "industrial/park", source: "industrial-park.jpg", width: 1600, alt: "Aerial view of a modern warehouse with a solar roof beside open plots" },

  // Brand
  { key: "brand/founder", source: "nathu-bhai.jpg", width: 401, alt: "Shri. Natubhai R. Bhatu, founder of Pramukh Group" },
  // Leadership portraits, from pramukh.com/team.html.
  { key: "leaders/natubhai", source: "nathu-bhai.jpg", width: 401, alt: "Mr. Natubhai R. Bhatu, Founder and Chairman" },
  { key: "leaders/virambhai", source: "virambhai-r-bhatu.jpg", width: 401, alt: "Mr. Virambhai R. Bhatu, Promoter" },
  { key: "leaders/devshibhai", source: "devshibhai-l-bhatu.jpg", width: 401, alt: "Mr. Devshibhai L. Bhatu, Senior Promoter" },
  { key: "leaders/ajitbhai", source: "ajitbhai.png", width: 401, alt: "Mr. Ajitbhai H. Khodbhaya, Promoter" },
  { key: "leaders/prashant", source: "prashant-bhatu.webp", width: 400, alt: "Mr. Prashant Bhatu, Managing Director, Surat" },
  { key: "leaders/raj", source: "raj-bhatu.png", width: 401, alt: "Mr. Raj Bhatu, Sales and Marketing Director, Vapi" },
  { key: "brand/model", source: "our-projects.jpg", width: 650, alt: "Architectural scale model of a Pramukh development" },
  { key: "city/surat", source: "surat.jpg", width: 650, alt: "Aerial view of Surat and the Tapi river" },
  { key: "city/vapi", source: "vapi.jpg", width: 650, alt: "Aerial view of Vapi" },
  { key: "city/silvassa", source: "silvassa.jpg", width: 650, alt: "Aerial view of Silvassa and the Damanganga river" },
  { key: "city/daman", source: "marina-bay-gallery-8.jpg", width: 1200, alt: "Aerial view of the Daman coastline with Marina Bay" },
];

/** Video clips cut from the supplied project films. Times are in seconds. */
export const videos = [
  {
    key: "hero-aerial",
    source: "one-tapi-video.mp4",
    start: 129.6,
    end: 133.4,
    pingPong: true,
    // Landscape for desktop/tablet; a native-resolution portrait crop (centred on the tower) for phones,
    // so small screens never upscale a landscape frame. Lower CRF = sharper.
    outputs: [
      { suffix: "", width: 1920, crf: 23, maxrate: "5M" },
      { suffix: "-1280", width: 1280, crf: 23, maxrate: "3M" },
      { suffix: "-portrait", crop: "648:1080:600:0", width: 648, crf: 22, maxrate: "2.6M" },
    ],
  },
];

/** Still frames pulled from video, written to .media-cache before images are processed. */
export const frames = [
  { source: "one-tapi-video.mp4", time: 129.7, out: ".media-cache/hero-poster.jpg" },
  { source: "one-tapi-video.mp4", time: 129.7, crop: "648:1080:600:0", out: ".media-cache/hero-poster-portrait.jpg" },
  { source: "one-tapi-video.mp4", time: 127.6, out: ".media-cache/one-tapi-topdown.jpg" },
];
