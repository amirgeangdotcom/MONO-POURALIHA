"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/language-switch";

const SEEN_KEY = "mono:splash-seen";
type Phase = "pending" | "open" | "closing" | "closed";

/** Full-screen start page. Shown once per browser session on the home page. */
export function SplashScreen() {
  const { t, dir } = useI18n();
  const [phase, setPhase] = useState<Phase>("pending");
  const startRef = useRef<HTMLButtonElement>(null);

  // Decide after mount (sessionStorage is not available on the server).
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(SEEN_KEY) === "1"; } catch { /* storage unavailable */ }
    setPhase(seen ? "closed" : "open");
  }, []);

  const close = useCallback(() => {
    try { sessionStorage.setItem(SEEN_KEY, "1"); } catch { /* ignore */ }
    setPhase("closing");
    window.setTimeout(() => { setPhase("closed"); window.scrollTo(0, 0); }, 700);
  }, []);

  // Lock page scroll while the splash covers the site.
  useEffect(() => {
    if (phase === "closed") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [phase]);

  useEffect(() => {
    if (phase !== "open") return;
    startRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, close]);

  if (phase === "closed") return null;

  // While deciding, only a plain black cover is rendered so the site never flashes underneath.
  if (phase === "pending") return <div aria-hidden className="fixed inset-0 z-[100] bg-black" />;

  const rise = (delay: number) => ({ animation: `mono-splash-rise 900ms cubic-bezier(.2,.7,.2,1) ${delay}ms both` });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("MONO Freelance School")}
      dir={dir}
      className={`dark fixed inset-0 z-[100] overflow-hidden bg-black text-white transition-opacity duration-700 ${phase === "closing" ? "pointer-events-none opacity-0" : "opacity-100"}`}
    >
      {/* Background: corten architecture, slow zoom, darkened for legibility */}
      <div className="absolute inset-0" style={{ animation: "mono-splash-zoom 22s ease-out both" }}>
        <Image src="/images/hero-mono.png" alt="" fill priority sizes="100vw" className="object-cover opacity-60" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent rtl:bg-gradient-to-l" />

      <div className="relative z-10 flex h-full flex-col px-6 py-6 md:px-12 md:py-10 lg:px-20">
        {/* Top bar */}
        <div className="flex items-center justify-between" style={rise(100)}>
          <span className="text-xl font-semibold tracking-tighter md:text-2xl" dir="ltr">MONO</span>
          <LanguageSwitch className="border-white/30" />
        </div>

        {/* Headline */}
        <div className="flex flex-1 flex-col justify-center">
          <p className="mb-6 text-xs uppercase tracking-[0.3em] text-white/70" style={rise(250)}>{t("MONO Freelance School")}</p>
          <h1 className="max-w-4xl text-5xl font-medium leading-[0.95] tracking-tighter md:text-7xl lg:text-8xl">
            <span className="block" style={rise(400)}>{t("Learn the craft.")}</span>
            <span className="block text-white/60" style={rise(560)}>{t("Build real proof.")}</span>
            <span className="block" style={rise(720)}>{t("Get hired.")}</span>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75 md:text-lg" style={rise(900)}>
            {t("Sewing, architecture, painting, electronics, design and development: real skills for real clients.")}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3" style={rise(1050)}>
            <button
              ref={startRef}
              type="button"
              onClick={close}
              className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-medium text-black transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {t("Start")}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
            </button>
            <button
              type="button"
              onClick={close}
              className="rounded-full border border-white/50 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {t("Skip intro")}
            </button>
          </div>
        </div>

        {/* CEO credit: larger and centered vertically on the left */}
        <div
          className="absolute left-6 top-1/2 z-20 -translate-y-1/2 md:left-12 lg:left-20"
          style={rise(1200)}
        >
          <div dir="ltr" className="flex max-w-[42vw] flex-col items-start gap-3 text-left">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70 md:text-base">CEO:</span>
            <span className="text-2xl font-medium leading-tight tracking-wide md:text-4xl lg:text-5xl">
              <span className="block uppercase">AMIRALI</span>
              <span className="block">Pourali</span>
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-white/60 md:text-sm">AND</span>
            <span className="text-2xl font-medium leading-tight tracking-wide md:text-4xl lg:text-5xl">
              <span className="block uppercase">AMIRHOSSEIN</span>
              <span className="block">Pourali</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
