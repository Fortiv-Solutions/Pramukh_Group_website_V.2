import { logoPaths } from "./logo-paths";

type Part = keyof typeof logoPaths;

function LogoPart({ part, className, title }: { part: Part; className?: string; title?: string }) {
  const { paths, box } = logoPaths[part];
  return (
    <svg
      viewBox={box.join(" ")}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} data-glyph={i} />
      ))}
    </svg>
  );
}

/** Monogram in brand gold. */
export function Monogram({ className }: { className?: string }) {
  return (
    <span style={{ color: "var(--c-gold)", display: "contents" }}>
      <LogoPart part="mark" className={className} />
    </span>
  );
}

/** PRAMUKH wordmark; inherits text colour so it works on light and dark grounds. */
export function Wordmark({ className, title }: { className?: string; title?: string }) {
  return <LogoPart part="word" className={className} title={title} />;
}

/** Original artwork colours from assets/pramukh-logo.svg. */
export const LOGO_GOLD = "#C4A359";
export const LOGO_GREY = "#434242";

/**
 * The complete Pramukh logo (monogram, PRAMUKH, A CLASS OF ITS OWN) drawn from the exact paths and
 * canvas of assets/pramukh-logo.svg. The wordmark reads `--logo-word` so it can switch to the
 * brand's light-on-dark rendering over photography; it defaults to the file's grey.
 */
export function BrandLogo({
  className,
  title = "Pramukh — A Class of Its Own",
  maskId,
}: {
  className?: string;
  title?: string | null;
  /** When set, the two text rows are clipped to their own line so glyphs can rise in from a mask. */
  maskId?: string;
}) {
  const clip = (row: string) => (maskId ? `url(#${maskId}-${row})` : undefined);
  return (
    <svg
      viewBox="0 0 1365 792.51"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title ?? undefined}
      aria-hidden={title ? undefined : true}
    >
      {maskId && (
        <defs>
          <clipPath id={`${maskId}-word`}>
            <rect x="-20" y="500" width="1405" height="166" />
          </clipPath>
          <clipPath id={`${maskId}-tagline`}>
            <rect x="140" y="715" width="1030" height="92" />
          </clipPath>
        </defs>
      )}
      <g data-logo="mark" fill={LOGO_GOLD}>
        {logoPaths.mark.paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g data-logo="word" style={{ fill: `var(--logo-word, ${LOGO_GREY})` }} clipPath={clip("word")}>
        {logoPaths.word.paths.map((d, i) => (
          <path key={i} d={d} data-glyph={i} />
        ))}
      </g>
      <g data-logo="tagline" fill={LOGO_GOLD} clipPath={clip("tagline")}>
        {logoPaths.tagline.paths.map((d, i) => (
          <path key={i} d={d} data-glyph={i} />
        ))}
      </g>
    </svg>
  );
}
