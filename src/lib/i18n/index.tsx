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
}>({ lang: "en", toggleLang: () => {}, t: (k) => k });

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

  return (
    <LangCtx.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangCtx.Provider>
  );
}

export const useLanguage = () => useContext(LangCtx);
