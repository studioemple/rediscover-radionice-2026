"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { LanguageSwitcher, useLang } from "@/components/LanguageProvider";
import { WORKSHOPS } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

/* ───────────────────────── Header ─────────────────────────
   Transparent over the hero; once scrolled it turns into a soft blurred bar
   and a compact "Register" button slides in (always one tap from the form). */
export function Header() {
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const form = document.getElementById("prijava");
      const formTop = form ? form.getBoundingClientRect().top : Infinity;
      // Visible after the hero, hidden again once the form is on screen.
      setShowCta(window.scrollY > window.innerHeight * 0.6 && formTop > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? "border-b border-ink/[0.07] bg-paper/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-4 px-5 sm:px-8 lg:h-20">
        <a href="#top" aria-label="Rentlio Rediscover" className="focus-ring shrink-0">
          <Image src="/rentlio-logo.svg" alt="Rentlio" width={336} height={76} priority className="h-[22px] w-auto lg:h-[26px]" />
        </a>
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="#prijava"
            tabIndex={showCta ? 0 : -1}
            aria-hidden={!showCta}
            className={`focus-ring hidden rounded-full bg-ink px-5 py-2.5 text-[13px] font-medium text-paper transition-all duration-500 ease-premium sm:inline-flex ${
              showCta ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
            }`}
          >
            {t.header.cta}
          </a>
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

/* ───────────────────────── Hero ───────────────────────── */
export function Hero() {
  const { t } = useLang();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureGsap();
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.fromTo(".hero-in", { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.08 })
        .fromTo(".orbit", { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 1.4 }, 0.15)
        .fromTo(
          ".orbit-chip",
          { autoAlpha: 0, scale: 0.6 },
          { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.1, ease: "back.out(1.6)", clearProps: "transform" },
          0.55,
        );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="top" ref={rootRef} className="relative flex items-center pb-20 pt-28 lg:min-h-screen lg:pb-24 lg:pt-28">
      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <div>
          <div className="hero-in relative w-[170px] sm:w-[200px] lg:w-[230px]" style={{ aspectRatio: "1199 / 181" }}>
            <Image src="/rediscover-logo-2026.svg" alt="Rediscover" fill priority sizes="230px" className="object-contain object-left" />
          </div>

          <p className="hero-in mt-8 text-sm font-semibold uppercase tracking-[0.14em] text-blue lg:mt-10">
            {t.hero.eyebrow}
          </p>
          <h1 className="hero-in section-headline mt-4 max-w-[640px] text-ink" style={{ fontSize: "clamp(2.1rem, 4.4vw, 58px)" }}>{t.hero.title}</h1>
          <p className="hero-in mt-6 max-w-[540px] text-[17px] leading-[1.6] text-ink-soft lg:text-[19px]">
            {t.hero.body}
          </p>

          <ul className="hero-in mt-8 flex flex-wrap gap-2">
            <MetaChip icon="calendar">{t.hero.date}</MetaChip>
            <MetaChip icon="pin">{t.hero.venue}</MetaChip>
            <MetaChip icon="seats" accent>
              {t.hero.seats}
            </MetaChip>
          </ul>

          <div className="hero-in mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="#prijava"
              className="focus-ring group inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-base font-medium text-paper transition-all duration-300 ease-premium hover:scale-[1.02] hover:shadow-[0_20px_60px_-20px_rgba(28,157,217,0.6)]"
            >
              {t.hero.cta}
              <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#raspored"
              className="focus-ring group inline-flex items-center gap-2 text-[15px] font-medium text-ink transition-colors hover:text-blue"
            >
              {t.hero.scheduleLink}
              <Arrow className="rotate-90 transition-transform duration-300 group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>

        <Orbit />
      </div>
    </section>
  );
}

/* Partner logos orbiting a slowly turning Rentlio mark. Chips stay upright
   (counter-rotation), the orbit pauses on hover so they're easy to click. */
function Orbit() {
  const { t } = useLang();
  const first = WORKSHOPS[0].start;
  const last = WORKSHOPS[WORKSHOPS.length - 1].end;

  return (
    <div className="orbit relative mx-auto aspect-square w-[min(92vw,560px)]">
      {/* Plain concentric circles; a small blue dot travels the outer one. */}
      <span aria-hidden className="absolute inset-[2%] rounded-full border border-line" />
      <span aria-hidden className="orbit-mark absolute inset-[2%] rounded-full">
        <span className="absolute left-1/2 top-0 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue shadow-[0_0_0_5px_rgba(28,157,217,0.14)]" />
      </span>
      <span aria-hidden className="absolute inset-[22%] rounded-full border border-ink/[0.06]" />
      <span aria-hidden className="absolute inset-[9%] rounded-full border border-dashed border-ink/[0.14]" />
      <span aria-hidden className="absolute inset-[31%] rounded-full border border-line" />

      <div className="absolute inset-[31.5%] grid place-items-center rounded-full bg-paper text-center">
        <div className="px-2">
          <p className="font-display text-[clamp(18px,5vw,28px)] font-semibold leading-tight tracking-[-0.03em]">
            {t.hero.orbitTop(WORKSHOPS.length)}
          </p>
          <p className="font-display mt-2 text-[clamp(11px,3vw,13px)] font-medium tabular-nums text-blue">
            {first} – {last}
          </p>
        </div>
      </div>

      <div className="orbit-track absolute inset-0">
        {WORKSHOPS.map((w, i) => (
          <div key={w.id} className="absolute inset-0" style={{ transform: `rotate(${(i * 360) / WORKSHOPS.length}deg)` }}>
            <a
              href={`#ws-${w.id}`}
              aria-label={`${w.name} ${w.start}`}
              className="orbit-anchor focus-ring absolute left-1/2 top-[9%] block"
              style={{ transform: `translate(-50%, -50%) rotate(${(-i * 360) / WORKSHOPS.length}deg)` }}
            >
              <span className="orbit-upright block">
                <span className="orbit-chip flex flex-col items-center gap-1.5 rounded-xl border border-ink/[0.06] bg-paper-pure px-2.5 py-2 shadow-[0_18px_40px_-22px_rgba(10,10,15,0.35)] transition-transform duration-300 ease-premium hover:scale-110 sm:rounded-2xl sm:px-4 sm:py-3">
                  <img
                    src={w.logo}
                    alt=""
                    className={`w-auto ${w.chipLogoClass} ${w.logoInk ? "logo-ink" : ""}`}
                  />
                  <span className="font-display hidden text-[11px] font-medium tabular-nums text-ink-soft sm:block">{w.start}</span>
                </span>
              </span>
            </a>
          </div>
        ))}
      </div>

      <style>{`
        .orbit-mark { animation: orbitSpin 38s linear infinite; }
        .orbit-track, .orbit-upright { animation: orbitSpin 56s linear infinite; }
        .orbit-upright { animation-direction: reverse; }
        .orbit:hover .orbit-track,
        .orbit:hover .orbit-upright,
        .orbit:focus-within .orbit-track,
        .orbit:focus-within .orbit-upright { animation-play-state: paused; }
        @keyframes orbitSpin { to { transform: rotate(360deg); } }
        /* Very narrow phones: shrink the chips a touch so 7 never collide.
           (\`scale\` composes with the hover transform instead of replacing it.) */
        @media (max-width: 359px) { .orbit-chip { scale: 0.86; } }
        @media (prefers-reduced-motion: reduce) {
          .orbit-mark, .orbit-track, .orbit-upright { animation: none; }
        }
      `}</style>
    </div>
  );
}

function MetaChip({ icon, accent, children }: { icon: "calendar" | "pin" | "seats"; accent?: boolean; children: React.ReactNode }) {
  return (
    <li
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium lg:text-sm ${
        accent ? "border-blue/30 bg-blue/[0.07] text-[#147DB0]" : "border-ink/10 bg-paper-pure/70 text-ink"
      }`}
    >
      <Icon name={icon} />
      {children}
    </li>
  );
}

export function Icon({ name, className = "" }: { name: "calendar" | "pin" | "seats" | "clock" | "cup"; className?: string }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className, "aria-hidden": true };
  switch (name) {
    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
          <path d="M3.5 10h17M8 3v4M16 3v4" />
        </svg>
      );
    case "pin":
      return (
        <svg {...common}>
          <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
          <circle cx="12" cy="10" r="2.3" />
        </svg>
      );
    case "seats":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M3 19.5c.7-3.3 3.1-5.2 6-5.2s5.3 1.9 6 5.2M16 5.2a3.2 3.2 0 0 1 0 6.2M18.2 14.6c1.5.7 2.5 2.4 2.8 4.9" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7.5V12l3 2" />
        </svg>
      );
    case "cup":
      return (
        <svg {...common}>
          <path d="M4.5 9h12v5.5a5 5 0 0 1-5 5h-2a5 5 0 0 1-5-5V9ZM16.5 10.5h1.2a2.8 2.8 0 0 1 0 5.6h-1.6M8 3.5c-.6 1 .6 1.6 0 2.6M12 3.5c-.6 1 .6 1.6 0 2.6" />
        </svg>
      );
  }
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
