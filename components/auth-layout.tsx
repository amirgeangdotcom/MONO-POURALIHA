"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/language-switch";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer: ReactNode }) {
  const { t } = useI18n();
  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 md:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="text-lg font-medium tracking-tight text-foreground">MONO<span className="ms-2 text-xs font-normal text-muted-foreground">{t("Freelance School")}</span></Link>
          <LanguageSwitch />
        </div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <h1 className="text-4xl font-medium tracking-tighter text-foreground md:text-5xl">{t(title)}</h1>
          <p className="mt-3 text-muted-foreground">{t(subtitle)}</p>
          <div className="mt-10">{children}</div>
          <div className="mt-8 text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
      <div className="relative hidden lg:block">
        <Image src="/images/hero-mono.png" alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <p className="absolute inset-x-12 bottom-16 text-3xl leading-snug text-white">{t("Learn the craft. Build real proof. Get hired.")}</p>
      </div>
    </main>
  );
}

export function FormError({ message }: { message: string }) {
  const { t } = useI18n();
  if (!message) return null;
  return <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{t(message)}</p>;
}

export const primaryBtn = "h-12 w-full rounded-full bg-foreground text-sm font-medium text-background transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50";
