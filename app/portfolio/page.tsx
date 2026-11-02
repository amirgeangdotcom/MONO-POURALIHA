"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Plus, Trash2, ExternalLink, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useUserData } from "@/lib/auth";
import { AuthGuard } from "@/components/auth-guard";
import { useI18n } from "@/lib/i18n";
import { PageShell } from "@/components/page-shell";

type Item = { id: string; title: string; description: string; url: string; tags: string[]; image: string };
const covers = ["/images/b2401fa5-4eac-465f-b1f9-014aadc182ee.png", "/images/dd1b32a8-3722-4ea2-8808-10d53532809d.png", "/images/249083d2-c49c-4c06-a125-376284d90c42.png", "/images/7638f650-8586-4403-8c13-141921a04f9d.png"];
const empty = { title: "", description: "", url: "", tags: "" };

function Portfolio() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [items, setItems] = useUserData<Item[]>("portfolio", []);
  const [bio, setBio] = useUserData<string>("portfolio-bio", "");
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  const startEdit = (it: Item) => { setForm({ title: it.title, description: it.description, url: it.url, tags: it.tags.join(", ") }); setEditing(it.id); setOpen(true); };
  const reset = () => { setForm(empty); setEditing(null); setOpen(false); setError(""); };

  function submit(e: FormEvent) {
    e.preventDefault();
    let url = form.url.trim();
    if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
    if (url) { try { new URL(url); } catch { return setError(t("Enter a valid link.")); } }
    const tags = form.tags.split(",").map((tag) => tag.trim()).filter(Boolean).slice(0, 5);
    if (editing) {
      setItems((p) => p.map((i) => (i.id === editing ? { ...i, title: form.title.trim(), description: form.description.trim(), url, tags } : i)));
      toast.success(t("Project updated."));
    } else {
      setItems((p) => [...p, { id: crypto.randomUUID(), title: form.title.trim(), description: form.description.trim(), url, tags, image: covers[p.length % covers.length] }]);
      toast.success(t("Project added to your portfolio."));
    }
    reset();
  }

  return (
    <PageShell eyebrow="Portfolio builder" title={t("{name}'s portfolio.", { name: user?.name.split(" ")[0] ?? "" })} intro="Showcase your best work. Add projects from courses and client briefs, and share the result with employers."
      actions={<button type="button" onClick={() => setOpen(true)} className="flex h-12 items-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background hover:opacity-80"><Plus size={16} />{t("Add project")}</button>}>
      <div className="mb-12 max-w-2xl">
        <label htmlFor="bio" className="mb-2 block text-sm font-medium text-foreground">{t("About you")}</label>
        <textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={300} placeholder={t("A short introduction for clients and employers (300 characters)")}
          className="w-full rounded-xl border border-border bg-secondary p-4 text-sm text-foreground outline-none focus:border-foreground" />
      </div>

      {open && (
        <form onSubmit={submit} className="mb-12 space-y-4 rounded-2xl border border-border p-8" aria-label={editing ? t("Edit project") : t("Add project")}>
          <h2 className="text-xl font-medium tracking-tight text-foreground">{editing ? t("Edit project") : t("New project")}</h2>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <div className="grid gap-4 md:grid-cols-2">
            <div><label htmlFor="t" className="mb-2 block text-sm font-medium text-foreground">{t("Title")}</label><input id="t" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-sm outline-none focus:border-foreground" /></div>
            <div><label htmlFor="u" className="mb-2 block text-sm font-medium text-foreground">{t("Link (optional)")}</label><input id="u" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://" dir="ltr" className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-sm outline-none focus:border-foreground" /></div>
          </div>
          <div><label htmlFor="d" className="mb-2 block text-sm font-medium text-foreground">{t("What did you do and what was the result?")}</label><textarea id="d" required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-border bg-secondary p-4 text-sm outline-none focus:border-foreground" /></div>
          <div><label htmlFor="g" className="mb-2 block text-sm font-medium text-foreground">{t("Skills (comma separated, up to 5)")}</label><input id="g" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-sm outline-none focus:border-foreground" /></div>
          <div className="flex gap-3"><button type="submit" className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-80">{editing ? t("Save changes") : t("Add to portfolio")}</button><button type="button" onClick={reset} className="rounded-full px-6 py-3 text-sm text-muted-foreground hover:text-foreground">{t("Cancel")}</button></div>
        </form>
      )}

      {bio && <p className="mb-12 max-w-3xl text-2xl leading-snug tracking-tight text-foreground">{bio}</p>}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border py-24 text-center">
          <p className="text-lg text-foreground">{t("Your portfolio is empty.")}</p>
          <p className="mt-2 text-muted-foreground">{t("Add your first project to start building proof of your skills.")}</p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <article key={it.id} className="group">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary"><Image src={it.image} alt="" fill className="object-cover transition-transform duration-700 group-hover:scale-105" /></div>
              <div className="py-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-medium text-foreground">{it.title}</h3>
                  <div className="flex items-center gap-1">
                    {it.url && <a href={it.url} target="_blank" rel="noopener noreferrer" aria-label={t("Open {title}", { title: it.title })} className="p-1.5 text-muted-foreground hover:text-foreground"><ExternalLink size={16} /></a>}
                    <button type="button" onClick={() => startEdit(it)} aria-label={t("Edit {title}", { title: it.title })} className="p-1.5 text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
                    <button type="button" onClick={() => { setItems((p) => p.filter((x) => x.id !== it.id)); toast(t("Project removed.")); }} aria-label={t("Delete {title}", { title: it.title })} className="p-1.5 text-muted-foreground hover:text-foreground"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{it.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">{it.tags.map((tag) => <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs text-foreground">{tag}</span>)}</div>
              </div>
            </article>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default function PortfolioPage() { return <AuthGuard><Portfolio /></AuthGuard>; }
