"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/components/domains/admin/layout/user"
import Providers from "./providers"
import { SearchInput } from "./search"
import { authFetch } from "@/utils/authFetch"
import { DesktopNav } from "./desktopnav"
import { MobileNav } from "./mobilenav"
import { useAutoRefreshToken } from "../../../../hooks/useauthrefresh"
import { Toaster } from "react-hot-toast" // 👈 IMPORTA AQUI

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useAutoRefreshToken()

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const res = await authFetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          if (data.role === "CLIENT") {
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
      <Toaster position="top-right" /> {/* 👈 AQUI ESTÁ O TOASTER */}
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
