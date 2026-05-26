"use client";

import { useLanguage } from "@/lib/i18n";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();
  return (
    <button
      onClick={toggleLang}
      aria-label="Toggle language"
      className="inline-flex items-center justify-center rounded-lg border border-border bg-background h-7 px-2 text-[0.8rem] font-medium transition-colors hover:bg-muted"
    >
      {lang === "en" ? "ไทย" : "EN"}
    </button>
  );
}
