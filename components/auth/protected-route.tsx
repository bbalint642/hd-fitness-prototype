"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/auth-provider"
import type { UserRole } from "@/lib/auth/types"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

function dashboardPathFor(role: UserRole): string {
  return role === "coach" ? "/dashboard/coach" : "/dashboard/client"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      router.replace("/login")
      return
    }
    if (requiredRole && user.role !== requiredRole) {
      router.replace(dashboardPathFor(user.role))
    }
  }, [user, isLoading, requiredRole, router])

  const shouldRender =
    !isLoading && user !== null && (!requiredRole || user.role === requiredRole)

  if (!shouldRender) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
