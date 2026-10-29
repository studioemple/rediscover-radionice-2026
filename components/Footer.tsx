"use client";

import Image from "next/image";
import { useLang } from "@/components/LanguageProvider";
import { CONTACT_EMAIL, PRIVACY_URL } from "@/lib/content";

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="relative w-full px-5 pb-10 pt-4 sm:px-8 lg:pb-12">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-8 border-t border-ink/[0.08] pt-8 sm:flex-row sm:justify-between sm:gap-6 lg:pt-16">
        <a href={`mailto:${CONTACT_EMAIL}`} className="focus-ring text-sm text-ink-soft transition-colors hover:text-ink lg:text-base">
          {CONTACT_EMAIL}
        </a>
        <a href={t.footer.websiteUrl} target="_blank" rel="noopener noreferrer" aria-label="Rentlio" className="focus-ring opacity-70 transition-opacity hover:opacity-100">
          <Image src="/rentlio-logo.svg" alt="Rentlio" width={120} height={28} className="h-7 w-auto lg:h-8" />
        </a>
        <a href={t.footer.websiteUrl} target="_blank" rel="noopener noreferrer" className="focus-ring text-sm text-ink-soft transition-colors hover:text-ink lg:text-base">
          {t.footer.website}
        </a>
      </div>
      <div className="mx-auto mt-8 flex max-w-[1180px] flex-col items-center gap-3 text-xs text-ink-soft sm:flex-row sm:justify-between lg:mt-10 lg:text-sm">
        <p>© {new Date().getFullYear()} Rentlio. {t.footer.rights}</p>
        <a href={PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="focus-ring transition-colors hover:text-ink">
          {t.footer.privacy}
        </a>
      </div>
    </footer>
  );
}
