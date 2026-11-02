"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth, passwordIssues, isEmail, type Role } from "@/lib/auth";
import { safeNext } from "@/lib/safe-next";
import { useI18n } from "@/lib/i18n";
import { AuthLayout, FormError, primaryBtn } from "@/components/auth-layout";
import { PasswordField, TextField } from "@/components/password-field";

function SignupForm() {
  const { user, ready, signUp } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (ready && user && !busy) router.replace(next); }, [ready, user, busy, next, router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!isEmail(email)) return setError(t("Enter a valid email address."));
    if (passwordIssues(password).length) return setError(t("Password does not meet the requirements."));
    if (password !== confirm) return setError(t("Passwords do not match."));
    if (!agree) return setError(t("Please accept the terms to continue."));
    setBusy(true);
    const res = await signUp({ name, email, password, role });
    if (!res.ok) { setBusy(false); return setError(res.error); }
    toast.success(t("Account created. Welcome to MONO!"));
    router.replace(next === "/dashboard" ? "/dashboard?welcome=1" : next);
  }

  return (
    <AuthLayout
      title="Start learning."
      subtitle="Create your free account to enrol in courses, join real projects and build your portfolio."
      footer={<>{t("Already have an account?")} <Link href="/login" className="text-foreground underline underline-offset-4">{t("Log in")}</Link></>}
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        <FormError message={error} />
        <TextField id="name" label="Full name" value={name} onChange={setName} autoComplete="name" placeholder="Your name" />
        <TextField id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-foreground">{t("I am a…")}</legend>
          <div className="grid grid-cols-2 gap-3">
            {(["student", "graduate", "trainee", "pupil"] as Role[]).map((r) => (
              <label key={r} className={`cursor-pointer rounded-xl border px-4 py-3 text-center text-sm transition-colors ${role === r ? "border-foreground bg-foreground text-background" : "border-border bg-secondary text-muted-foreground hover:text-foreground"}`}>
                <input type="radio" name="role" value={r} checked={role === r} onChange={() => setRole(r)} className="sr-only" />{t(r)}
              </label>
            ))}
          </div>
        </fieldset>
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" showRules />
        <PasswordField id="confirm" label="Confirm password" value={confirm} onChange={setConfirm} autoComplete="new-password" />
        <label className="flex cursor-pointer items-start gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-foreground" />
          {t("I agree to the Terms of Service and Privacy Policy.")}
        </label>
        <button type="submit" disabled={busy} className={primaryBtn}>{busy ? t("Creating account…") : t("Create account")}</button>
      </form>
    </AuthLayout>
  );
}

export default function SignupPage() {
  return <Suspense fallback={null}><SignupForm /></Suspense>;
}
