"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { fa, faPatterns, toFaDigits } from "@/lib/fa";

export type Lang = "en" | "fa";
type Vars = Record<string, string | number>;

export const LANG_KEY = "mono-lang";
const TITLE_EN = "MONO Freelance School";
const TITLE_FA = "مدرسه فریلنسری مونو";

type I18n = {
  lang: Lang;
  dir: "ltr" | "rtl";
  /** BCP-47 locale for dates / number formatting. */
  locale: string;
  setLang: (l: Lang) => void;
  /** Translate an English string (English text is the key). Supports {placeholders}. */
  t: (key: string, vars?: Vars) => string;
  /** Format a number / numeric string (Persian digits in Persian). */
  n: (value: number | string) => string;
};

const I18nContext = createContext<I18n | null>(null);

function applyToDocument(lang: Lang) {
  const el = document.documentElement;
  el.lang = lang;
  el.dir = lang === "fa" ? "rtl" : "ltr";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // Always start in English so server and client markup match; the saved choice is applied right after mount.
  const [lang, setLangState] = useState<Lang>("en");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === "fa" || saved === "en") setLangState(saved);
    } catch {
      /* storage unavailable: stay in English */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    // Wait for the saved choice so a Persian visitor never flips through LTR on load.
    if (!hydrated) return;
    applyToDocument(lang);
    // Only swap the default site title, so pages that set their own title keep it.
    if (lang === "fa" && document.title === TITLE_EN) document.title = TITLE_FA;
    if (lang === "en" && document.title === TITLE_FA) document.title = TITLE_EN;
  }, [lang, hydrated]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<I18n>(() => {
    const n = (v: number | string) => (lang === "fa" ? toFaDigits(v) : String(v));

    const t = (key: string, vars?: Vars) => {
      let out = key;
      if (lang === "fa") {
        if (key in fa) out = fa[key];
        else {
          for (const [re, fn] of faPatterns) {
            const m = key.match(re);
            if (m) { out = fn(m); break; }
          }
        }
      }
      if (vars) {
        out = out.replace(/\{(\w+)\}/g, (_, k: string) => {
          if (!(k in vars)) return `{${k}}`;
          const v = vars[k];
          return typeof v === "number" ? n(v) : String(v);
        });
      }
      return out;
    };

    return { lang, dir: lang === "fa" ? "rtl" : "ltr", locale: lang === "fa" ? "fa-IR" : "en", setLang, t, n };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
