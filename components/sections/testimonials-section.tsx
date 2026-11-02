"use client";

import Image from "next/image";
import { testimonials } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export function TestimonialsSection() {
  const { t } = useI18n();
  return (
    <section id="about" className="bg-background">
      {/* About Image with Text Overlay */}
      <div className="relative aspect-[16/9] w-full">
        <Image
          src="/images/testimonial-house.png"
          alt={t("MONO graduates at work")}
          fill
          className="object-cover"
        />
        {/* Fade gradient overlay - dark at bottom fading to transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-end justify-center px-6 pb-16 md:px-12 md:pb-24 lg:px-20 lg:pb-32">
          <p className="mx-auto max-w-5xl text-2xl leading-relaxed text-white md:text-3xl lg:text-[2.5rem] lg:leading-snug text-center">
            {t("Built for people who want to turn skills into income, with real clients, real feedback and a portfolio that speaks for itself.")}
          </p>
        </div>
      </div>

      {/* Graduate stories */}
      <div className="grid gap-px border-t border-border bg-border md:grid-cols-3">
        {testimonials.map((item) => (
          <figure key={item.name} className="flex flex-col justify-between bg-background p-8 md:p-12">
            <blockquote className="text-xl leading-snug text-foreground">“{t(item.quote)}”</blockquote>
            <figcaption className="mt-8 text-sm"><span className="block font-medium text-foreground">{t(item.name)}</span><span className="text-muted-foreground">{t(item.role)}</span></figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
