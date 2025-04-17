"use client"

import { useEffect } from "react"

export function useAutoRefreshToken() {
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem("accessToken")
      if (!token) return

      const exp = parseJwt(token)?.exp
      if (!exp) return

      const now = Date.now() / 1000

      
      if (exp - now < 10) {
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) return

        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        })

        if (res.ok) {
          const data = await res.json()
          localStorage.setItem("accessToken", data.accessToken)
          console.log("AccessToken renovado automaticamente.")
        } else {
          console.warn("Falha ao renovar token")
        }
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [])
}

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]))
  } catch (e) {
    return null
  }
}
