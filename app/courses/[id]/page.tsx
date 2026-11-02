"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Check, Clock, Award } from "lucide-react";
import { toast } from "sonner";
import { courses } from "@/lib/data";
import { useUserData } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useRequireAuth } from "@/components/auth-guard";
import { PageShell } from "@/components/page-shell";

export default function CourseDetail() {
  const { t, n, lang } = useI18n();
  const { id } = useParams<{ id: string }>();
  const course = courses.find((c) => c.id === id);
  const [enrol, setEnrol] = useUserData<Record<string, string[]>>("enrollments", {});
  const requireAuth = useRequireAuth();

  if (!course) {
    return <PageShell title="Course not found."><Link href="/courses" className="underline underline-offset-4">{t("Back to all courses")}</Link></PageShell>;
  }

  const done = enrol[course.id];
  const enrolled = !!done;
  const completed = done ?? [];
  const pct = Math.round((completed.length / course.lessons.length) * 100);

  const enrolNow = () => {
    if (!requireAuth()) return;
    setEnrol((p) => ({ ...p, [course.id]: [] }));
    toast.success(t("Enrolled in {title}", { title: t(course.title) }));
  };
  const toggle = (lessonId: string) => {
    const next = completed.includes(lessonId) ? completed.filter((x) => x !== lessonId) : [...completed, lessonId];
    setEnrol((p) => ({ ...p, [course.id]: next }));
    if (next.length === course.lessons.length) toast.success(t("Course complete! Your certificate is on your dashboard."));
  };
  const leave = () => { setEnrol((p) => { const { [course.id]: _r, ...rest } = p; return rest; }); toast(t("You have left this course.")); };

  return (
    <PageShell eyebrow={`${t(course.category)} · ${t(course.level)}`} title={course.title} intro={course.blurb}
      actions={!enrolled ? (
        <button type="button" onClick={enrolNow} className="h-12 rounded-full bg-foreground px-8 text-sm font-medium text-background hover:opacity-80">{t("Enrol for free")}</button>
      ) : (
        <div className="w-full md:w-64" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={t("Course progress")}>
          <p className="mb-2 text-sm text-muted-foreground">{t("{pct}% complete", { pct })}</p>
          <div className="h-1.5 rounded-full bg-border"><div className="h-1.5 rounded-full bg-foreground transition-all" style={{ width: `${pct}%` }} /></div>
        </div>
      )}>
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-6 text-2xl font-medium tracking-tight text-foreground">{t("Lessons")}</h2>
          <ul className="divide-y divide-border border-y border-border">
            {course.lessons.map((l, i) => {
              const isDone = completed.includes(l.id);
              return (
                <li key={l.id} className="flex items-start gap-4 py-5">
                  <button type="button" disabled={!enrolled} onClick={() => toggle(l.id)} aria-pressed={isDone}
                    aria-label={enrolled ? t(isDone ? 'Mark "{title}" incomplete' : 'Mark "{title}" complete', { title: t(l.title) }) : t("Enrol to track progress")}
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${isDone ? "border-foreground bg-foreground text-background" : "border-border text-transparent"} ${enrolled ? "hover:border-foreground" : "cursor-not-allowed opacity-50"}`}>
                    <Check size={14} />
                  </button>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{t("Lesson {n}", { n: i + 1 })}</p>
                    <p className={`font-medium ${isDone ? "text-muted-foreground line-through" : "text-foreground"}`}>{t(l.title)}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{t(l.summary)}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} />{t("{n} min", { n: l.minutes })}</span>
                </li>
              );
            })}
          </ul>
          {enrolled && pct === 100 && (
            <div className="mt-8 flex items-center gap-4 rounded-2xl bg-secondary p-6">
              <Award size={28} /><p className="text-foreground">{t("You completed this course. Add what you built to your")} <Link href="/portfolio" className="underline underline-offset-4">{t("portfolio")}</Link>{lang === "fa" ? " خود اضافه کنید." : "."}</p>
            </div>
          )}
          {enrolled && <button type="button" onClick={leave} className="mt-8 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">{t("Leave course")}</button>}
        </div>
        <aside>
          <h2 className="mb-6 text-2xl font-medium tracking-tight text-foreground">{t("You will learn to")}</h2>
          <ul className="space-y-4">
            {course.outcomes.map((o) => <li key={o} className="flex gap-3 text-muted-foreground"><Check size={18} className="mt-0.5 shrink-0 text-foreground" />{t(o)}</li>)}
          </ul>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border text-center">
            {[["Duration", t("{n} weeks", { n: course.weeks })], ["Level", t(course.level)], ["Lessons", n(course.lessons.length)], ["Price", t(course.price)]].map(([k, v]) => (
              <div key={k} className="bg-background p-5"><dt className="text-xs uppercase tracking-widest text-muted-foreground">{t(k)}</dt><dd className="mt-1 font-medium text-foreground">{v}</dd></div>
            ))}
          </dl>
        </aside>
      </div>
    </PageShell>
  );
}
