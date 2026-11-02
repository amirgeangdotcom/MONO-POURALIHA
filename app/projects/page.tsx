"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Clock, Wallet } from "lucide-react";
import { projects, type Project } from "@/lib/data";
import { useUserData } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { useRequireAuth } from "@/components/auth-guard";
import { PageShell } from "@/components/page-shell";
import { ApplyDialog } from "@/components/apply-dialog";

export type ProjectApp = { projectId: string; pitch: string; status: "Applied" | "In progress" | "Submitted"; date: number };
const next = { Applied: "In progress", "In progress": "Submitted" } as const;
const cats = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

export default function ProjectsPage() {
  const { t } = useI18n();
  const [apps, setApps] = useUserData<ProjectApp[]>("project-apps", []);
  const [cat, setCat] = useState("All");
  const [target, setTarget] = useState<Project | null>(null);
  const requireAuth = useRequireAuth();
  const list = projects.filter((p) => cat === "All" || p.category === cat);

  const apply = (p: Project) => { if (requireAuth()) setTarget(p); };
  const advance = (id: string) => setApps((prev) => prev.map((a) => {
    if (a.projectId !== id || a.status === "Submitted") return a;
    const status = next[a.status]; toast.success(status === "Submitted" ? t("Work submitted for mentor review.") : t("Project started. Good luck!"));
    return { ...a, status };
  }));
  const withdraw = (id: string) => { setApps((prev) => prev.filter((a) => a.projectId !== id)); toast(t("Application withdrawn.")); };

  return (
    <PageShell eyebrow="Real-world projects" title="Work on briefs from real clients." intro="Apply to paid, mentored projects. Every finished project becomes proof in your portfolio.">
      <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label={t("Filter by category")}>
        {cats.map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c}
            className={`rounded-full px-4 py-2 text-sm transition-colors ${cat === c ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{t(c)}</button>
        ))}
      </div>
      <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        {list.map((p) => {
          const app = apps.find((a) => a.projectId === p.id);
          return (
            <article key={p.id} className="flex flex-col bg-background p-8">
              <p className="text-xs uppercase tracking-widest text-muted-foreground">{t(p.category)} · {t(p.level)}</p>
              <h2 className="mt-3 text-2xl font-medium leading-tight tracking-tight text-foreground">{t(p.title)}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{t("for {client}", { client: p.client })}</p>
              <p className="mt-4 flex-1 leading-relaxed text-muted-foreground">{t(p.brief)}</p>
              <div className="mt-5 flex flex-wrap gap-2">{p.skills.map((s) => <span key={s} className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">{t(s)}</span>)}</div>
              <div className="mt-6 flex items-center gap-5 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><Wallet size={14} />{t(p.budget)}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} />{t(p.duration)}</span>
              </div>
              <div className="mt-6 flex items-center gap-4">
                {!app ? (
                  <button type="button" onClick={() => apply(p)} className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80">{t("Apply to project")}</button>
                ) : (
                  <>
                    <span className="rounded-full bg-secondary px-4 py-2 text-sm text-foreground" aria-live="polite">{t(app.status)}</span>
                    {app.status !== "Submitted" && <button type="button" onClick={() => advance(p.id)} className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-80">{app.status === "Applied" ? t("Start project") : t("Submit work")}</button>}
                    {app.status === "Applied" && <button type="button" onClick={() => withdraw(p.id)} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">{t("Withdraw")}</button>}
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
      <ApplyDialog open={!!target} onOpenChange={(o) => !o && setTarget(null)} title={target ? t("Apply: {title}", { title: t(target.title) }) : ""} subtitle={target ? t("Client: {client}", { client: target.client }) : ""}
        label={t("Why are you a good fit for this brief?")}
        onSubmit={(pitch) => { if (!target) return; setApps((p) => [...p, { projectId: target.id, pitch, status: "Applied", date: Date.now() }]); toast.success(t("Application sent.")); }} />
    </PageShell>
  );
}
