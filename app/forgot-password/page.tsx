"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { AuthLayout, FormError, primaryBtn } from "@/components/auth-layout";
import { PasswordField, TextField } from "@/components/password-field";

export default function ForgotPasswordPage() {
  const { requestReset, resetPassword } = useAuth();
  const { t } = useI18n();
  const [step, setStep] = useState<"email" | "reset" | "done">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function sendCode(e: FormEvent) {
    e.preventDefault(); setError("");
    const res = requestReset(email);
    if (!res.ok) return setError(res.error);
    // No email server in this template, so the code is shown on screen. Replace with an email in production.
    if (res.code) toast.info(t("Demo reset code: {code}", { code: res.code }), { duration: 20000 });
    else toast.info(t("If that account exists, a code has been sent."));
    setStep("reset");
  }

  async function reset(e: FormEvent) {
    e.preventDefault(); setError(""); setBusy(true);
    const res = await resetPassword(email, code, password);
    setBusy(false);
    if (!res.ok) return setError(res.error);
    setStep("done");
  }

  return (
    <AuthLayout
      title={step === "done" ? "Password updated." : "Reset password."}
      subtitle={step === "email" ? "Enter your email and we'll send a 6-digit reset code." : step === "reset" ? "Enter the code and choose a new password." : "You can now log in with your new password."}
      footer={<Link href="/login" className="text-foreground underline underline-offset-4">{t("Back to log in")}</Link>}
    >
      {step === "email" && (
        <form onSubmit={sendCode} className="space-y-5" noValidate>
          <FormError message={error} />
          <TextField id="email" label="Email" type="email" value={email} onChange={setEmail} autoComplete="email" />
          <button type="submit" className={primaryBtn}>{t("Send reset code")}</button>
        </form>
      )}
      {step === "reset" && (
        <form onSubmit={reset} className="space-y-5" noValidate>
          <FormError message={error} />
          <TextField id="code" label="6-digit code" value={code} onChange={setCode} autoComplete="one-time-code" placeholder="123456" />
          <PasswordField id="new" label="New password" value={password} onChange={setPassword} autoComplete="new-password" showRules />
          <button type="submit" disabled={busy} className={primaryBtn}>{busy ? t("Updating…") : t("Update password")}</button>
        </form>
      )}
      {step === "done" && <Link href="/login" className={`${primaryBtn} flex items-center justify-center`}>{t("Log in")}</Link>}
    </AuthLayout>
  );
}
