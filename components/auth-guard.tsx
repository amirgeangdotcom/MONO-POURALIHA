"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

/** Wrap any page that needs a signed-in user. Redirects to /login and returns afterwards. */
export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [ready, user, router, pathname]);

  if (!ready || !user) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground" role="status">{t("Checking your session…")}</div>;
  }
  return <>{children}</>;
}

/** For actions inside public pages: returns true when signed in, otherwise sends the user to log in. */
export function useRequireAuth() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  return () => {
    if (user) return true;
    router.push(`/login?next=${encodeURIComponent(pathname)}`);
    return false;
  };
}
