"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { Arrow, Icon } from "@/components/Hero";
import { BREAK, WORKSHOPS, type Workshop, type WorkshopId } from "@/lib/content";
import { ensureGsap, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/animations";

/* Bottom-right diagonal notch — the same card cut as the landing page. */
const CUT = 28;
export const CUT_CLIP = `polygon(0 0, 100% 0, 100% calc(100% - ${CUT}px), calc(100% - ${CUT}px) 100%, 0 100%)`;

/** Ask the registration form to pre-select a workshop, then scroll to it. */
export function selectWorkshop(id: WorkshopId) {
  window.dispatchEvent(new CustomEvent<WorkshopId>("ws:select", { detail: id }));
  document.getElementById("prijava")?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

export function Workshops() {
  const { t, lang } = useLang();
  const [active, setActive] = useState<WorkshopId>(WORKSHOPS[0].id);
  const activeIndex = WORKSHOPS.findIndex((w) => w.id === active);
  const cardsRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ensureGsap();
    const cards = cardsRef.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    if (!cards || !rail || !fill) return;

    // Rail line spans first → last workshop dot (measured).
    const layout = () => {
      const dots = rail.querySelectorAll<HTMLElement>("[data-rail-dot]");
      if (dots.length < 2) return;
      const top = rail.getBoundingClientRect().top;
      const c = (el: HTMLElement) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - top;
      };
      const a = c(dots[0]);
      const b = c(dots[dots.length - 1]);
      rail.style.setProperty("--rail-top", `${a}px`);
      rail.style.setProperty("--rail-h", `${b - a}px`);
    };
    layout();
    ScrollTrigger.addEventListener("refreshInit", layout);

    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      // Scroll-spy: the card crossing the middle of the screen is "active".
      cards.querySelectorAll<HTMLElement>("[data-ws]").forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 55%",
          end: "bottom 55%",
          onToggle: (st) => st.isActive && setActive(card.dataset.ws as WorkshopId),
        });
      });

      if (reduce) {
        gsap.set(fill, { scaleY: 1 });
        return;
      }

      // Progress line fills as you move through the morning.
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: cards, start: "top 55%", end: "bottom 55%", scrub: 0.3 },
        },
      );

      // Cards + section header rise in once.
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
    }, cards.closest("section") ?? cards);

    let raf = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    ro.observe(cards);
    ro.observe(rail);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      ScrollTrigger.removeEventListener("refreshInit", layout);
      ctx.revert();
    };
  }, [lang]);

  const scrollToCard = (id: WorkshopId) =>
    document.getElementById(`ws-${id}`)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });

  return (
    <section id="raspored" className="relative py-24 lg:py-40">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <header className="ws-reveal mx-auto max-w-[780px] text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue">{t.schedule.eyebrow}</p>
          <h2 className="section-headline mt-4">{t.schedule.title}</h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[17px] leading-[1.6] text-ink-soft lg:text-[19px]">{t.schedule.body}</p>
        </header>

        <div className="mt-14 lg:mt-20 lg:grid lg:grid-cols-[280px_1fr] lg:gap-14 xl:grid-cols-[300px_1fr] xl:gap-20">
          {/* Sticky schedule rail (desktop) — numbered steps with three clear
              states: done (ink), now (blue, raised card), upcoming (outline). */}
          <aside className="hidden lg:block">
            <div className="sticky top-32">
              <p className="flex items-center gap-2 pl-1 text-[13px] font-medium text-ink-soft">
                <Icon name="calendar" className="size-4" />
                {t.hero.date}
              </p>
              <ol ref={railRef} className="relative mt-5" style={{ ["--rail-top" as never]: "0px", ["--rail-h" as never]: "0px" }}>
                <span aria-hidden className="absolute left-[15px] w-px bg-line" style={{ top: "var(--rail-top)", height: "var(--rail-h)" }} />
                <span
                  ref={fillRef}
                  aria-hidden
                  className="absolute left-[15px] w-px origin-top bg-blue"
                  style={{ top: "var(--rail-top)", height: "var(--rail-h)", transform: "scaleY(0)" }}
                />
                {WORKSHOPS.map((w, i) => {
                  const on = active === w.id;
                  const done = i < activeIndex;
                  return (
                    <Fragment key={w.id}>
                      <li className="relative py-1.5">
                        <button
                          type="button"
                          onClick={() => scrollToCard(w.id)}
                          aria-current={on ? "step" : undefined}
                          className="focus-ring group flex w-full items-center gap-4 rounded-2xl text-left"
                        >
                          <span
                            data-rail-dot
                            className={`font-display relative z-10 grid size-8 shrink-0 place-items-center rounded-full text-[12px] font-semibold tabular-nums transition-all duration-500 ease-premium ${
                              on
                                ? "bg-blue text-white shadow-[0_0_0_6px_rgba(28,157,217,0.14)]"
                                : done
                                  ? "bg-ink text-paper"
                                  : "border border-line bg-paper text-ink-muted group-hover:border-ink/30 group-hover:text-ink"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span
                            className={`min-w-0 flex-1 rounded-2xl border px-4 py-3 transition-all duration-500 ease-premium ${
                              on
                                ? "border-ink/[0.07] bg-paper-pure shadow-[0_16px_36px_-22px_rgba(10,10,15,0.3)]"
                                : "border-transparent group-hover:bg-paper-pure/60"
                            }`}
                          >
                            <span
                              className={`block text-[16px] font-semibold leading-snug transition-colors duration-500 ${
                                on || done ? "text-ink" : "text-ink-soft group-hover:text-ink"
                              }`}
                            >
                              {w.name}
                            </span>
                            <span className="mt-1 flex items-center gap-2 text-[13px] tabular-nums">
                              <span className={`font-display font-medium transition-colors duration-500 ${on ? "text-blue" : "text-ink-muted"}`}>
                                {w.start} – {w.end}
                              </span>
                              <span className="size-[3px] rounded-full bg-ink-muted/50" aria-hidden />
                              <span className="text-ink-muted">
                                {w.minutes} {t.schedule.minutes}
                              </span>
                            </span>
                          </span>
                        </button>
                      </li>
                      {w.id === BREAK.after && (
                        <li className="relative flex items-center gap-4 py-2" aria-label={`${BREAK.start} – ${BREAK.end} ${t.schedule.coffee}`}>
                          <span className="relative z-10 grid size-8 shrink-0 place-items-center">
                            <span className="grid size-6 place-items-center rounded-full border border-line bg-paper text-ink-muted">
                              <Icon name="cup" className="size-3.5" />
                            </span>
                          </span>
                          <span className="flex items-center gap-2 px-4 text-[12.5px] text-ink-muted">
                            <span>{t.schedule.coffee}</span>
                            <span className="size-[3px] rounded-full bg-ink-muted/50" aria-hidden />
                            <span className="font-display tabular-nums">{BREAK.start} – {BREAK.end}</span>
                          </span>
                        </li>
                      )}
                    </Fragment>
                  );
                })}
              </ol>
            </div>
          </aside>

          {/* Workshop cards */}
          <div ref={cardsRef} className="flex flex-col gap-6 lg:gap-8">
            {WORKSHOPS.map((w) => (
              <Fragment key={w.id}>
                <WorkshopCard w={w} />
                {w.id === BREAK.after && (
                  <div className="ws-reveal flex items-center gap-4 text-ink-muted" role="note">
                    <span className="h-px flex-1 bg-line" />
                    <span className="flex items-center gap-2 text-[13px] lg:text-sm">
                      <Icon name="cup" className="size-4" />
                      <span className="tabular-nums">{BREAK.start} – {BREAK.end}</span>
                      <span>· {t.schedule.coffee}</span>
                    </span>
                    <span className="h-px flex-1 bg-line" />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkshopCard({ w }: { w: Workshop }) {
  const { t } = useLang();
  return (
    <article id={`ws-${w.id}`} data-ws={w.id} className="ws-reveal group relative">
      <div
        className="relative border border-ink/10 bg-paper-pure transition-[filter] duration-500"
        style={{ clipPath: CUT_CLIP }}
      >
        <div className="grid md:grid-cols-[1fr_minmax(230px,36%)]">
          {/* Content */}
          <div className="order-2 p-6 sm:p-8 md:order-1 lg:p-10">
            {/* Mobile shows logo, time and duration on the stage above → desktop only. */}
            <div className="hidden flex-wrap items-center justify-between gap-x-4 gap-y-3 md:flex">
              <img src={w.logo} alt={w.name} className={`hidden w-auto md:block ${w.logoClass} ${w.logoInk ? "logo-ink" : ""}`} />
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

            <h3 className="font-display text-[22px] md:mt-6 font-medium leading-[1.22] tracking-[-0.02em] text-ink sm:text-[26px] lg:mt-8 lg:text-[28px]">
              {w.title}
            </h3>
            <p className="mt-4 text-[15px] leading-[1.65] text-ink-soft lg:text-[16px]">{w.body}</p>

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
                  {t.hero.venue}
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
      className="relative order-1 h-36 overflow-hidden border-b border-ink/[0.08] sm:h-44 md:order-2 md:h-auto md:min-h-[300px] md:border-b-0 md:border-l"
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
        <span className="rounded-2xl bg-paper-pure/90 px-5 py-3.5 shadow-[0_24px_50px_-26px_rgba(10,10,15,0.4)] backdrop-blur-sm transition-transform duration-700 ease-premium group-hover:scale-[1.06] md:px-6 md:py-4">
          <img src={w.logo} alt="" className={`w-auto ${w.logoClass} ${w.logoInk ? "logo-ink" : ""}`} />
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
