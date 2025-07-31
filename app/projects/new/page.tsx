"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { addProject } from "@/store/slices/projectSlice"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Plus, Users } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  name: string
  role: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const { user, token } = useSelector((state: RootState) => state.auth)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "0", // "Aktif" default olarak seçili (0)
    members: [] as string[],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [teamMembers, setTeamMembers] = useState<User[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)
  const [membersError, setMembersError] = useState("")

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return

      setLoadingMembers(true)
      setMembersError("")

      try {
        const res = await fetch("https://localhost:7016/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (!res.ok) throw new Error("Kullanıcılar yüklenemedi.")
        const data = await res.json()
        setTeamMembers(data)
      } catch (err: any) {
        setMembersError(err.message || "Kullanıcılar yüklenirken hata oluştu.")
      } finally {
        setLoadingMembers(false)
      }
    }

    fetchUsers()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!formData.title.trim()) {
      setError("Proje başlığı zorunludur.")
      setIsLoading(false)
      return
    }

    if (!formData.description.trim()) {
      setError("Proje açıklaması zorunludur.")
      setIsLoading(false)
      return
    }

    try {
      const res = await fetch("https://localhost:7016/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.title,
          description: formData.description,
          memberIds: formData.members,
          status: parseInt(formData.status), // ✅ Enum'a uygun sayıya dönüştürüldü
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Proje oluşturulamadı.")
      }

      const createdProject = await res.json()
      dispatch(addProject(createdProject))
      router.push(`/projects/${createdProject.id}`)
    } catch (err: any) {
      setError(err.message || "Beklenmeyen bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMemberToggle = (memberId: string) => {
    setFormData((prev) => ({
      ...prev,
      members: prev.members.includes(memberId)
        ? prev.members.filter((id) => id !== memberId)
        : [...prev.members, memberId],
    }))
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/projects" className="hover:text-blue-600 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Projeler
          </Link>
          <span>/</span>
          <span className="text-gray-900">Yeni Proje</span>
        </div>

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Yeni Proje Oluştur</h1>
          <p className="text-gray-600 mt-2">
            Takımınız için yeni bir proje oluşturun ve üyeleri atayın
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Proje Bilgileri
            </CardTitle>
            <CardDescription>Projenizin temel bilgilerini girin</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Proje Başlığı *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="Proje başlığını girin"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Proje Açıklaması *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Proje hakkında detaylı açıklama yazın"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Proje Durumu</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Durum seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Aktif</SelectItem>
                    <SelectItem value="1">Tamamlandı</SelectItem>
                    <SelectItem value="2">Arşivlendi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Takım Üyeleri
                </Label>

                {loadingMembers && <p>Kullanıcılar yükleniyor...</p>}
                {membersError && <p className="text-red-600">{membersError}</p>}

                <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                      </div>
                      <Button
                        type="button"
                        variant={
                          formData.members.includes(member.id)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleMemberToggle(member.id)}
                      >
                        {formData.members.includes(member.id) ? "Seçili" : "Seç"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? "Oluşturuluyor..." : "Proje Oluştur"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
