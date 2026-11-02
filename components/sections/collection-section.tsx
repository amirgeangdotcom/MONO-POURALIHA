"use client";

import Link from "next/link";
import { FadeImage } from "@/components/fade-image";
import { courses } from "@/lib/data";
import { useI18n } from "@/lib/i18n";

const featured = courses.slice(0, 3);

function Card({ course }: { course: (typeof featured)[number] }) {
  const { t } = useI18n();
  return (
    <Link href={`/courses/${course.id}`} className="group block">
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
        <FadeImage src={course.image} alt={t(course.title)} fill className="object-cover group-hover:scale-105" />
      </div>
      <div className="py-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-medium leading-snug text-foreground">{t(course.title)}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t(course.blurb)}</p>
          </div>
          <span className="whitespace-nowrap text-2xl font-medium text-foreground">{t("{n} wks", { n: course.weeks })}</span>
        </div>
      </div>
    </Link>
  );
}

export function CollectionSection() {
  const { t } = useI18n();
  return (
    <section id="courses" className="bg-background">
      <div className="flex items-end justify-between px-6 py-20 md:px-12 md:py-10 lg:px-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">{t("Featured courses")}</h2>
        <Link href="/courses" className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground">{t("View all courses")}</Link>
      </div>

      <div className="pb-24">
        {/* Mobile: Horizontal Carousel */}
        <div className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-4 md:hidden">
          {featured.map((c) => (
            <div key={c.id} className="w-[75vw] flex-shrink-0 snap-center"><Card course={c} /></div>
          ))}
        </div>
        {/* Desktop: Grid */}
        <div className="hidden gap-8 md:grid md:grid-cols-3 md:px-12 lg:px-20">
          {featured.map((c) => <Card key={c.id} course={c} />)}
        </div>
      </div>
    </section>
  );
}
