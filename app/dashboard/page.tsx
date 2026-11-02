"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { courses, projects, jobs } from "@/lib/data";
import { useAuth, useUserData, type Role } from "@/lib/auth";
import { AuthGuard } from "@/components/auth-guard";
import { PageShell } from "@/components/page-shell";
import { CourseCard } from "@/components/course-card";
import { PasswordField } from "@/components/password-field";
import { useI18n } from "@/lib/i18n";
import type { ProjectApp } from "@/app/projects/page";
import type { JobApp } from "@/app/careers/page";

const fmt = (time: number, locale?: string) => new Date(time).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });

function Overview() {
  const { t, n, locale } = useI18n();
  const [enrol] = useUserData<Record<string, string[]>>("enrollments", {});
  const [papps] = useUserData<ProjectApp[]>("project-apps", []);
  const [japps] = useUserData<JobApp[]>("job-apps", []);
  const [saved] = useUserData<string[]>("saved-jobs", []);
  const [portfolio] = useUserData<unknown[]>("portfolio", []);
  const mine = courses.filter((c) => enrol[c.id]);
  const lessonsDone = Object.values(enrol).reduce((n, l) => n + l.length, 0);
  const finished = mine.filter((c) => enrol[c.id].length === c.lessons.length);

  const stats = [["Courses", mine.length], ["Lessons done", lessonsDone], ["Projects", papps.length], ["Portfolio items", portfolio.length], ["Applications", japps.length]];

  return (
    <>
      <div className="mb-14 grid grid-cols-2 border-y border-border md:grid-cols-5">
        {stats.map(([k, v]) => (
          <div key={k} className="border-b border-e border-border p-6 text-center last:border-e-0 md:border-b-0">
            <p className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">{t(k as string)}</p>
            <p className="text-4xl font-medium text-foreground">{n(v)}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-medium tracking-tight text-foreground">{t("My courses")}</h2>
      {mine.length === 0 ? (
        <p className="mb-14 text-muted-foreground">{t("You have not enrolled yet.")} <Link href="/courses" className="text-foreground underline underline-offset-4">{t("Browse courses")}</Link></p>
      ) : (
        <div className="mb-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {mine.map((c) => <CourseCard key={c.id} course={c} progress={Math.round((enrol[c.id].length / c.lessons.length) * 100)} />)}
        </div>
      )}

      {finished.length > 0 && (
        <div className="mb-14"><h2 className="mb-4 text-2xl font-medium tracking-tight text-foreground">{t("Certificates")}</h2>
          <ul className="space-y-2">{finished.map((c) => <li key={c.id} className="rounded-xl bg-secondary px-5 py-4 text-foreground">{t("Certificate of completion: {title}", { title: t(c.title) })}</li>)}</ul></div>
      )}

      <div className="grid gap-12 md:grid-cols-2">
        <section>
          <h2 className="mb-4 text-2xl font-medium tracking-tight text-foreground">{t("Project applications")}</h2>
          {papps.length === 0 ? <p className="text-muted-foreground">{t("No applications yet.")} <Link href="/projects" className="text-foreground underline underline-offset-4">{t("Find a project")}</Link></p> : (
            <ul className="divide-y divide-border border-y border-border">{papps.map((a) => { const p = projects.find((x) => x.id === a.projectId); return p && <li key={a.projectId} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium text-foreground">{t(p.title)}</p><p className="text-xs text-muted-foreground">{p.client} · {fmt(a.date, locale)}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">{t(a.status)}</span></li>; })}</ul>
          )}
        </section>
        <section>
          <h2 className="mb-4 text-2xl font-medium tracking-tight text-foreground">{t("Jobs")}</h2>
          {japps.length + saved.length === 0 ? <p className="text-muted-foreground">{t("Nothing saved yet.")} <Link href="/careers" className="text-foreground underline underline-offset-4">{t("Explore careers")}</Link></p> : (
            <ul className="divide-y divide-border border-y border-border">
              {japps.map((a) => { const j = jobs.find((x) => x.id === a.jobId); return j && <li key={`a${a.jobId}`} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium text-foreground">{t(j.title)}</p><p className="text-xs text-muted-foreground">{j.company} · {fmt(a.date, locale)}</p></div><span className="rounded-full bg-foreground px-3 py-1 text-xs text-background">{t("Applied")}</span></li>; })}
              {saved.filter((id) => !japps.some((a) => a.jobId === id)).map((id) => { const j = jobs.find((x) => x.id === id); return j && <li key={`s${id}`} className="flex items-center justify-between gap-4 py-4"><div><p className="font-medium text-foreground">{t(j.title)}</p><p className="text-xs text-muted-foreground">{j.company}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">{t("Saved")}</span></li>; })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function Settings() {
  const { user, updateProfile, changePassword, deleteAccount } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const [name, setName] = useState(user?.name ?? "");
  const [role, setRole] = useState<Role>(user?.role ?? "student");
  const [cur, setCur] = useState(""); const [nw, setNw] = useState(""); const [pwErr, setPwErr] = useState("");
  const [del, setDel] = useState(""); const [delErr, setDelErr] = useState("");
  const field = "h-12 w-full rounded-xl border border-border bg-secondary px-4 text-sm text-foreground outline-none focus:border-foreground";

  const saveProfile = (e: FormEvent) => { e.preventDefault(); const r = updateProfile({ name, role }); r.ok ? toast.success(t("Profile updated.")) : toast.error(t(r.error)); };
  const savePw = async (e: FormEvent) => { e.preventDefault(); setPwErr(""); const r = await changePassword(cur, nw); if (!r.ok) return setPwErr(t(r.error)); setCur(""); setNw(""); toast.success(t("Password changed.")); };
  const remove = async (e: FormEvent) => { e.preventDefault(); setDelErr(""); const r = await deleteAccount(del); if (!r.ok) return setDelErr(t(r.error)); toast(t("Your account was deleted.")); router.replace("/"); };

  return (
    <div className="grid max-w-5xl gap-16 md:grid-cols-2">
      <form onSubmit={saveProfile} className="space-y-5">
        <h2 className="text-2xl font-medium tracking-tight text-foreground">{t("Profile")}</h2>
        <div><label htmlFor="pn" className="mb-2 block text-sm font-medium">{t("Full name")}</label><input id="pn" className={field} value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div><label className="mb-2 block text-sm font-medium">{t("Email")}</label><input dir="ltr" className={`${field} opacity-60`} value={user?.email} disabled /></div>
        <div><label htmlFor="pr" className="mb-2 block text-sm font-medium">{t("I am a…")}</label><select id="pr" className={field} value={role} onChange={(e) => setRole(e.target.value as Role)}><option value="student">{t("Student")}</option><option value="graduate">{t("Graduate")}</option><option value="trainee">{t("Trainee")}</option><option value="pupil">{t("Pupil")}</option></select></div>
        <button type="submit" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80">{t("Save profile")}</button>
      </form>
      <div className="space-y-16">
        <form onSubmit={savePw} className="space-y-5">
          <h2 className="text-2xl font-medium tracking-tight text-foreground">{t("Change password")}</h2>
          {pwErr && <p role="alert" className="text-sm text-destructive">{pwErr}</p>}
          <PasswordField id="cur" label="Current password" value={cur} onChange={setCur} autoComplete="current-password" />
          <PasswordField id="nw" label="New password" value={nw} onChange={setNw} autoComplete="new-password" showRules />
          <button type="submit" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80">{t("Update password")}</button>
        </form>
        <form onSubmit={remove} className="space-y-5 rounded-2xl border border-destructive/40 p-6">
          <h2 className="text-xl font-medium tracking-tight text-foreground">{t("Delete account")}</h2>
          <p className="text-sm text-muted-foreground">{t("This permanently removes your account, progress, portfolio and resume from this browser.")}</p>
          {delErr && <p role="alert" className="text-sm text-destructive">{delErr}</p>}
          <PasswordField id="del" label="Confirm with your password" value={del} onChange={setDel} autoComplete="current-password" />
          <button type="submit" disabled={!del} className="rounded-full bg-destructive px-6 py-3 text-sm font-medium text-destructive-foreground hover:opacity-80 disabled:opacity-50">{t("Delete my account")}</button>
        </form>
      </div>
    </div>
  );
}

function DashboardInner() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [tab, setTab] = useState<"overview" | "settings">("overview");
  const welcome = useSearchParams().get("welcome");
  useEffect(() => { if (welcome) window.history.replaceState(null, "", "/dashboard"); }, [welcome]);

  return (
    <PageShell eyebrow={welcome ? "Welcome to MONO" : "Dashboard"} title={t("Hello, {name}.", { name: user?.name.split(" ")[0] ?? "" })}
      intro={welcome ? "Your account is ready. Enrol in a course to get started, then join a real project." : "Pick up where you left off."}
      actions={<div className="flex gap-2" role="tablist">{(["overview", "settings"] as const).map((tb) => <button key={tb} type="button" role="tab" aria-selected={tab === tb} onClick={() => setTab(tb)} className={`rounded-full px-5 py-2.5 text-sm capitalize ${tab === tb ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>{t(tb)}</button>)}</div>}>
      {tab === "overview" ? <Overview /> : <Settings />}
    </PageShell>
  );
}

export default function DashboardPage() {
  return <AuthGuard><Suspense fallback={null}><DashboardInner /></Suspense></AuthGuard>;
}
