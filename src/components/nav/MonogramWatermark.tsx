import { logoPaths } from "@/components/brand/logo-paths";
import styles from "./MonogramWatermark.module.css";

/**
 * The Pramukh monogram as a menu watermark: a fine gold outline that the menu timeline draws
 * (stroke-dashoffset on a normalised pathLength), then a faint fill and a soft glow behind it.
 */
export function MonogramWatermark({ className }: { className?: string }) {
  const [x, y, w, h] = logoPaths.mark.box;
  const d = logoPaths.mark.paths[0];
  const m = 12;
  return (
    <div className={`${styles.wrap} ${className ?? ""}`} data-watermark aria-hidden="true">
      <span className={styles.glow} data-watermark-glow />
      <svg viewBox={`${x - m} ${y - m} ${w + 2 * m} ${h + 2 * m}`} className={styles.svg}>
        <path d={d} className={styles.fill} data-watermark-fill />
        <path d={d} className={styles.stroke} pathLength={1} data-watermark-stroke />
      </svg>
    </div>
  );
}
