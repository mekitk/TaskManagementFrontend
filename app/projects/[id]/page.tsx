"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setCurrentProject } from "@/store/slices/projectSlice"
import { setTasks } from "@/store/slices/taskSlice"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskFilters } from "@/components/tasks/task-filters"
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Plus, Users, Calendar, CheckCircle2, Clock, AlertCircle, Settings, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Demo veriler
const demoProject = {
  id: "1",
  title: "E-ticaret Platformu",
  description:
    "Modern e-ticaret sitesi geliştirme projesi. React ve Node.js kullanılarak geliştirilecek. Kullanıcı dostu arayüz, güvenli ödeme sistemi ve admin paneli içerecek.",
  createdBy: "1",
  createdAt: "2024-01-15",
  updatedAt: "2024-01-20",
  status: "active" as const,
  members: ["1", "2", "3"],
  tasksCount: 12,
}

const demoTasks = [
  {
    id: "1",
    title: "Kullanıcı arayüzü tasarımı",
    description: "Ana sayfa ve ürün sayfası tasarımları oluşturulacak",
    status: "in-progress" as const,
    priority: "high" as const,
    assignedTo: "1",
    assignedToName: "Ahmet Yılmaz",
    projectId: "1",
    createdBy: "1",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    dueDate: "2024-01-25",
  },
  {
    id: "2",
    title: "Veritabanı şeması oluşturma",
    description: "PostgreSQL veritabanı şeması tasarımı ve implementasyonu",
    status: "completed" as const,
    priority: "medium" as const,
    assignedTo: "2",
    assignedToName: "Mehmet Demir",
    projectId: "1",
    createdBy: "1",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-18",
    dueDate: "2024-01-20",
  },
  {
    id: "3",
    title: "API endpoint geliştirme",
    description: "Kullanıcı yönetimi ve ürün yönetimi API endpointleri",
    status: "pending" as const,
    priority: "high" as const,
    assignedTo: "3",
    assignedToName: "Ayşe Kaya",
    projectId: "1",
    createdBy: "2",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-19",
    dueDate: "2024-01-28",
  },
  {
    id: "4",
    title: "Ödeme sistemi entegrasyonu",
    description: "Stripe ve PayPal ödeme sistemleri entegrasyonu",
    status: "pending" as const,
    priority: "medium" as const,
    projectId: "1",
    createdBy: "1",
    createdAt: "2024-01-16",
    updatedAt: "2024-01-16",
    dueDate: "2024-02-05",
  },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.id as string

  const { currentProject } = useSelector((state: RootState) => state.projects)
  const { tasks, filters } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  useEffect(() => {
    // Demo verilerini yükle
    dispatch(setCurrentProject(demoProject))
    dispatch(setTasks({ tasks: demoTasks, totalPages: 1 }))
  }, [dispatch, projectId])

  if (!currentProject) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  // Görev istatistikleri
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "completed").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  }

  const completionRate = taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0

  // Filtrelenmiş görevler
  const filteredTasks = tasks.filter((task) => {
    if (filters.status !== "all" && task.status !== filters.status) return false
    if (filters.priority !== "all" && task.priority !== filters.priority) return false
    if (filters.assignedTo !== "all" && task.assignedTo !== filters.assignedTo) return false
    return true
  })

  const canCreateTask = user?.role === "admin" || user?.role === "manager"
  const canManageProject = user?.role === "admin" || user?.role === "manager"

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link href="/projects" className="hover:text-blue-600 flex items-center">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Projeler
          </Link>
          <span>/</span>
          <span className="text-gray-900">{currentProject.title}</span>
        </div>

        {/* Project Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{currentProject.title}</h1>
              <Badge variant={currentProject.status === "active" ? "default" : "secondary"}>
                {currentProject.status === "active" ? "Aktif" : "Tamamlandı"}
              </Badge>
            </div>
            <p className="text-gray-600 max-w-3xl">{currentProject.description}</p>
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Oluşturuldu: {new Date(currentProject.createdAt).toLocaleDateString("tr-TR")}
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                {currentProject.members.length} takım üyesi
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            {canCreateTask && (
              <Button
                onClick={() => setIsCreateTaskOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Görev
              </Button>
            )}
            {canManageProject && (
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Proje Ayarları
              </Button>
            )}
          </div>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Görev</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devam Eden</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Proje İlerlemesi</CardTitle>
            <CardDescription>Genel görev tamamlanma durumu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tamamlanma Oranı</span>
                <span className="text-sm text-muted-foreground">{completionRate.toFixed(1)}%</span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{taskStats.completed} tamamlandı</span>
                <span>{taskStats.total - taskStats.completed} kalan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Takım Üyeleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {currentProject.members.map((memberId, index) => (
                <div key={memberId} className="flex items-center space-x-2">
                  <Avatar>
                    <AvatarImage src={`/cloud-computing.png?height=40&width=40&query=user${index + 1}`} />
                    <AvatarFallback>U{index + 1}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">Kullanıcı {index + 1}</p>
                    <p className="text-xs text-gray-500">
                      {index === 0 ? "Manager" : index === 1 ? "Developer" : "Designer"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Task Filters */}
        <TaskFilters />

        {/* Tasks */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Görevler ({filteredTasks.length})</h2>

          {filteredTasks.length > 0 ? (
            <div className="grid gap-4">
              {filteredTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Görev bulunamadı</h3>
                <p className="text-gray-600 mb-4">Seçili filtrelere uygun görev bulunamadı.</p>
                {canCreateTask && (
                  <Button onClick={() => setIsCreateTaskOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    İlk Görevi Oluşturun
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Create Task Dialog */}
        <CreateTaskDialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen} projectId={projectId} />
      </div>
    </DashboardLayout>
  )
}
