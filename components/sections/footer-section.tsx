"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

const footerLinks = {
  explore: [
    { label: "Courses", href: "/courses" },
    { label: "Real projects", href: "/projects" },
    { label: "Careers", href: "/careers" },
    { label: "Portfolio builder", href: "/portfolio" },
  ],
  about: [
    { label: "Resume builder", href: "/resume" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Sign up", href: "/signup" },
    { label: "Log in", href: "/login" },
  ],
  service: [
    { label: "FAQ", href: "#" },
    { label: "Mentorship", href: "#" },
    { label: "Hire graduates", href: "#" },
    { label: "Contact", href: "#" },
  ],
};

export function FooterSection() {
  const { t } = useI18n();
  return (
    <footer className="bg-background">
      {/* Main Footer Content */}
      <div className="border-t border-border px-6 py-16 md:px-12 md:py-20 lg:px-20">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1 lg:col-span-2">
            <Link href="/" className="text-lg font-medium text-foreground">
              MONO
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("An online freelancing school helping students, trainees, pupils and graduates learn skills, win real projects and launch their careers.")}
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">{t("Learn")}</h4>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">{t("Account")}</h4>
            <ul className="space-y-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service */}
          <div>
            <h4 className="mb-4 text-sm font-medium text-foreground">{t("School")}</h4>
            <ul className="space-y-3">
              {footerLinks.service.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border px-6 py-6 md:px-12 lg:px-20">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-xs text-muted-foreground">
            {t("© 2026 MONO Freelance School. All rights reserved.")}
          </p>

          

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("Instagram")}
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("Twitter")}
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {t("YouTube")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
