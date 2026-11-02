"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";

const specs = [
  { label: "Students, trainees, pupils & graduates", value: "12,400" },
  { label: "Client projects", value: "860" },
  { label: "Hiring partners", value: "140" },
  { label: "Placed in 6 months", value: "87%" },
];

export function EditorialSection() {
  const { t, n } = useI18n();
  const videoRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  const updateParallax = useCallback(() => {
    if (!videoRef.current) return;
    
    const rect = videoRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate when video enters and exits viewport
    const videoTop = rect.top;
    const videoBottom = rect.bottom;
    
    // Progress from 0 (entering viewport) to 1 (exiting viewport)
    if (videoBottom > 0 && videoTop < windowHeight) {
      const progress = 1 - (videoTop + rect.height / 2) / (windowHeight + rect.height);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateParallax();
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [updateParallax]);

  // Parallax effect: video moves up as you scroll down
  const parallaxY = (scrollProgress - 0.5) * 30; // -15px to +15px range

  return (
    <section className="bg-background">
      {/* Call to action */}
      <div className="px-6 py-24 text-center md:px-12 lg:px-20">
        <h2 className="mx-auto max-w-3xl text-4xl font-medium leading-none tracking-tighter text-foreground md:text-6xl">{t("Your first client is closer than you think.")}</h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup" className="rounded-full bg-foreground px-7 py-3 text-sm font-medium text-background transition-opacity hover:opacity-80">{t("Create free account")}</Link>
          <Link href="/projects" className="rounded-full border border-border px-7 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary">{t("See real projects")}</Link>
        </div>
      </div>

      {/* Decorative Icons */}
      <div className="flex items-center justify-center gap-6 pb-20">
        
        
      </div>

      {/* Full-width Video with Parallax */}
      <div ref={videoRef} className="relative aspect-[16/9] w-full md:aspect-[21/9] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `scale(1.15) translate3d(0, ${parallaxY}px, 0) translateZ(0)`,
            WebkitTransform: `scale(1.15) translate3d(0, ${parallaxY}px, 0) translateZ(0)`,
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform',
          }}
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/27eb7fb4-0105-4010-ac9e-0ac977a31b05_1-FZ89nvBAAsR3caRJbhYv7T2mjBofth.mp4"
        />
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="border-b border-e border-border p-8 text-center last:border-e-0 md:border-b-0"
          >
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              {t(spec.label)}
            </p>
            <p className="font-medium text-foreground text-5xl">
              {n(spec.value)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
