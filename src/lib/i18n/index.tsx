"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { en } from "./en";
import { th } from "./th";

export type Lang = "en" | "th";

const dicts = { en, th } as const;

function get(obj: unknown, path: string): string {
  const keys = path.split(".");
  let cur = obj;
  for (const k of keys) {
    if (typeof cur !== "object" || cur === null) return path;
    cur = (cur as Record<string, unknown>)[k];
  }
  return typeof cur === "string" ? cur : path;
}

const LangCtx = createContext<{
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
  tf: (key: string, params: Record<string, string | number>) => string;
}>({ lang: "en", toggleLang: () => {}, t: (k) => k, tf: (k) => k });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("apex-lang");
    if (stored === "en" || stored === "th") {
      setLang(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  const toggleLang = () =>
    setLang((prev) => {
      const next = prev === "en" ? "th" : "en";
      localStorage.setItem("apex-lang", next);
      document.documentElement.lang = next;
      return next;
    });

  const t = (key: string) => get(dicts[lang], key);

  const tf = (key: string, params: Record<string, string | number>) => {
    let str = t(key);
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
    return str;
  };

  return (
    <LangCtx.Provider value={{ lang, toggleLang, t, tf }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLanguage = () => useContext(LangCtx);

export function useRelativeTime() {
  const { t, tf } = useLanguage();
  return function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    if (diffSecs < 60) return t("time.just_now");
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return tf("time.minutes_ago", { n: diffMins });
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return tf("time.hours_ago", { n: diffHours });
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return tf("time.days_ago", { n: diffDays });
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return tf("time.months_ago", { n: diffMonths });
    return tf("time.years_ago", { n: Math.floor(diffMonths / 12) });
  };
}
