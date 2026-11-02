# MONO Freelance School

Next.js 16 + Tailwind 4 site built from the MONO e-commerce template.

## Run
```bash
npm install
npm run dev      # http://localhost:3000
```

## Pages
`/` home · `/courses` · `/courses/[id]` · `/projects` · `/careers` · `/portfolio` · `/resume` · `/dashboard` · `/login` · `/signup` · `/forgot-password`
(`/portfolio`, `/resume`, `/dashboard` require login; enrolling, applying and saving jobs prompt login.)

## Content
Courses, projects, jobs and testimonials live in `lib/data.ts`.

## Authentication
`lib/auth.tsx` is a browser-only demo: accounts and progress are stored in localStorage (passwords are
salted + PBKDF2-hashed), sessions expire after 14 days, failed logins lock for 30s after 5 tries, and the
reset code is shown on screen. Nothing is shared between devices. Before launch, replace the functions in
`lib/auth.tsx` (and `useUserData`) with a real backend/auth provider; the rest of the app uses only `useAuth()`.

## Languages (English / فارسی)
A language switch (EN | فا) sits in the header (and on the login / sign-up pages). The choice is remembered in the
browser and switches the whole site to right-to-left Persian (Vazirmatn font, Persian digits, Jalali dates).
- `lib/i18n.tsx` – provider and `useI18n()` hook (`t`, `n`, `lang`, `dir`).
- `lib/fa.ts` – the Persian dictionary. Keys are the English strings; add a line there for any new UI text and wrap it with `t("…")`.
- Course / project / job / testimonial text in `lib/data.ts` stays English in the data and is translated on display through the same dictionary.
