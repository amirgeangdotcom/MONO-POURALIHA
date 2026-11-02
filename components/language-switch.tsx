"use client";

import { useI18n, type Lang } from "@/lib/i18n";

const options: { code: Lang; label: string; name: string }[] = [
  { code: "en", label: "EN", name: "English" },
  { code: "fa", label: "فا", name: "فارسی" },
];

/** Compact EN | فا toggle. Always laid out left-to-right so it looks the same in both languages. */
export function LanguageSwitch({ className = "" }: { className?: string }) {
  const { lang, setLang, t } = useI18n();
  return (
    <div role="group" aria-label={t("Language")} dir="ltr" className={`inline-flex items-center rounded-full border border-border p-0.5 text-xs ${className}`}>
      {options.map((o) => (
        <button
          key={o.code}
          type="button"
          lang={o.code}
          title={o.name}
          aria-pressed={lang === o.code}
          onClick={() => setLang(o.code)}
          className={`rounded-full px-3 py-1 font-medium transition-colors ${lang === o.code ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
