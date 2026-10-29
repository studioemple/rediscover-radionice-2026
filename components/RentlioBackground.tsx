"use client";

/**
 * RentlioBackground
 * ─────────────────
 * The Rentlio Rediscover 2026 landing-page backdrop as ONE drop-in component:
 *   • 4 thin vertical hairlines running the full page height
 *   • slowly rotating Rentlio circle marks (partly off-screen at the edges)
 *   • oversized diagonal lines + a few horizontal hairlines (desktop only)
 *   • everything drifts very gently; respects prefers-reduced-motion
 *
 * USAGE — wrap the page content:
 *
 *   import { RentlioBackground } from "@/components/RentlioBackground";
 *
 *   <RentlioBackground>
 *     ...all your page sections...
 *   </RentlioBackground>
 *
 * The component measures the height of what it wraps and repeats the pattern
 * all the way down, so it works for any page length, on mobile and desktop.
 *
 * Zero dependencies besides React: no Tailwind, no GSAP, no image files
 * (the Rentlio circle SVG is inlined below).
 *
 * Props:
 *   stroke  – line colour (default "#D9D9D9", same as the landing page)
 *   fixed   – true = backdrop pinned to the viewport (does not scroll).
 *             Use for app-like layouts where an inner panel scrolls.
 *   className / style – forwarded to the wrapper <div>.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* Vertical hairlines, in % of the page width (outer pair 10/90, inner pair
   splitting the middle into three equal gaps). */
const VERTICAL_LINES = [10, 36.6667, 63.3333, 90];

type CircleX = "edge-left" | "edge-right" | `${number}%`;

type Decor =
  | { kind: "circle"; at: number; x: CircleX; size: number; rot?: number }
  | { kind: "diagonal"; at: number; flip?: boolean }
  | { kind: "hline"; at: number };

/* One period of the pattern. `at` is measured in "bands" (1 band ≈ one screen
   height), and the whole period repeats every PERIOD bands down the page.
   Taken from the first screens of the Rediscover landing page. */
const PERIOD = 4;
const PATTERN: Decor[] = [
  { kind: "diagonal", at: 0.04 },
  { kind: "hline", at: 0.18 },
  { kind: "circle", at: 0.38, x: "edge-left", size: 630 },
  { kind: "circle", at: 0.62, x: "edge-right", size: 630 },
  { kind: "diagonal", at: 0.76, flip: true },
  { kind: "hline", at: 0.92 },
  { kind: "circle", at: 1.45, x: "78%", size: 266 },
  { kind: "hline", at: 1.75 },
  { kind: "diagonal", at: 2.15 },
  { kind: "circle", at: 2.6, x: "-6%", size: 644, rot: 0 },
  { kind: "hline", at: 2.9 },
  { kind: "circle", at: 3.2, x: "8%", size: 350 },
  { kind: "diagonal", at: 3.45, flip: true },
  { kind: "circle", at: 3.65, x: "80%", size: 266 },
];

/* Band height in px: one screen, clamped so very short / very tall windows
   still get a sensible density. */
const clampBand = (h: number) => Math.min(Math.max(h, 640), 1100);

type Layout = { band: number; limit: number };

export function RentlioBackground({
  children,
  stroke = "#D9D9D9",
  fixed = false,
  className,
  style,
}: {
  children?: ReactNode;
  stroke?: string;
  fixed?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  // null until measured on the client → no SSR/hydration mismatch.
  const [layout, setLayout] = useState<Layout | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    let lastWidth = window.innerWidth;
    let band = clampBand(window.innerHeight);

    const update = () => {
      // Only re-derive the band on WIDTH changes, so the mobile browser
      // toolbar showing/hiding (height-only resize) never shifts anything.
      if (window.innerWidth !== lastWidth) {
        lastWidth = window.innerWidth;
        band = clampBand(window.innerHeight);
      }
      const height = fixed ? window.innerHeight : el.offsetHeight;
      // Quarter-band granularity keeps re-renders rare.
      const limit = Math.ceil((height / band) * 4) / 4;
      setLayout((prev) =>
        prev && prev.band === band && prev.limit === limit
          ? prev
          : { band, limit },
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, [fixed]);

  /* Expand the repeating pattern down to the measured page height. */
  const items: { d: Decor; top: number; i: number }[] = [];
  if (layout) {
    const periods = Math.ceil(layout.limit / PERIOD);
    let i = 0;
    for (let p = 0; p < periods; p++) {
      for (const d of PATTERN) {
        const at = d.at + p * PERIOD;
        if (at < layout.limit) items.push({ d, top: at * layout.band, i });
        i++;
      }
    }
  }

  return (
    <div
      ref={rootRef}
      className={className}
      /* isolation: the backdrop sits at z-index -1 INSIDE this wrapper — above
         the wrapper's own background, below all of its content. */
      style={{ position: "relative", isolation: "isolate", ...style }}
    >
      <div
        aria-hidden
        className="rbg-layer"
        style={{
          position: fixed ? "fixed" : "absolute",
          inset: 0,
          zIndex: -1,
          overflow: "hidden",
          pointerEvents: "none",
          animation: "rbgFadeIn 1.1s ease-out both",
        }}
      >
        {/* Vertical hairlines — full height, all screen sizes */}
        {VERTICAL_LINES.map((pct, i) => (
          <div
            key={`v-${pct}`}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${pct}%`,
              width: 1,
              background: stroke,
              animation: `rbgDriftX${i % 2} ${24 + i * 3}s ease-in-out ${i * 0.7}s infinite`,
              willChange: "transform",
            }}
          />
        ))}

        {items.map(({ d, top, i }) => {
          const drift = `rbgDriftDecor${i % 3} ${32 + (i % 5) * 4}s ease-in-out ${(i * 0.9) % 6}s infinite`;

          /* Horizontal hairline — desktop only (would cut through stacked
             content on phones). */
          if (d.kind === "hline") {
            return (
              <div
                key={`h-${i}`}
                className="rbg-desktop-only"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top,
                  height: 1,
                  background: stroke,
                  animation: `rbgDriftY${i % 2} ${28 + (i % 5) * 2.5}s ease-in-out ${(i * 1.1) % 5}s infinite`,
                  willChange: "transform",
                }}
              />
            );
          }

          /* Diagonal — oversized (140vw, bleeding 20vw off each side) so its
             endpoints are never visible. Desktop only. */
          if (d.kind === "diagonal") {
            const h = Math.round((layout?.band ?? 900) * 0.48);
            return (
              <svg
                key={`d-${i}`}
                className="rbg-desktop-only"
                preserveAspectRatio="none"
                fill="none"
                viewBox="0 0 1400 480"
                style={{
                  position: "absolute",
                  left: "-20vw",
                  top,
                  width: "140vw",
                  height: h,
                  animation: drift,
                  willChange: "transform",
                }}
              >
                <line
                  x1="0"
                  y1={d.flip ? 0 : 480}
                  x2="1400"
                  y2={d.flip ? 480 : 0}
                  stroke={stroke}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            );
          }

          /* Rentlio circle — size capped to 62vw so the big desktop circles
             shrink to sensible marks on phones. Edge circles stay ~60% visible
             at any size. Very slow rotation (4–7 min per turn). */
          const sz = `min(${d.size}px, 62vw)`;
          const left =
            d.x === "edge-left"
              ? `calc(${sz} * -0.4)`
              : d.x === "edge-right"
                ? `calc(100% - ${sz} * 0.6)`
                : d.x;
          const baseRot = d.rot ?? (i * 137 + 41) % 360;
          const breatheDur = 240 + (i % 6) * 40;
          return (
            <div
              key={`c-${i}`}
              style={{
                position: "absolute",
                left,
                top: `calc(${top}px - ${sz} / 2)`,
                width: sz,
                height: sz,
                animation: drift,
                willChange: "transform",
              }}
            >
              <div
                style={
                  {
                    width: "100%",
                    height: "100%",
                    "--rbg-rot": `${baseRot}deg`,
                    animation: `rbgBreathe${i % 2 === 0 ? "Cw" : "Ccw"} ${breatheDur}s linear infinite`,
                  } as CSSProperties
                }
              >
                <RentlioCircleMark stroke={stroke} />
              </div>
            </div>
          );
        })}
      </div>

      {children}

      <style>{`
        @media (max-width: 767px) {
          .rbg-desktop-only { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rbg-layer, .rbg-layer * { animation: none !important; }
        }
        @keyframes rbgFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes rbgDriftX0 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(2px); } }
        @keyframes rbgDriftX1 { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(-2px); } }
        @keyframes rbgDriftY0 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }
        @keyframes rbgDriftY1 { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes rbgDriftDecor0 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(12px, -8px); } }
        @keyframes rbgDriftDecor1 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(-14px, 10px); } }
        @keyframes rbgDriftDecor2 { 0%, 100% { transform: translate(0, 0); } 50% { transform: translate(8px, 14px); } }
        @keyframes rbgBreatheCw {
          from { transform: rotate(var(--rbg-rot, 0deg)); }
          to   { transform: rotate(calc(var(--rbg-rot, 0deg) + 360deg)); }
        }
        @keyframes rbgBreatheCcw {
          from { transform: rotate(var(--rbg-rot, 0deg)); }
          to   { transform: rotate(calc(var(--rbg-rot, 0deg) - 360deg)); }
        }
      `}</style>
    </div>
  );
}

/* The Rentlio circle mark (same path as rentlio-circle.svg), inlined so no
   asset file is needed and the stroke colour follows the `stroke` prop. */
function RentlioCircleMark({ stroke }: { stroke: string }) {
  return (
    <svg
      viewBox="0 0 457 429"
      fill="none"
      width="100%"
      height="100%"
      style={{ display: "block", overflow: "visible" }}
    >
      <path
        d="M0.5 228.105C0.500188 97.4214 110.715 -7.70777 243.556 1.00391V1.00488C354.495 8.52594 444.718 96.729 454.594 207.632L454.706 208.938C462.247 300.131 416.42 381.443 344.492 423.842L344.486 423.845C328.519 433.551 307.377 423.85 303.376 405.538L274.311 260.604C272.596 252.018 274.887 242.88 281.15 236.608L281.157 236.602C296.372 220.782 304.569 199.092 301.057 175.063C296.954 141.657 269.449 114.706 236.084 111.189H236.083C191.019 105.92 152.979 141.082 152.979 185.03C152.979 204.64 160.351 222.552 172.865 235.965L173.465 236.601L173.473 236.608C179.736 242.88 182.027 252.018 180.312 260.604L151.244 405.547L151.243 405.553C147.818 423.844 126.69 433.555 110.718 423.845L110.716 423.844C45.1665 384.348 0.5 311.745 0.5 228.105Z"
        stroke={stroke}
        strokeWidth={1}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default RentlioBackground;
