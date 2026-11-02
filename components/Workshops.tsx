"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Arrow, Icon } from "@/components/Hero";
import {
  BREAK,
  DAY_END,
  DAY_START,
  TRACKS,
  WORKSHOPS,
  toMin,
  type TrackId,
  type Workshop,
  type WorkshopId,
} from "@/lib/content";
import { ensureGsap, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/animations";

/* Bottom-right diagonal notch — the same card cut as the landing page. */
const CUT = 28;
export const CUT_CLIP = `polygon(0 0, 100% 0, 100% calc(100% - ${CUT}px), calc(100% - ${CUT}px) 100%, 0 100%)`;

/** Ask the registration form to pre-select a workshop, then scroll to it. */
export function selectWorkshop(id: WorkshopId) {
  window.dispatchEvent(new CustomEvent<WorkshopId>("ws:select", { detail: id }));
  document.getElementById("prijava")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

const scrollToCard = (id: WorkshopId) =>
  document.getElementById(`ws-${id}`)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

const byTrack = (track: TrackId) => WORKSHOPS.filter((w) => w.track === track);

export function Workshops() {
  const { t, lang } = useLang();
  const [active, setActive] = useState<WorkshopId>(WORKSHOPS[0].id);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    ensureGsap();
    const section = sectionRef.current;
    if (!section) return;
    const reduce = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Scroll-spy: the card crossing the middle of the screen is "active".
      section.querySelectorAll<HTMLElement>("[data-ws]").forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (st) => st.isActive && setActive(card.dataset.ws as WorkshopId),
        });
      });
      if (reduce) return;

      // Header, timetable, track headers and cards rise in once.
      gsap.utils.toArray<HTMLElement>(".ws-reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 36 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "expo.out",
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          },
        );
      });

      // Timetable blocks grow in along the time axis.
      section.querySelectorAll<HTMLElement>("[data-timetable]").forEach((tt) => {
        gsap.fromTo(
          tt.querySelectorAll(".tt-block"),
          { autoAlpha: 0, scaleY: 0.6 },
          {
            autoAlpha: 1,
            scaleY: 1,
            transformOrigin: "top",
            duration: 0.8,
            ease: "expo.out",
            stagger: 0.06,
            clearProps: "transform",
            scrollTrigger: { trigger: tt, start: "top 85%", once: true },
          },
        );
      });
    }, section);

    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(section);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [lang]);

  return (
    <section id="raspored" ref={sectionRef} className="relative py-24 lg:py-40">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <header className="ws-reveal mx-auto max-w-[800px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue">{t.schedule.eyebrow}</p>
          <h2 className="section-headline mt-4">{t.schedule.title}</h2>
          <p className="mx-auto mt-6 max-w-[760px] text-[17px] leading-[1.6] text-ink-soft lg:text-[19px]">{t.schedule.body}</p>
        </header>

        {/* Mobile / tablet: the timetable sits above the cards. */}
        <div className="ws-reveal mx-auto mt-12 max-w-[560px] lg:hidden">
          <Timetable active={active} compact />
        </div>

        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-[320px_1fr] lg:gap-12 xl:grid-cols-[340px_1fr] xl:gap-16">
          {/* Desktop: sticky timetable that follows the scroll. */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 [@media(max-height:860px)]:top-24">
              <Timetable active={active} />
            </div>
          </aside>

          <div className="flex flex-col gap-14 lg:gap-20">
            {TRACKS.map((track) => {
              const list = byTrack(track.id);
              return (
                <div key={track.id} className="flex flex-col gap-6 lg:gap-8">
                  <TrackHeader track={track.id} list={list} />
                  {list.map((w) => (
                    <Fragment key={w.id}>
                      <WorkshopCard w={w} />
                      {BREAK.after.includes(w.id) && (
                        <CoffeeBreak />
                      )}
                    </Fragment>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* Coffee break between the Levant cards — warm strip so it reads as a pause. */
function CoffeeBreak() {
  const { t } = useLang();
  const mins = toMin(BREAK.end) - toMin(BREAK.start);
  return (
    <div
      role="note"
      className="ws-reveal flex items-center gap-4 rounded-2xl border border-[#E9CFAE] bg-[#FBF1E4] px-5 py-4 sm:gap-5 sm:px-7 sm:py-5"
    >
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-paper-pure text-[#9A6431] shadow-[0_8px_20px_-12px_rgba(122,78,34,0.6)] sm:size-12">
        <Icon name="cup" className="coffee-cup size-5 sm:size-6" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="font-display block text-[17px] font-semibold leading-tight tracking-[-0.01em] text-[#5C3A17] sm:text-[20px]">
          {t.schedule.coffee}
        </span>
        <span className="font-display mt-1 block text-[13px] tabular-nums text-[#8A5A2B] sm:hidden">
          {BREAK.start} – {BREAK.end} · {mins} {t.schedule.minutes}
        </span>
      </span>
      <span className="hidden items-center gap-2 sm:flex">
        <span className="font-display inline-flex items-center gap-1.5 rounded-full bg-paper-pure/80 px-3 py-1.5 text-[13px] font-medium tabular-nums text-[#7A4E22]">
          <Icon name="clock" className="size-3.5" />
          {BREAK.start} – {BREAK.end}
        </span>
        <span className="rounded-full border border-[#E9CFAE] px-3 py-1.5 text-[13px] font-medium tabular-nums text-[#7A4E22]">
          {mins} {t.schedule.minutes}
        </span>
      </span>
      <style>{`
        .coffee-cup { animation: coffeeTilt 3.2s ease-in-out infinite; transform-origin: 50% 80%; }
        @keyframes coffeeTilt { 0%, 70%, 100% { transform: rotate(0deg); } 80% { transform: rotate(-8deg); } 90% { transform: rotate(5deg); } }
        @media (prefers-reduced-motion: reduce) { .coffee-cup { animation: none; } }
      `}</style>
    </div>
  );
}

/* Heading above each group of cards: hall(s), what's on, time span. */
function TrackHeader({ track, list }: { track: TrackId; list: Workshop[] }) {
  const { t } = useLang();
  const start = list[0].start;
  const end = list[list.length - 1].end;
  return (
    <div className="ws-reveal flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-ink/[0.1] pb-5">
      <div>
        <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-blue">
          <Icon name="pin" className="size-4" />
          {t.schedule.tracks[track].subtitle}
        </p>
        <h3 className="font-display mt-2 text-[24px] font-semibold leading-tight tracking-[-0.02em] lg:text-[30px]">
          {t.schedule.tracks[track].title}
        </h3>
      </div>
      <span className="font-display inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-paper-pure px-3.5 py-1.5 text-[13px] font-medium tabular-nums text-ink">
        <Icon name="clock" className="size-3.5 text-blue" />
        {start} – {end}
      </span>
    </div>
  );
}

/* Two-column timetable: Dvorana Levant | Tramontana & Maestral. Blocks are
   placed on a shared time axis, so what runs in parallel sits side by side. */
function Timetable({ active, compact = false }: { active: WorkshopId; compact?: boolean }) {
  const { t } = useLang();
  // Axis: round the day out to whole/half hours.
  const from = Math.floor(toMin(DAY_START) / 30) * 30;
  const to = Math.ceil(toMin(DAY_END) / 30) * 30;
  const span = to - from;
  const pct = (m: number) => ((m - from) / span) * 100;
  const hours: number[] = [];
  for (let m = Math.ceil(from / 60) * 60; m <= to; m += 60) hours.push(m);
  const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const activeW = WORKSHOPS.find((w) => w.id === active)!;

  return (
    <div data-timetable className="overflow-hidden rounded-2xl border border-ink/10 bg-paper-pure/85 shadow-[0_30px_70px_-50px_rgba(10,10,15,0.35)] backdrop-blur-sm">
      {/* Calendar header: the day + where. */}
      <div className="flex items-center justify-between gap-3 border-b border-ink/[0.08] px-4 py-3">
        <span className="font-display flex items-center gap-2 text-[13px] font-semibold tabular-nums text-ink">
          <Icon name="calendar" className="size-4 text-blue" />
          {t.hero.date}
        </span>
        <span className="flex items-center gap-1.5 text-[12px] text-ink-muted">
          <Icon name="pin" className="size-3.5" />
          {t.hero.venue}
        </span>
      </div>

      {/* Column headers: one per hall group. */}
      <div className="grid grid-cols-[38px_1fr_1fr] gap-x-2 border-b border-ink/[0.08] bg-paper/70 px-3 py-2.5">
        <span aria-hidden />
        {TRACKS.map((tr) => (
          <p key={tr.id} className="font-display text-[12px] font-semibold leading-[1.25] text-ink">
            {t.schedule.tracks[tr.id].title}
          </p>
        ))}
      </div>

      <div className="px-3 py-4">
      <div
        className={`relative grid grid-cols-[38px_1fr_1fr] gap-x-2 ${
          compact ? "h-[520px] sm:h-[560px]" : "h-[540px] [@media(max-height:860px)]:h-[440px]"
        }`}
      >
        {/* Day columns */}
        {TRACKS.map((tr, col) => (
          <span key={tr.id} aria-hidden className="pointer-events-none -my-2 rounded-lg bg-ink/[0.025]" style={{ gridColumn: col + 2, gridRow: 1 }} />
        ))}
        {/* Hour lines + labels */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {hours.map((m) => (
            <div key={m} className="absolute inset-x-0 flex items-center gap-2" style={{ top: `${pct(m)}%` }}>
              <span className="font-display w-[38px] -translate-y-1/2 text-[11px] font-medium tabular-nums text-ink-muted">{fmt(m)}</span>
              <span className="h-px flex-1 -translate-y-1/2 border-t border-dashed border-ink/[0.12]" />
            </div>
          ))}
          {/* Playhead: start time of the workshop you're reading. */}
          <div
            className="absolute inset-x-0 flex items-center transition-[top] duration-700 ease-premium"
            style={{ top: `${pct(toMin(activeW.start))}%` }}
          >
            <span className="ml-[30px] size-2 -translate-y-1/2 rounded-full bg-blue" />
            <span className="h-px flex-1 -translate-y-1/2 bg-blue/40" />
          </div>
        </div>

        {TRACKS.map((tr, col) => (
          <div key={tr.id} className="relative" style={{ gridColumn: col + 2, gridRow: 1 }}>
            {byTrack(tr.id).map((w) => {
              const on = w.id === active;
              const top = pct(toMin(w.start));
              const h = pct(toMin(w.end)) - top;
              return (
                <Fragment key={w.id}>
                  <button
                    type="button"
                    onClick={() => scrollToCard(w.id)}
                    aria-current={on ? "step" : undefined}
                    aria-label={`${w.name}, ${w.start} – ${w.end}, ${t.schedule.halls[w.hall]}`}
                    className={`tt-block focus-ring group absolute inset-x-0 flex flex-col overflow-hidden rounded-xl border px-2.5 py-2 text-left transition-all duration-500 ease-premium ${
                      on
                        ? "z-10 border-blue bg-blue text-white shadow-[0_14px_30px_-14px_rgba(28,157,217,0.7)]"
                        : "border-ink/[0.08] bg-paper-pure text-ink hover:border-ink/25"
                    }`}
                    style={{ top: `calc(${top}% + 2px)`, height: `calc(${h}% - 4px)` }}
                  >
                    <span className={`block text-[12.5px] font-semibold leading-tight ${w.minutes <= 30 ? "truncate" : "line-clamp-2"}`}>{w.short ?? w.name}</span>
                    <span className={`font-display mt-0.5 block truncate text-[11px] tabular-nums ${on ? "text-white/80" : "text-ink-muted"}`}>
                      {w.start} – {w.end}
                    </span>
                  </button>
                </Fragment>
              );
            })}
          </div>
        ))}

        {/* Coffee break for everyone → spans both hall columns. */}
        <div className="pointer-events-none relative" style={{ gridColumn: "2 / 4", gridRow: 1 }}>
          <span
            className="tt-block absolute inset-x-0 z-[5] flex items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#E9CFAE] bg-[#FBF1E4] px-2.5 text-[12px] font-semibold text-[#7A4E22] shadow-[0_10px_24px_-18px_rgba(122,78,34,0.7)]"
            style={{
              top: `calc(${pct(toMin(BREAK.start))}% + 2px)`,
              height: `calc(${pct(toMin(BREAK.end)) - pct(toMin(BREAK.start))}% - 4px)`,
            }}
            title={`${t.schedule.coffee}, ${BREAK.start} – ${BREAK.end}`}
          >
            <Icon name="cup" className="coffee-cup size-3.5 shrink-0" />
            <span className="truncate">{t.schedule.coffee}</span>
            <span className="font-display hidden font-medium tabular-nums text-[#8A5A2B] sm:inline">· {BREAK.start} – {BREAK.end}</span>
          </span>
        </div>
      </div>
      </div>
    </div>
  );
}

function WorkshopCard({ w }: { w: Workshop }) {
  const { t, lang } = useLang();
  const copy = w.copy?.[lang];
  return (
    <article id={`ws-${w.id}`} data-ws={w.id} className="ws-reveal group relative">
      <div
        className="relative border border-ink/10 bg-paper-pure transition-[filter] duration-500"
        style={{ clipPath: CUT_CLIP }}
      >
        <div className="grid md:grid-cols-[minmax(230px,36%)_1fr]">
          {/* Content */}
          <div className="order-2 p-6 sm:p-8 lg:p-10">
            {/* Mobile shows time and duration on the stage above → desktop only. */}
            <div className="hidden flex-wrap items-center gap-x-4 gap-y-3 md:flex">
              <div className="flex items-center gap-2">
                <span className="font-display hidden items-center gap-1.5 rounded-full bg-blue/[0.08] px-3 py-1.5 md:inline-flex text-[13px] font-medium tabular-nums text-[#147DB0]">
                  <Icon name="clock" className="size-3.5" />
                  {w.start} – {w.end}
                </span>
                <span className="rounded-full border border-ink/10 px-3 py-1.5 text-[13px] font-medium tabular-nums text-ink-soft">
                  {w.minutes} {t.schedule.minutes}
                </span>
              </div>
            </div>

            <p className="sr-only">{w.name}</p>
            <h3 className="font-display text-[22px] font-medium leading-[1.22] tracking-[-0.02em] text-ink sm:text-[26px] md:mt-6 lg:text-[28px]">
              {copy?.title ?? t.schedule.soonTitle}
            </h3>
            <div className="mt-4 flex flex-col gap-3 text-[15px] leading-[1.65] text-ink-soft lg:text-[16px]">
              {(copy?.body ?? t.schedule.soonBody).split("\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            {w.program && (
              <div className="mt-7">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-blue">{t.schedule.programLabel}</p>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                  {w.program.map((p) => (
                    <li key={p.key} className="flex items-center gap-3 rounded-2xl border border-ink/[0.08] bg-paper/60 p-3">
                      <span className="relative block size-10 shrink-0 overflow-hidden rounded-full bg-line">
                        <Image src={p.img} alt="" fill sizes="40px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] font-medium leading-tight text-ink">{t.schedule.program[p.key]}</span>
                        <span className="mt-0.5 block text-[13px] text-ink-soft">{p.speaker}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-5 border-t border-ink/[0.08] pt-6">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-ink-soft lg:text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="calendar" className="size-4" />
                  {t.hero.date}
                </span>
                <span className="size-1 rounded-full bg-blue" aria-hidden />
                <span className="inline-flex items-center gap-1.5">
                  <Icon name="pin" className="size-4" />
                  {t.schedule.halls[w.hall]}, {t.schedule.venueSuffix}
                </span>
              </p>
              <button
                type="button"
                onClick={() => selectWorkshop(w.id)}
                className="focus-ring group/btn inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3 text-[14px] font-medium text-paper transition-all duration-300 ease-premium hover:scale-[1.03] hover:shadow-[0_16px_44px_-18px_rgba(28,157,217,0.6)]"
              >
                {t.schedule.register}
                <Arrow className="transition-transform duration-300 group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>

          <LogoStage w={w} />
        </div>
      </div>

      {/* Diagonal hairline along the cut (clip-path removes the border there). */}
      <span
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          right: 0,
          bottom: CUT,
          width: CUT * Math.SQRT2,
          height: 1,
          background: "rgba(10,10,15,0.1)",
          transformOrigin: "right bottom",
          transform: "rotate(-45deg)",
        }}
      />
    </article>
  );
}

/* Replaces last year's photos: the partner logo on a quiet hairline grid with
   a slowly turning Rentlio mark, a giant start time, and a blue glow on hover. */
function LogoStage({ w }: { w: Workshop }) {
  const { t } = useLang();
  return (
    <div
      aria-hidden
      className="relative order-1 h-36 overflow-hidden border-b border-ink/[0.08] sm:h-44 md:h-auto md:min-h-[300px] md:border-b-0 md:border-r"
      style={{ background: "linear-gradient(160deg, #FBFCFD 0%, #EEF4F8 100%)" }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(28,157,217,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(28,157,217,0.09) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(circle at 50% 50%, black 15%, transparent 72%)",
          WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 15%, transparent 72%)",
        }}
      />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(28,157,217,0.16), transparent 62%)" }}
      />
      <img
        src="/rentlio-circle.svg"
        alt=""
        className="stage-mark absolute left-1/2 top-1/2 hidden h-[105%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 md:block"
      />
      {/* Mobile: big start time on the left, logo chip on the right (no
          overlap). Desktop: logo centred, giant start time bottom-left. */}
      <div className="absolute inset-0 flex items-center justify-between gap-4 px-5 sm:px-8 md:justify-center md:px-0">
        <span className="font-display shrink-0 leading-none md:hidden">
          <span className="block text-[44px] font-light tracking-[-0.04em] text-blue tabular-nums sm:text-[52px]">{w.start}</span>
          <span className="mt-2 flex items-center gap-1.5 whitespace-nowrap text-[13px] font-medium tabular-nums text-ink-soft">
            <Icon name="clock" className="size-3.5 text-blue" />
            {t.schedule.until} {w.end}
            <span className="size-[3px] rounded-full bg-ink-muted/60" aria-hidden />
            {w.minutes} {t.schedule.minutes}
          </span>
        </span>
        <span className="flex flex-col items-center gap-2 rounded-2xl bg-paper-pure/90 px-5 py-3.5 shadow-[0_24px_50px_-26px_rgba(10,10,15,0.4)] backdrop-blur-sm transition-transform duration-700 ease-premium group-hover:scale-[1.06] md:gap-2.5 md:px-6 md:py-4">
          <img src={w.logo} alt="" className={`w-auto ${w.logoClass} ${w.logoInk ? "logo-ink" : ""}`} />
          {/* Joint workshop: partner × Rentlio, Rentlio a touch smaller. */}
          {w.withRentlio && (
            <>
              <span className="flex items-center gap-2 text-[12px] leading-none text-ink-muted">
                <span className="h-px w-4 bg-ink/15" />×<span className="h-px w-4 bg-ink/15" />
              </span>
              <img src="/rentlio-logo.svg" alt="" className="h-[18px] w-auto lg:h-5" />
            </>
          )}
        </span>
      </div>
      <span className="font-display absolute bottom-3 left-5 hidden text-[76px] font-light leading-none tracking-[-0.04em] text-[#1C9DD9]/[0.32] tabular-nums transition-colors duration-700 group-hover:text-[#1C9DD9]/50 md:block">
        {w.start}
      </span>

      <style>{`
        .stage-mark { animation: stageSpin 90s linear infinite; }
        @keyframes stageSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
        @media (prefers-reduced-motion: reduce) { .stage-mark { animation: none; } }
      `}</style>
    </div>
  );
}
