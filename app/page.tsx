"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, Zap, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    if (loading) return // Eğer auth durumun yükleniyorsa bekle
    if (isAuthenticated) {
      router.replace("/dashboard")
    } else {
      setIsCheckingAuth(false) // Yönlendirme yok, içerik gösterilebilir
    }
  }, [isAuthenticated, loading, router])

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Yükleniyor...</p>
      </div>
    )
  }

  const features = [
    {
      icon: CheckCircle,
      title: "Görev Yönetimi",
      description: "Görevlerinizi kolayca oluşturun, düzenleyin ve takip edin.",
    },
    {
      icon: Users,
      title: "Takım İşbirliği",
      description: "Takım üyelerinizle etkili bir şekilde işbirliği yapın.",
    },
    {
      icon: Zap,
      title: "Gerçek Zamanlı",
      description: "Anlık bildirimler ve güncellemeler alın.",
    },
    {
      icon: Shield,
      title: "Rol Tabanlı Yetki",
      description: "Admin, Manager ve Developer rolleri ile güvenli erişim.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Giriş Yap</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Kayıt Ol</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Görev Yönetimini
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Yeniden Tanımlayın
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Modern, güçlü ve kullanıcı dostu görev yönetim sistemi ile takımınızın verimliliğini artırın.
          </p>
          <div className="space-x-4">
            <Link href="/auth/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Hemen Başlayın
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Giriş Yap
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Güçlü Özellikler</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">TaskFlow ile görev yönetiminde yeni bir deneyim yaşayın.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Takımınızla Daha Verimli Çalışmaya Hazır mısınız?</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Hemen kayıt olun ve görev yönetiminde yeni bir deneyim yaşayın.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary">
              Ücretsiz Başlayın
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold">TaskFlow</span>
          </div>
          <p className="text-gray-400">© 2024 TaskFlow. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
