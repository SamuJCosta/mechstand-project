"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { authFetch } from "@/utils/authFetch"
import Providers from "./providers"
import { MobileNav } from "./mobilenav"
import { SearchInput } from "./search"
import { User } from "./user"

import { DesktopNav as DesktopNavMecanico } from "@/components/domains/mecanico/layout/desktopnav"
import { DesktopNav as DesktopNavAdmin } from "@/components/domains/admin/layout/desktopnav"
import { DesktopNav as DesktopNavCliente } from "@/components/domains/cliente/layout/desktopnav"

const allowedRoles = ["ADMIN", "CLIENT", "MECANICO"]

export const DashboardLayoutPublic = ({ children }: { children: React.ReactNode }) => {
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const res = await authFetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          if (allowedRoles.includes(data.role)) {
            setUserRole(data.role)
          } else {
            router.push("/login")
          }
        } else {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuthorization()
  }, [router])

  if (loading || !userRole) return null

  const renderSidebar = () => {
    switch (userRole) {
      case "MECANICO":
        return <DesktopNavMecanico />
      case "ADMIN":
        return <DesktopNavAdmin />
      case "CLIENT":
        return <DesktopNavCliente />
      default:
        return null
    }
  }

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        {renderSidebar()}
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <SearchInput />
            <User />
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4 bg-muted/40">
            {children}
          </main>
        </div>
      </main>
    </Providers>
  )
}
