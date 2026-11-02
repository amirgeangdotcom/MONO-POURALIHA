"use client";

import { useMemo, useState } from "react";
import { Bookmark, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { jobs, type Job } from "@/lib/data";
import { useUserData } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useRequireAuth } from "@/components/auth-guard";
import { PageShell } from "@/components/page-shell";
import { ApplyDialog } from "@/components/apply-dialog";

export type JobApp = { jobId: string; message: string; date: number };
const types = ["All types", "Freelance", "Part-time", "Full-time", "Internship"];

export default function CareersPage() {
  const { t } = useI18n();
  const [saved, setSaved] = useUserData<string[]>("saved-jobs", []);
  const [apps, setApps] = useUserData<JobApp[]>("job-apps", []);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All types");
  const [remote, setRemote] = useState(false);
  const [target, setTarget] = useState<Job | null>(null);
  const requireAuth = useRequireAuth();

  const list = useMemo(() => jobs.filter((j) =>
    (type === "All types" || j.type === type) && (!remote || j.remote) &&
    (j.title + j.company + j.category + j.skills.join(" ") + t(j.title) + t(j.category) + j.skills.map((s) => t(s)).join(" ")).toLowerCase().includes(q.trim().toLowerCase())), [q, type, remote, t]);

  const save = (id: string) => {
    if (!requireAuth()) return;
    setSaved((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  return (
    <PageShell eyebrow="Career opportunities" title="Your first clients and first roles." intro="Freelance gigs, internships and junior roles from partners who hire MONO students, trainees, pupils and graduates.">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute start-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("Search role, company or skill")} aria-label={t("Search jobs")} className="h-11 w-full rounded-full border border-border bg-secondary ps-10 pe-4 text-sm text-foreground outline-none focus:border-foreground" />
        </div>
        <select value={type} onChange={(e) => setType(e.target.value)} aria-label={t("Job type")} className="h-11 rounded-full border border-border bg-secondary px-4 text-sm text-foreground">{types.map((ty) => <option key={ty} value={ty}>{t(ty)}</option>)}</select>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" checked={remote} onChange={(e) => setRemote(e.target.checked)} className="h-4 w-4 accent-foreground" />{t("Remote friendly")}</label>
      </div>

      {list.length === 0 ? <p className="py-24 text-center text-muted-foreground">{t("No roles match your filters.")}</p> : (
        <ul className="divide-y divide-border border-y border-border">
          {list.map((j) => {
            const applied = apps.some((a) => a.jobId === j.id);
            const isSaved = saved.includes(j.id);
            return (
              <li key={j.id} className="grid gap-4 py-8 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{t(j.type)} · {t(j.category)} · {t(j.posted)}</p>
                  <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground">{t(j.title)}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-x-4 text-sm text-muted-foreground"><span>{j.company}</span><span className="flex items-center gap-1"><MapPin size={13} />{t(j.location)}{j.remote && ` · ${t("Remote OK")}`}</span><span>{t(j.pay)}</span></p>
                  <p className="mt-3 max-w-2xl text-muted-foreground">{t(j.description)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">{j.skills.map((s) => <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">{t(s)}</span>)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => save(j.id)} aria-pressed={isSaved} aria-label={t(isSaved ? "Unsave {title}" : "Save {title}", { title: t(j.title) })} className="flex h-11 w-11 items-center justify-center rounded-full border border-border hover:border-foreground">
                    <Bookmark size={18} className={isSaved ? "fill-foreground" : ""} />
                  </button>
                  {applied
                    ? <span className="rounded-full bg-secondary px-6 py-3 text-sm text-foreground">{t("Applied")}</span>
                    : <button type="button" onClick={() => requireAuth() && setTarget(j)} className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80">{t("Apply")}</button>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <ApplyDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)} title={target ? t("Apply: {title}", { title: t(target.title) }) : ""} subtitle={target ? `${target.company} · ${t("your portfolio and resume are shared with this application")}` : ""}
        label={t("Cover note")} onSubmit={(message) => { if (!target) return; setApps((p) => [...p, { jobId: target.id, message, date: Date.now() }]); toast.success(t("Application sent.")); }} />
    </PageShell>
  );
}
