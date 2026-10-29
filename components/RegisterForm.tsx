"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLang } from "@/components/LanguageProvider";
import { Arrow } from "@/components/Hero";
import { CUT_CLIP } from "@/components/Workshops";
import { PRIVACY_URL, WORKSHOPS, type WorkshopId } from "@/lib/content";
import { ensureGsap, gsap, prefersReducedMotion } from "@/lib/animations";

type Errors = Partial<Record<"name" | "company" | "email" | "pick" | "privacy", string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function RegisterForm() {
  const { t } = useLang();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [picked, setPicked] = useState<WorkshopId[]>([]);
  const [privacy, setPrivacy] = useState(false);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState<WorkshopId | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // "Register" buttons on the workshop cards pre-select their workshop.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<WorkshopId>).detail;
      setDone(false);
      setPicked((p) => (p.includes(id) ? p : [...p, id]));
      setFlash(id);
      window.setTimeout(() => setFlash(null), 1600);
    };
    window.addEventListener("ws:select", onSelect);
    return () => window.removeEventListener("ws:select", onSelect);
  }, []);

  useEffect(() => {
    ensureGsap();
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".form-reveal",
        { autoAlpha: 0, y: 32 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          clearProps: "transform",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  const errors: Errors = {};
  if (!name.trim()) errors.name = t.form.errName;
  if (!company.trim()) errors.company = t.form.errCompany;
  if (!EMAIL_RE.test(email.trim())) errors.email = t.form.errEmail;
  if (picked.length === 0) errors.pick = t.form.errPick;
  if (!privacy) errors.privacy = t.form.errPrivacy;
  const show = (k: keyof Errors) => (tried ? errors[k] : undefined);

  const toggle = (id: WorkshopId) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const allPicked = picked.length === WORKSHOPS.length;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (Object.keys(errors).length) {
      // Focus the first invalid field (after React marks the fields invalid).
      requestAnimationFrame(() =>
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      );
      return;
    }
    // TODO (developer): send the registration to the ticketing / CRM backend.
    // Payload: { name, company, email, workshops: picked, lang }
    setDone(true);
  };

  const reset = () => {
    setName("");
    setCompany("");
    setEmail("");
    setPicked([]);
    setPrivacy(false);
    setTried(false);
    setDone(false);
  };

  return (
    <section id="prijava" ref={rootRef} className="relative py-24 lg:py-40">
      <div className="mx-auto max-w-[820px] px-5 sm:px-8">
        <header className="form-reveal text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-blue">{t.form.eyebrow}</p>
          <h2 className="section-headline mt-4">{t.form.title}</h2>
          <p className="mx-auto mt-6 max-w-[560px] text-[17px] leading-[1.6] text-ink-soft lg:text-[19px]">{t.form.body}</p>
        </header>

        <div className="form-reveal relative mt-12 lg:mt-16">
          <div
            className="border border-ink/10 bg-paper-pure p-6 shadow-[0_40px_90px_-50px_rgba(10,10,15,0.35)] sm:p-10 lg:p-12"
            style={{ clipPath: CUT_CLIP }}
          >
            {done ? (
              <div role="status" aria-live="polite" className="flex flex-col items-center py-10 text-center">
                <span className="grid size-16 place-items-center rounded-full bg-blue/10 text-blue">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <h3 className="font-display mt-6 text-[26px] font-semibold tracking-[-0.02em]">{t.form.successTitle}</h3>
                <p className="mt-3 max-w-[420px] text-[16px] text-ink-soft">{t.form.successBody}</p>
                <button type="button" onClick={reset} className="focus-ring mt-8 text-[15px] font-medium text-blue underline-offset-4 hover:underline">
                  {t.form.again}
                </button>
              </div>
            ) : (
              <form ref={formRef} noValidate onSubmit={onSubmit} className="flex flex-col gap-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={t.form.name} value={name} onChange={setName} placeholder={t.form.namePh} error={show("name")} autoComplete="name" />
                  <Field label={t.form.company} value={company} onChange={setCompany} placeholder={t.form.companyPh} error={show("company")} autoComplete="organization" />
                  <div className="sm:col-span-2">
                    <Field label={t.form.email} value={email} onChange={setEmail} placeholder={t.form.emailPh} error={show("email")} type="email" autoComplete="email" />
                  </div>
                </div>

                <fieldset aria-describedby="pick-hint pick-err">
                  <div className="flex flex-wrap items-end justify-between gap-2">
                    <legend className="text-[14px] font-medium text-ink">{t.form.pick}</legend>
                    <button
                      type="button"
                      onClick={() => setPicked(allPicked ? [] : WORKSHOPS.map((w) => w.id))}
                      className="focus-ring text-[13px] font-medium text-blue underline-offset-4 hover:underline"
                    >
                      {allPicked ? t.form.clearAll : t.form.selectAll}
                    </button>
                  </div>
                  <p id="pick-hint" className="mt-1 text-[13px] text-ink-muted">{t.form.pickHint}</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {WORKSHOPS.map((w) => {
                      const on = picked.includes(w.id);
                      return (
                        <label
                          key={w.id}
                          className={`relative flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all duration-300 ease-premium has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-blue ${
                            on ? "border-ink bg-ink/[0.025]" : "border-ink/[0.12] hover:border-ink/30"
                          } ${flash === w.id ? "ring-4 ring-blue/25" : ""}`}
                        >
                          <input type="checkbox" className="sr-only" checked={on} onChange={() => toggle(w.id)} />
                          <span
                            aria-hidden
                            className={`grid size-6 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                              on ? "scale-100 border-blue bg-blue text-white" : "border-ink/25 bg-paper-pure text-transparent"
                            }`}
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12.5l4.5 4.5L19 7.5" />
                            </svg>
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[15px] font-medium leading-snug text-ink">{w.name}</span>
                            <span className="font-display mt-0.5 block text-[13px] tabular-nums text-ink-muted">
                              {w.start} – {w.end}
                            </span>
                          </span>
                          <img src={w.logo} alt="" className={`w-auto max-w-[96px] object-contain opacity-80 ${w.chipLogoClass} ${w.logoInk ? "logo-ink" : ""}`} />
                        </label>
                      );
                    })}
                  </div>
                  <ErrorText id="pick-err" msg={show("pick")} />
                </fieldset>

                <div>
                  <label className="inline-flex cursor-pointer items-start gap-3 text-[14px] text-ink-soft">
                    <input
                      type="checkbox"
                      checked={privacy}
                      onChange={(e) => setPrivacy(e.target.checked)}
                      aria-invalid={!!show("privacy")}
                      aria-describedby="privacy-err"
                      className="focus-ring mt-0.5 size-[18px] shrink-0 cursor-pointer accent-[#0A0A0F]"
                    />
                    <span>
                      {t.form.privacyPre}{" "}
                      <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="font-medium text-blue underline-offset-4 hover:underline">
                        {t.form.privacyLink}
                      </a>
                    </span>
                  </label>
                  <ErrorText id="privacy-err" msg={show("privacy")} />
                </div>

                <button
                  type="submit"
                  className="focus-ring group flex w-full items-center justify-center gap-3 rounded-full bg-ink px-9 py-4 text-base font-medium text-paper transition-all duration-300 ease-premium hover:scale-[1.01] hover:shadow-[0_20px_60px_-20px_rgba(28,157,217,0.6)] lg:py-5 lg:text-lg"
                >
                  {t.form.submit}
                  <Arrow className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </form>
            )}
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute"
            style={{ right: 0, bottom: 28, width: 28 * Math.SQRT2, height: 1, background: "rgba(10,10,15,0.1)", transformOrigin: "right bottom", transform: "rotate(-45deg)" }}
          />
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[14px] font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className={`mt-2 h-[52px] w-full rounded-full border bg-paper/50 px-6 text-[15px] text-ink outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-ink-muted/70 focus:bg-paper-pure focus:ring-4 ${
          error ? "border-[#D14343] focus:ring-[#D14343]/15" : "border-ink/15 focus:border-ink/50 focus:ring-blue/15"
        }`}
      />
      <ErrorText id={`${id}-err`} msg={error} />
    </div>
  );
}

function ErrorText({ id, msg }: { id: string; msg?: string }) {
  return (
    <p id={id} role={msg ? "alert" : undefined} className={`overflow-hidden text-[13px] text-[#C23A3A] transition-all duration-300 ${msg ? "mt-2 max-h-10 opacity-100" : "max-h-0 opacity-0"}`}>
      {msg ?? ""}
    </p>
  );
}
