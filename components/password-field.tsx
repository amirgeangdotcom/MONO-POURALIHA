"use client";

import { useState } from "react";
import { Eye, EyeOff, Check } from "lucide-react";
import { passwordIssues } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

export function PasswordField({ id, label, value, onChange, autoComplete, showRules = false }: {
  id: string; label: string; value: string; onChange: (v: string) => void; autoComplete: string; showRules?: boolean;
}) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const issues = passwordIssues(value);
  const rules = ["At least 8 characters", "One uppercase letter", "One lowercase letter", "One number"];
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">{t(label)}</label>
      <div className="relative">
        <input
          id={id} type={show ? "text" : "password"} value={value} autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)} required
          className="h-12 w-full rounded-xl border border-border bg-secondary ps-4 pe-12 text-sm text-foreground outline-none transition-colors focus:border-foreground"
        />
        <button type="button" onClick={() => setShow(!show)} aria-label={show ? t("Hide password") : t("Show password")}
          className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {showRules && value.length > 0 && (
        <>
          <div className="mt-3 flex gap-1" aria-hidden>
            {rules.map((_, i) => <span key={i} className={`h-1 flex-1 rounded-full ${i < rules.length - issues.length ? "bg-foreground" : "bg-border"}`} />)}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
            {rules.map((r) => (
              <li key={r} className={`flex items-center gap-1.5 text-xs ${issues.includes(r) ? "text-muted-foreground" : "text-foreground"}`}>
                <Check size={12} className={issues.includes(r) ? "opacity-20" : ""} />{t(r)}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function TextField({ id, label, type = "text", value, onChange, autoComplete, placeholder }: {
  id: string; label: string; type?: string; value: string; onChange: (v: string) => void; autoComplete?: string; placeholder?: string;
}) {
  const { t } = useI18n();
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">{t(label)}</label>
      <input id={id} type={type} value={value} autoComplete={autoComplete} placeholder={placeholder ? t(placeholder) : undefined} required
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-border bg-secondary px-4 text-sm text-foreground outline-none transition-colors focus:border-foreground" />
    </div>
  );
}
