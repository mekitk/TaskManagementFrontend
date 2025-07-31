"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Filter, Users, Mail, MoreHorizontal, Edit, Trash2, UserPlus } from "lucide-react"

// Demo takım üyeleri
const demoTeamMembers = [
  {
    id: "1",
    name: "Ahmet Yılmaz",
    email: "ahmet@taskflow.com",
    role: "manager",
    avatar: "/cloud-computing.png?height=40&width=40",
    status: "active",
    joinDate: "2024-01-01",
    tasksCount: 8,
    projectsCount: 3,
  },
  {
    id: "2",
    name: "Mehmet Demir",
    email: "mehmet@taskflow.com",
    role: "developer",
    avatar: "/cloud-computing.png?height=40&width=40",
    status: "active",
    joinDate: "2024-01-05",
    tasksCount: 12,
    projectsCount: 2,
  },
  {
    id: "3",
    name: "Ayşe Kaya",
    email: "ayse@taskflow.com",
    role: "developer",
    avatar: "/cloud-computing.png?height=40&width=40",
    status: "active",
    joinDate: "2024-01-10",
    tasksCount: 6,
    projectsCount: 2,
  },
  {
    id: "4",
    name: "Ali Özkan",
    email: "ali@taskflow.com",
    role: "developer",
    avatar: "/cloud-computing.png?height=40&width=40",
    status: "inactive",
    joinDate: "2024-01-15",
    tasksCount: 3,
    projectsCount: 1,
  },
]

export default function TeamPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [teamMembers, setTeamMembers] = useState(demoTeamMembers)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  // Filtreleme
  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || member.role === roleFilter
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-100 text-blue-800">Manager</Badge>
      case "developer":
        return <Badge className="bg-green-100 text-green-800">Developer</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "inactive":
        return <Badge variant="secondary">Pasif</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  const canManageTeam = user?.role === "admin"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Takım Yönetimi</h1>
            <p className="text-gray-600 mt-2">Takım üyelerinizi görüntüleyin ve yönetin</p>
          </div>
          {canManageTeam && (
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Üye Ekle
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Toplam Üye</p>
                  <p className="text-2xl font-bold">{teamMembers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Aktif Üye</p>
                  <p className="text-2xl font-bold text-green-600">
                    {teamMembers.filter((m) => m.status === "active").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Developer</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {teamMembers.filter((m) => m.role === "developer").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Manager</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {teamMembers.filter((m) => m.role === "manager").length}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Üye ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Rol filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Roller</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Durum filtrele" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Durumlar</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar || "/cloud-computing.png"} alt={member.name} />
                      <AvatarFallback>
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {member.email}
                      </CardDescription>
                    </div>
                  </div>
                  {canManageTeam && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Kaldır
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Badges */}
                  <div className="flex items-center space-x-2">
                    {getRoleBadge(member.role)}
                    {getStatusBadge(member.status)}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Görevler</p>
                      <p className="font-semibold">{member.tasksCount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Projeler</p>
                      <p className="font-semibold">{member.projectsCount}</p>
                    </div>
                  </div>

                  {/* Join Date */}
                  <div className="text-xs text-gray-500">
                    Katılım: {new Date(member.joinDate).toLocaleDateString("tr-TR")}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Users className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Üye bulunamadı</h3>
              <p className="text-gray-600 mb-4">Arama kriterlerinize uygun üye bulunamadı.</p>
              {canManageTeam && (
                <Button>
                  <UserPlus className="w-4 h-4 mr-2" />
                  İlk Üyeyi Ekleyin
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
