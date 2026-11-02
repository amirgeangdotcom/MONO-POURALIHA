"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { courses } from "@/lib/data";
import { PageShell } from "@/components/page-shell";
import { CourseCard } from "@/components/course-card";
import { useUserData } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const cats = ["All", ...Array.from(new Set(courses.map((c) => c.category)))];
const levels = ["All levels", "Beginner", "Intermediate", "Advanced"];

export default function CoursesPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [level, setLevel] = useState("All levels");
  const [enrol] = useUserData<Record<string, string[]>>("enrollments", {});

  const list = useMemo(() => courses.filter((c) =>
    (cat === "All" || c.category === cat) &&
    (level === "All levels" || c.level === level) &&
    (c.title + c.blurb + c.category + t(c.title) + t(c.blurb) + t(c.category)).toLowerCase().includes(q.trim().toLowerCase())), [q, cat, level, t]);

  return (
    <PageShell eyebrow="Courses" title="Skills clients actually pay for." intro="Practical, project-based courses built with working freelancers. Start free and learn at your own pace.">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("Filter by category")}>
          {cats.map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${cat === c ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{t(c)}</button>
          ))}
        </div>
        <div className="flex gap-3">
          <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label={t("Filter by level")} className="h-11 rounded-full border border-border bg-secondary px-4 text-sm text-foreground">
            {levels.map((l) => <option key={l} value={l}>{t(l)}</option>)}
          </select>
          <div className="relative">
            <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search courses")} aria-label={t("Search courses")} className="h-11 w-full rounded-full border border-border bg-secondary ps-10 pe-4 text-sm text-foreground outline-none focus:border-foreground md:w-56" />
          </div>
        </div>
      </div>
      {list.length === 0 ? (
        <p className="py-24 text-center text-muted-foreground">{t("No courses match your filters.")}</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c) => {
            const done = enrol[c.id];
            return <CourseCard key={c.id} course={c} progress={done ? Math.round((done.length / c.lessons.length) * 100) : undefined} />;
          })}
        </div>
      )}
    </PageShell>
  );
}
