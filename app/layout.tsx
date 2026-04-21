import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Oswald, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/lib/auth/auth-provider"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _oswald = Oswald({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
}

export const metadata: Metadata = {
  title: "Hergert Fitness | Személyi Edzés & Online Coaching",
  description:
    "Személyre szabott edzéstervek, étrendtervezés és folyamatos támogatás. Online coaching és személyi edzés egy helyen.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hu">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
