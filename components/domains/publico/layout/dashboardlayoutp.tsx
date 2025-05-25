"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DesktopNav } from "./desktopnav"
import { MobileNav } from "./mobilenav"
import { SearchInput } from "./search"
import { User } from "./user"
import Providers from "./providers"
import { authFetch } from "@/utils/authFetch"

const allowedRoles = ["ADMIN", "CLIENT", "MECANICO"]

export const DashboardLayoutPublic = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const res = await authFetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()

          if (allowedRoles.includes(data.role)) {
            setIsAuthorized(true)
          } else {
            router.push("/login")
          }
        } else {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      }
    }

    checkAuthorization()
  }, [router])

  if (!isAuthorized) return null

  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
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
