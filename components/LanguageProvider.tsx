"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { DEFAULT_LANG, LANGS, dictionaries, type Dict, type Lang } from "@/lib/content";

const STORAGE_KEY = "rd-ws-lang";
const isLang = (v: unknown): v is Lang => v === "en" || v === "hr" || v === "sl";

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dict };
const LangContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Restore the visitor's choice (client only — SSR renders the default).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (isLang(saved)) setLangState(saved);
    } catch {
      /* storage unavailable — keep default */
    }
  }, []);

  // Keep <html lang>, title and description in sync with the language.
  useEffect(() => {
    const t = dictionaries[lang];
    document.documentElement.lang = lang === "sl" ? "sl" : lang;
    document.title = t.meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", t.meta.description);
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang, t: dictionaries[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

export function LanguageSwitcher() {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center gap-0.5 rounded-full border border-ink/10 bg-paper/70 p-0.5 backdrop-blur-md lg:gap-1 lg:p-1"
    >
      {LANGS.map(({ code, label }) => {
        const active = code === lang;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={`focus-ring font-display rounded-full px-2.5 py-1 text-[11px] font-medium tracking-[0.03em] transition-colors duration-200 lg:px-3.5 lg:py-1.5 lg:text-[13px] ${
              active ? "bg-ink text-paper" : "text-[#303030] hover:bg-ink/5"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
