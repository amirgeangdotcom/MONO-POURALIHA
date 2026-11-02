"use client";

import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/sections/footer-section";

export function PageShell({ eyebrow, title, intro, children, actions }: {
  eyebrow?: string; title: string; intro?: string; children: ReactNode; actions?: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="px-6 pb-24 pt-36 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              {eyebrow && <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">{t(eyebrow)}</p>}
              <h1 className="max-w-3xl text-5xl font-medium leading-[0.95] tracking-tighter text-foreground md:text-7xl">{t(title)}</h1>
              {intro && <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{t(intro)}</p>}
            </div>
            {actions}
          </div>
          {children}
        </div>
      </section>
      <FooterSection />
    </main>
  );
}
