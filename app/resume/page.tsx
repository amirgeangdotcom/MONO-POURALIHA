"use client";

import { useEffect } from "react";
import { Plus, Trash2, Printer } from "lucide-react";
import { useAuth, useUserData } from "@/lib/auth";
import { AuthGuard } from "@/components/auth-guard";
import { useI18n } from "@/lib/i18n";
import { PageShell } from "@/components/page-shell";

type Exp = { id: string; role: string; org: string; period: string; detail: string };
type Edu = { id: string; school: string; degree: string; period: string };
type Resume = { headline: string; phone: string; location: string; summary: string; skills: string; exp: Exp[]; edu: Edu[] };
const blank: Resume = { headline: "", phone: "", location: "", summary: "", skills: "", exp: [], edu: [] };
const input = "h-11 w-full rounded-xl border border-border bg-secondary px-4 text-sm text-foreground outline-none focus:border-foreground";
const uid = () => crypto.randomUUID();

function ResumeBuilder() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [r, setR, loaded] = useUserData<Resume>("resume", blank);
  const set = <K extends keyof Resume>(k: K, v: Resume[K]) => setR((p) => ({ ...p, [k]: v }));

  useEffect(() => { document.title = user ? `${user.name} – ${t("Resume")}` : t("Resume"); }, [user, t]);

  return (
    <PageShell eyebrow="Resume builder" title="A resume that gets replies." intro="Fill in your details and see a clean, ATS-friendly resume update live. Download it as a PDF with one click."
      actions={<button type="button" onClick={() => window.print()} className="flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background hover:opacity-80 print:hidden"><Printer size={16} />{t("Download PDF")}</button>}>
      <div className="grid gap-12 lg:grid-cols-2">
        <form className="space-y-8 print:hidden" onSubmit={(e) => e.preventDefault()} aria-label={t("Resume details")}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><label htmlFor="h" className="mb-2 block text-sm font-medium">{t("Headline")}</label><input id="h" className={input} value={r.headline} onChange={(e) => set("headline", e.target.value)} placeholder={t("e.g. Web designer & front-end developer")} /></div>
            <div><label htmlFor="p" className="mb-2 block text-sm font-medium">{t("Phone")}</label><input id="p" dir="ltr" className={input} value={r.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div><label htmlFor="l" className="mb-2 block text-sm font-medium">{t("Location")}</label><input id="l" className={input} value={r.location} onChange={(e) => set("location", e.target.value)} /></div>
          </div>
          <div><label htmlFor="s" className="mb-2 block text-sm font-medium">{t("Summary")}</label><textarea id="s" rows={4} className="w-full rounded-xl border border-border bg-secondary p-4 text-sm outline-none focus:border-foreground" value={r.summary} onChange={(e) => set("summary", e.target.value)} /></div>
          <div><label htmlFor="k" className="mb-2 block text-sm font-medium">{t("Skills (comma separated)")}</label><input id="k" className={input} value={r.skills} onChange={(e) => set("skills", e.target.value)} /></div>

          <fieldset className="space-y-4">
            <legend className="mb-2 flex w-full items-center justify-between text-sm font-medium">{t("Experience & projects")}
              <button type="button" onClick={() => set("exp", [...r.exp, { id: uid(), role: "", org: "", period: "", detail: "" }])} className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><Plus size={14} />{t("Add")}</button></legend>
            {r.exp.map((x, i) => (
              <div key={x.id} className="space-y-3 rounded-xl border border-border p-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <input aria-label={t("Role")} placeholder={t("Role")} className={input} value={x.role} onChange={(e) => set("exp", r.exp.map((y, j) => (j === i ? { ...y, role: e.target.value } : y)))} />
                  <input aria-label={t("Organisation")} placeholder={t("Organisation or client")} className={input} value={x.org} onChange={(e) => set("exp", r.exp.map((y, j) => (j === i ? { ...y, org: e.target.value } : y)))} />
                </div>
                <input aria-label={t("Period")} placeholder={t("e.g. Jan 2026 – Mar 2026")} className={input} value={x.period} onChange={(e) => set("exp", r.exp.map((y, j) => (j === i ? { ...y, period: e.target.value } : y)))} />
                <textarea aria-label={t("Details")} rows={2} placeholder={t("What you did and the result")} className="w-full rounded-xl border border-border bg-secondary p-3 text-sm outline-none focus:border-foreground" value={x.detail} onChange={(e) => set("exp", r.exp.map((y, j) => (j === i ? { ...y, detail: e.target.value } : y)))} />
                <button type="button" onClick={() => set("exp", r.exp.filter((_, j) => j !== i))} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><Trash2 size={12} />{t("Remove")}</button>
              </div>
            ))}
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="mb-2 flex w-full items-center justify-between text-sm font-medium">{t("Education")}
              <button type="button" onClick={() => set("edu", [...r.edu, { id: uid(), school: "", degree: "", period: "" }])} className="flex items-center gap-1 text-muted-foreground hover:text-foreground"><Plus size={14} />{t("Add")}</button></legend>
            {r.edu.map((x, i) => (
              <div key={x.id} className="grid gap-3 rounded-xl border border-border p-4 md:grid-cols-3">
                <input aria-label={t("School")} placeholder={t("School")} className={input} value={x.school} onChange={(e) => set("edu", r.edu.map((y, j) => (j === i ? { ...y, school: e.target.value } : y)))} />
                <input aria-label={t("Degree")} placeholder={t("Degree or course")} className={input} value={x.degree} onChange={(e) => set("edu", r.edu.map((y, j) => (j === i ? { ...y, degree: e.target.value } : y)))} />
                <input aria-label={t("Period")} placeholder={t("Years")} className={input} value={x.period} onChange={(e) => set("edu", r.edu.map((y, j) => (j === i ? { ...y, period: e.target.value } : y)))} />
                <button type="button" onClick={() => set("edu", r.edu.filter((_, j) => j !== i))} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:col-span-3"><Trash2 size={12} />{t("Remove")}</button>
              </div>
            ))}
          </fieldset>
          <p className="text-xs text-muted-foreground">{t("Changes are saved automatically")}{loaded ? "" : "…"}.</p>
        </form>

        <section aria-label={t("Resume preview")} className="print-area rounded-2xl border border-border bg-white p-10 text-neutral-900 shadow-sm print:border-0 print:p-0 print:shadow-none">
          <h2 className="text-4xl font-medium tracking-tighter">{user?.name}</h2>
          {r.headline && <p className="mt-1 text-lg text-neutral-600">{r.headline}</p>}
          <p className="mt-3 text-sm text-neutral-600">{[user?.email, r.phone, r.location].filter(Boolean).join(" · ")}</p>
          {r.summary && <><h3 className="mb-2 mt-8 border-b border-neutral-200 pb-1 text-xs font-medium uppercase tracking-widest">{t("Summary")}</h3><p className="text-sm leading-relaxed">{r.summary}</p></>}
          {r.skills && <><h3 className="mb-2 mt-8 border-b border-neutral-200 pb-1 text-xs font-medium uppercase tracking-widest">{t("Skills")}</h3><p className="text-sm">{r.skills.split(",").map((s) => s.trim()).filter(Boolean).join("  ·  ")}</p></>}
          {r.exp.length > 0 && <><h3 className="mb-2 mt-8 border-b border-neutral-200 pb-1 text-xs font-medium uppercase tracking-widest">{t("Experience & projects")}</h3>
            {r.exp.map((x) => <div key={x.id} className="mb-4"><div className="flex justify-between gap-4 text-sm"><p className="font-medium">{x.role}{x.org && `, ${x.org}`}</p><p className="shrink-0 text-neutral-500">{x.period}</p></div><p className="mt-1 text-sm leading-relaxed text-neutral-700">{x.detail}</p></div>)}</>}
          {r.edu.length > 0 && <><h3 className="mb-2 mt-8 border-b border-neutral-200 pb-1 text-xs font-medium uppercase tracking-widest">{t("Education")}</h3>
            {r.edu.map((x) => <div key={x.id} className="mb-2 flex justify-between gap-4 text-sm"><p><span className="font-medium">{x.school}</span>{x.degree && `, ${x.degree}`}</p><p className="shrink-0 text-neutral-500">{x.period}</p></div>)}</>}
        </section>
      </div>
    </PageShell>
  );
}

export default function ResumePage() { return <AuthGuard><ResumeBuilder /></AuthGuard>; }
