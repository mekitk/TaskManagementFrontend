import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import AuthProviderWrapper from "./auth-provider-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TaskFlow - Görev Yönetim Sistemi",
  description: "Modern görev ve proje yönetim uygulaması",
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <Providers>
          {/* AuthProviderWrapper içi client component */}
          <AuthProviderWrapper>{children}</AuthProviderWrapper>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}