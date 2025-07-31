"use client"

import React, { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useRouter, usePathname } from "next/navigation"
import { loginSuccess, logout } from "@/store/slices/authSlice"

export default function AuthProviderWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userStr = localStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        dispatch(loginSuccess({ user, token }))
      } catch {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        dispatch(logout())
        router.replace("/auth/login")
        setLoading(false)
        return
      }

      setLoading(false)
      // Login sayfasındaysa dashboarda yönlendir
      if (pathname === "/auth/login") {
        router.replace("/dashboard")
      }
    } else {
      dispatch(logout())
      setLoading(false)
      if (pathname !== "/auth/login") {
        router.replace("/auth/login")
      }
    }
  }, [dispatch, router, pathname])

  if (loading) {
    return <div>Yükleniyor...</div>
  }

  return <>{children}</>
}
