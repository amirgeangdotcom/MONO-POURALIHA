"use client";

import Link from "next/link";
import { FadeImage } from "@/components/fade-image";
import type { Course } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

export function CourseCard({ course, progress }: { course: Course; progress?: number }) {
  const { t } = useI18n();
  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary">
        <FadeImage src={course.image} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute start-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">{t(course.category)}</span>
      </div>
      <div className="py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium leading-snug text-foreground">{t(course.title)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(course.blurb)}</p>
          </div>
          <span className="whitespace-nowrap text-sm font-medium text-foreground">{t("{n} wks", { n: course.weeks })}</span>
        </div>
        <p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">{t(course.level)} · {t("{n} lessons", { n: course.lessons.length })}</p>
        {progress !== undefined && (
          <div className="mt-4" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label={t("{title} progress", { title: t(course.title) })}>
            <div className="h-1 w-full rounded-full bg-border"><div className="h-1 rounded-full bg-foreground transition-all" style={{ width: `${progress}%` }} /></div>
          </div>
        )}
      </div>
    </Link>
  );
}
