"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setProjects, updateProject } from "@/store/slices/projectSlice"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Search, Filter, Users, Calendar, CheckCircle2, Edit, X, Save, UserPlus } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface ProjectUpdateDto {
  Name: string
  Description: string
  MemberIds: string[]
}

// User interface, backend'den gelen 'Name' propertysine göre ayarlandı
interface User {
  Id: string
  Name: string // Backend'den gelen veriyle eşleşiyor
  Role: string
  Email: string
}

interface Project {
  id: string
  title: string
  description: string
  members: string[]
  status: "active" | "completed" | "archived"
  updatedAt: string
  createdBy: string
  createdAt: string
  tasksCount: number
}

function ProjectsPageContent() {
  const { projects } = useSelector((state: RootState) => state.projects)
  const { user, token } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const projectsPerPage = 6
  const [isLoading, setIsLoading] = useState(false)

  // Users state
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)

  // Edit mode states
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    memberIds: [] as string[],
  })
  const [isUpdating, setIsUpdating] = useState(false)

  // Helper function to generate a simple data URL for Avatar placeholder
  const getAvatarPlaceholder = (name: string | undefined): string => {
    const initial = name && name.length > 0 ? name.charAt(0).toUpperCase() : "U" // Boş string kontrolü eklendi
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e0e7ff'/%3E%3Ctext x='50' y='60' font-size='40' fill='%234338ca' text-anchor='middle' alignment-baseline='middle'%3E${initial}%3C/text%3E%3C/svg%3E`
  }

  // --- API: Kullanıcıları getir ---
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true)
      const res = await fetch("https://localhost:7016/users", {
        headers: { Authorization: `Bearer ${token || ""}` },
      })
      if (!res.ok) {
        // Hata durumunda response body'sini oku
        const errorText = await res.text();
        throw new Error(`Kullanıcılar alınamadı: ${res.status} ${res.statusText} - ${errorText}`);
      }
      const data = await res.json();
      // Gelen datayı direkt User[] tipine atayabiliriz çünkü backend'den 'Name' geliyor.
      setAllUsers(data as User[]);
      console.log("Fetched users:", data); // Debug için log eklendi
    } catch (error) {
      console.error("Kullanıcıları getirirken hata oluştu:", error);
      // Hata durumunda boş array ile set etmek, UI'ın boş göstermesini sağlar
      setAllUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }

  // --- API: Projeleri getir ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setIsLoading(true)
        const res = await fetch("https://localhost:7016/projects", {
          headers: { Authorization: `Bearer ${token || ""}` },
        })
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Projeler alınamadı: ${res.status} ${res.statusText} - ${errorText}`);
        }
        const data = await res.json()
        const transformed = data.map((p: any) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          members: Array.isArray(p.memberIds) ? p.memberIds : [],
          status: mapStatus(p.status),
          updatedAt: p.updatedAt ?? new Date().toISOString(),
          createdBy: p.createdBy ?? "unknown",
          createdAt: p.createdAt ?? new Date().toISOString(),
          tasksCount: p.tasksCount ?? 0,
        }))
        dispatch(setProjects(transformed))
        console.log("Fetched projects:", transformed); // Debug için log eklendi
      } catch (err) {
        console.error("Projeleri getirirken hata oluştu:", err)
        dispatch(setProjects([])) // Clear projects on error
      } finally {
        setIsLoading(false)
      }
    }

    // Her iki fetch işlemi de sayfa yüklendiğinde çalışmalı
    fetchProjects()
    fetchUsers()
  }, [dispatch, token]) // token dependency added for both fetches

  const mapStatus = (status: number | string): "active" | "completed" | "archived" => {
    switch (status) {
      case 0:
      case "active":
        return "active"
      case 1:
      case "completed":
        return "completed"
      case 2:
      case "archived":
        return "archived"
      default:
        return "active"
    }
  }

  // --- Modal açıldığında formu setle ---
  const handleProjectClick = (project: Project) => {
    setEditingProject(project)
    setEditForm({
      name: project.title,
      description: project.description,
      memberIds: project.members, // Projenin mevcut üye ID'leri formu başlatırken set ediliyor
    })
    console.log("Editing project:", project);
    console.log("Edit form members on click:", project.members);
  }

  const handleCancelEdit = () => {
    setEditingProject(null)
    setEditForm({ name: "", description: "", memberIds: [] })
  }

  // Üye ekleme çıkarma
  const handleMemberToggle = (userId: string, add: boolean) => {
    setEditForm((f) => {
      const newMemberIds = add
        ? [...f.memberIds, userId]
        : f.memberIds.filter((id) => id !== userId);
      console.log("New member IDs after toggle:", newMemberIds); // Debug
      return { ...f, memberIds: newMemberIds };
    });
  }

  // Proje güncelle API çağrısı
  const handleUpdateProject = async () => {
    if (!editingProject || !token) return
    setIsUpdating(true)

    const updateDto: ProjectUpdateDto = {
      Name: editForm.name,
      Description: editForm.description,
      MemberIds: editForm.memberIds,
    }

    try {
      const res = await fetch(`https://localhost:7016/projects/${editingProject.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateDto),
      })
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Güncelleme başarısız: ${res.status} ${res.statusText} - ${errorText}`);
      }

      const updated = await res.json()

      // Redux güncelle
      dispatch(
        updateProject({
          ...editingProject,
          title: updated.name,
          description: updated.description,
          members: updated.memberIds || [], // Güncellenen üyeleri backend'den al
          updatedAt: new Date().toISOString(),
        }),
      )
      handleCancelEdit()
    } catch (error) {
      console.error("Proje güncellenirken hata oluştu:", error)
      alert("Proje güncellenirken hata oluştu. Detaylar için konsolu kontrol edin.");
    } finally {
      setIsUpdating(false)
    }
  }

  // Modal’da gösterilecek kullanıcılar:
  // Mevcut üyeler
  const getCurrentMembers = (): User[] => {
    // allUsers'ın dolu olduğundan emin olun
    if (allUsers.length === 0) return [];

    const members = editForm.memberIds
      .map((id) => allUsers.find((u) => u.Id === id))
      .filter((u): u is User => u !== undefined); // Sadece tanımlı (bulunan) üyeleri filtrele
      
    // console.log("Current members (IDs in form):", editForm.memberIds); // Debug
    // console.log("Current members (resolved objects):", members); // Debug
    return members;
  }

  // Eklenebilir kullanıcılar
  const getAvailableUsers = (): User[] => {
    if (allUsers.length === 0) return []; // allUsers boşsa, döndürme
    
    const available = allUsers.filter((u) => !editForm.memberIds.includes(u.Id));
    // console.log("Available users (resolved objects):", available); // Debug
    return available;
  }

  // Filtre ve sayfalama
  const filteredProjects = projects.filter((p) => {
    const term = searchTerm.toLowerCase()
    return (
      (p.title.toLowerCase().includes(term) || p.description.toLowerCase().includes(term)) &&
      (statusFilter === "all" || p.status === statusFilter)
    )
  })
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage)
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * projectsPerPage, currentPage * projectsPerPage)

  // Rol kontrolü
  const canCreateProject = user?.role?.toLowerCase() === "admin"

  const canEditProject = canCreateProject

  // Status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">Tamamlandı</Badge>
      case "archived":
        return <Badge variant="secondary">Arşivlendi</Badge>
      default:
        return <Badge variant="outline">Bilinmiyor</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projeler</h1>
            <p className="text-gray-600 mt-2">Tüm projelerinizi görüntüleyin ve yönetin</p>
          </div>
          <div>
            {canCreateProject && (
              <Link href="/projects/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Proje
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="flex gap-4 flex-col sm:flex-row p-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 border rounded w-full sm:w-48"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Aktif</option>
              <option value="completed">Tamamlandı</option>
              <option value="archived">Arşivlendi</option>
            </select>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedProjects.map((project) => (
            <Card
              key={project.id}
              className={`cursor-pointer hover:shadow-lg transition-all ${
                editingProject?.id === project.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => (canEditProject ? handleProjectClick(project) : undefined)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2 flex items-center gap-2">
                    {project.title}
                    {canEditProject && <Edit className="w-4 h-4 text-gray-400" />}
                  </CardTitle>
                  {getStatusBadge(project.status)}
                </div>
                <CardDescription className="mt-2 line-clamp-3">{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    {project.tasksCount} görev
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {project.members.length} üye
                  </div>
                </div>
                <div className="flex -space-x-2 items-center">
                  {/* Proje kartındaki avatarlar */}
                  {project.members.slice(0, 3).map((memberId) => {
                    const member = allUsers.find((u) => u.Id === memberId)
                    return (
                      <Avatar key={memberId} className="w-6 h-6 border-2 border-white">
                        <AvatarImage src={getAvatarPlaceholder(member?.Name)} />
                        {/* Baş harfi göster: member?.Name boşsa "U" */}
                        <AvatarFallback className="text-xs">{member?.Name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    )
                  })}
                  {project.members.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Güncellendi: {new Date(project.updatedAt).toLocaleDateString("tr-TR")}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Projeler yükleniyor...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProjects.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Proje bulunamadı</h3>
              <p className="text-gray-600 mb-4">Arama kriterlerinize uygun proje bulunamadı.</p>
              {canCreateProject && (
                <Link href="/projects/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Projenizi Oluşturun
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}

        {/* --- Modal: Proje Düzenleme --- */}
        {editingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50 overflow-auto">
            <div className="bg-white rounded-md shadow-lg max-w-3xl w-full mx-4 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-blue-900">Proje Düzenle</h2>
                <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="project-name" className="block font-medium mb-1">
                    Proje Adı
                  </label>
                  <Input
                    id="project-name"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Proje adını girin..."
                  />
                </div>

                <div>
                  <label htmlFor="project-desc" className="block font-medium mb-1">
                    Açıklama
                  </label>
                  <textarea
                    id="project-desc"
                    rows={3}
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Proje açıklamasını girin..."
                    className="w-full border rounded p-2"
                  />
                </div>

                {/* Mevcut Üyeler */}
                <div>
                  <h3 className="font-semibold mb-2">
                    Mevcut Üyeler ({getCurrentMembers().length})
                  </h3>
                  {/* Mevcut üyeler listesi için ScrollArea veya overflow-y-auto */}
                  {/* Burada ScrollArea kullanmak yerine basit overflow-y-auto yeterli olabilir */}
                  <div className="space-y-2 max-h-48 overflow-y-auto border rounded p-2 bg-gray-50">
                    {/* Yükleniyor durumunu göstermek için koşul eklendi */}
                    {isLoadingUsers && allUsers.length === 0 ? (
                      <p className="italic text-gray-500 text-sm">Üyeler yükleniyor...</p>
                    ) : getCurrentMembers().length === 0 ? (
                      <p className="italic text-gray-500 text-sm">Henüz üye eklenmemiş</p>
                    ) : (
                      getCurrentMembers().map((member) => (
                        <div
                          key={member.Id}
                          className="flex items-center justify-between bg-white rounded-md border p-2"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={getAvatarPlaceholder(member?.Name)} />
                              <AvatarFallback className="text-xs">{member?.Name?.charAt(0) || "U"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{member.Name}</p> {/* Name kullanıldı */}
                              <p className="text-xs text-gray-500">
                                {member.Role} • {member.Email}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleMemberToggle(member.Id, false)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Eklenebilir Üyeler */}
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    Eklenebilir Üyeler ({getAvailableUsers().length})
                    {isLoadingUsers && (
                      <span className="text-xs text-gray-500">(Yükleniyor...)</span>
                    )}
                  </h3>
                  {/* Eklenebilir üyeler listesi için ScrollArea */}
                  <ScrollArea className="max-h-48 border rounded p-2 bg-white">
                    {/* Yükleniyor durumunu göstermek için koşul eklendi */}
                    {isLoadingUsers && allUsers.length === 0 ? (
                      <p className="italic text-gray-500 text-sm p-2">Üyeler yükleniyor...</p>
                    ) : getAvailableUsers().length === 0 ? (
                      <p className="italic text-gray-500 text-sm p-2">Eklenebilir üye bulunamadı</p>
                    ) : (
                      getAvailableUsers().map((user) => (
                        <div
                          key={user.Id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                          onClick={() => handleMemberToggle(user.Id, true)}
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={getAvatarPlaceholder(user?.Name)} />
                            <AvatarFallback className="text-xs">{user?.Name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{user.Name}</p> {/* Name kullanıldı */}
                            <p className="text-xs text-gray-500">
                              {user.Role} • {user.Email}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" className="flex-shrink-0">
                            <UserPlus className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </ScrollArea>
                </div>

                {/* Güncelle / İptal Butonları */}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleUpdateProject}
                    disabled={isUpdating || !editForm.name.trim()}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isUpdating ? "Güncelleniyor..." : "Güncelle"}
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    İptal
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default function ProjectsPage() {
  return <ProjectsPageContent />
}