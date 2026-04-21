import type React from "react"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <ProtectedRoute>
        <div className="pt-16">{children}</div>
      </ProtectedRoute>
    </main>
  )
}
