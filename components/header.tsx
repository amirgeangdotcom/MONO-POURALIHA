"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LayoutDashboard, FileText, Briefcase, LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitch } from "@/components/language-switch";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/projects", label: "Projects" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Careers" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, ready, logOut } = useAuth();
  const { t, dir } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMenuOpen(false), [pathname]);

  const initials = user?.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const solid = isScrolled || isMenuOpen;

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl transition-all duration-300 ${solid ? "bg-background/80 backdrop-blur-md" : "bg-transparent"} ${isMenuOpen ? "rounded-3xl" : "rounded-full"}`}
      style={{
        boxShadow: solid
          ? "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"
          : "none",
      }}
    >
      <div className="flex items-center justify-between py-2 pe-2 ps-5 transition-all duration-300">
        <Link href="/" className="text-lg font-medium tracking-tight text-foreground">
          MONO<span className="ms-2 hidden text-xs font-normal text-muted-foreground sm:inline">{t("Freelance School")}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname.startsWith(l.href) ? "page" : undefined}
              className={`text-sm transition-colors hover:text-foreground ${pathname.startsWith(l.href) ? "text-foreground" : "text-muted-foreground"}`}
            >
              {t(l.label)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitch />
          {!ready ? <div className="h-9 w-24" /> : user ? (
            <DropdownMenu dir={dir}>
              <DropdownMenuTrigger asChild>
                <button type="button" aria-label={t("Account menu")} className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-medium text-background transition-opacity hover:opacity-80">
                  {initials}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs font-normal text-muted-foreground">{user.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/dashboard")}><LayoutDashboard className="me-2 h-4 w-4" />{t("Dashboard")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/portfolio")}><Briefcase className="me-2 h-4 w-4" />{t("My portfolio")}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/resume")}><FileText className="me-2 h-4 w-4" />{t("Resume builder")}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => { logOut(); router.push("/"); }}><LogOut className="me-2 h-4 w-4" />{t("Log out")}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login" className="px-2 text-sm text-muted-foreground transition-colors hover:text-foreground">{t("Log in")}</Link>
              <Link href="/signup" className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition-all hover:opacity-80">{t("Sign up")}</Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitch />
          <button type="button" onClick={() => setIsMenuOpen(!isMenuOpen)} className="me-2 text-foreground" aria-label={t("Toggle menu")} aria-expanded={isMenuOpen}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-border px-6 py-8 md:hidden">
          <nav className="flex flex-col gap-6" aria-label="Mobile">
            {links.map((l) => <Link key={l.href} href={l.href} className="text-lg text-foreground">{t(l.label)}</Link>)}
            {user ? (
              <>
                <Link href="/dashboard" className="text-lg text-foreground">{t("Dashboard")}</Link>
                <Link href="/resume" className="text-lg text-foreground">{t("Resume builder")}</Link>
                <button type="button" onClick={() => { logOut(); router.push("/"); }} className="mt-2 rounded-full bg-foreground px-5 py-3 text-center text-sm font-medium text-background">{t("Log out")}</button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-lg text-foreground">{t("Log in")}</Link>
                <Link href="/signup" className="mt-2 rounded-full bg-foreground px-5 py-3 text-center text-sm font-medium text-background">{t("Sign up")}</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
