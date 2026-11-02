"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { safeNext } from "@/lib/safe-next";
import { AuthLayout, FormError, primaryBtn } from "@/components/auth-layout";
import { PasswordField, TextField } from "@/components/password-field";

function LoginForm() {
  const { user, ready, logIn } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (ready && user) router.replace(next); }, [ready, user, next, router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    const res = await logIn(email, password, remember);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    toast.success(t("Welcome back"));
    router.replace(next);
  }

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Log in to continue your courses, projects and applications."
      footer={<>{t("New to MONO?")} <Link href={`/signup${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-foreground underline underline-offset-4">{t("Create an account")}</Link></>}
    >
      <form onSubmit={submit} className="space-y-5" noValidate>
        <FormError message={error} />
        <TextField id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" placeholder="you@example.com" />
        <PasswordField id="password" label="Password" value={password} onChange={setPassword} autoComplete="current-password" />
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-muted-foreground">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-foreground" /> {t("Keep me signed in")}
          </label>
          <Link href="/forgot-password" className="text-foreground underline underline-offset-4">{t("Forgot password?")}</Link>
        </div>
        <button type="submit" disabled={busy || !email || !password} className={primaryBtn}>{busy ? t("Signing in…") : t("Log in")}</button>
      </form>
    </AuthLayout>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginForm /></Suspense>;
}
