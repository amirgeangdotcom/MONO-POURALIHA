import React from "react"
import type { Metadata } from 'next'
import { Inter, Vazirmatn } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth'
import { I18nProvider } from '@/lib/i18n'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const vazir = Vazirmatn({ subsets: ["arabic", "latin"], variable: '--font-vazir', display: 'swap' });

// Runs before first paint so a saved Persian choice sets lang/dir without a layout jump.
const langScript = `try{var l=localStorage.getItem('mono-lang');if(l==='fa'){document.documentElement.lang='fa';document.documentElement.dir='rtl'}}catch(e){}`;

export const metadata: Metadata = {
  title: 'MONO Freelance School',
  description: 'An online freelancing school for students, trainees, pupils and graduates: courses, real-world projects, portfolio and resume building, and career opportunities.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: langScript }} />
      </head>
      <body className={`${inter.variable} ${vazir.variable} font-sans antialiased`}>
        <I18nProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster position="bottom-right" />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
