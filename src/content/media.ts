import { mediaManifest } from "./media.generated";

export type MediaKey = keyof typeof mediaManifest;
export type MediaAsset = (typeof mediaManifest)[MediaKey];

export const media = (key: MediaKey): MediaAsset => mediaManifest[key];

/** Tall phone screens get the portrait cut (poster and video); tablets use the landscape files. */
export const PORTRAIT_MQ = "(orientation: portrait) and (max-aspect-ratio: 2/3)";

export const video = {
  heroAerial: {
    large: "/media/hero-aerial.mp4", // 1920 wide
    medium: "/media/hero-aerial-1280.mp4", // 1280 wide
    portrait: "/media/hero-aerial-portrait.mp4", // 648x1080 native crop
    poster: "hero/poster" as MediaKey,
    posterPortrait: "hero/poster-portrait" as MediaKey,
  },
} as const;

/** Picks the smallest hero loop that still covers the screen at its pixel density. */
export function pickHeroVideo() {
  if (window.matchMedia(PORTRAIT_MQ).matches) return video.heroAerial.portrait;
  const needed = Math.max(window.innerWidth, window.innerHeight * (16 / 9)) * Math.min(window.devicePixelRatio || 1, 2);
  return needed > 1500 ? video.heroAerial.large : video.heroAerial.medium;
}
