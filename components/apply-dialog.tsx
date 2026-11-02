"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "@/lib/i18n";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function ApplyDialog({ open, onOpenChange, title, subtitle, label, onSubmit }: {
  open: boolean; onOpenChange: (o: boolean) => void; title: string; subtitle: string; label: string; onSubmit: (message: string) => void;
}) {
  const { t } = useI18n();
  const [msg, setMsg] = useState("");
  const submit = (e: FormEvent) => { e.preventDefault(); onSubmit(msg.trim()); setMsg(""); onOpenChange(false); };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium tracking-tight">{title}</DialogTitle>
          <DialogDescription>{subtitle}</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <label htmlFor="apply-msg" className="block text-sm font-medium text-foreground">{label}</label>
          <textarea id="apply-msg" value={msg} onChange={(e) => setMsg(e.target.value)} required minLength={20} rows={5}
            placeholder={t("At least 20 characters")} className="w-full rounded-xl border border-border bg-secondary p-4 text-sm text-foreground outline-none focus:border-foreground" />
          <button type="submit" className="h-12 w-full rounded-full bg-foreground text-sm font-medium text-background hover:opacity-80">{t("Submit application")}</button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
