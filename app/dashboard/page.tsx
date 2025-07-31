"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setProjects } from "@/store/slices/projectSlice"
import { setTasks } from "@/store/slices/taskSlice"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FolderOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react"
import Link from "next/link"
const mapStatus = (statusNumber: number): "active" | "completed" | "archived" => {
  switch (statusNumber) {
    case 0:
      return "active"
    case 1:
      return "completed"
    case 2:
      return "archived"
    default:
      return "active"
  }
}
const mapProjectStatus = (statusNumber: number): "active" | "completed" | "archived" => {
  switch (statusNumber) {
    case 0:
      return "active"
    case 1:
      return "completed"
    case 2:
      return "archived"
    default:
      return "active"
  }
}

const mapTaskStatus = (status: string): "pending" | "in-progress" | "completed" => {
  switch (status) {
    case "pending":
      return "pending"
    case "in-progress":
      return "in-progress"
    case "completed":
      return "completed"
    default:
      return "pending"
  }
}

const mapTaskPriority = (priority: any): "high" | "medium" | "low" => {
  const p = String(priority || "").toLowerCase()

  switch (p) {
    case "high":
      return "high"
    case "medium":
      return "medium"
    case "low":
      return "low"
    default:
      return "low"
  }
}
interface ProjectFromApi {
  id: string
  name: string
  description: string
  memberIds: string[]
  status: "active" | "completed" | string
  // tasksCount API'den gelmiyorsa kaldır veya backend eklensin
  tasksCount?: number
  createdBy:string
  createdAt:string
  updatedAt:string
}

interface TaskFromApi {
  id: string
  title: string
  description: string
  status: "completed" | "in-progress" | "pending" | string
  priority: "high" | "medium" | "low" | string
  assignedTo: string
  assignedToName: string
  projectId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}
interface Project {
  id: string;
  title: string;
  description: string;
  status: "active" | "completed" | "archived";
  members: string[];
  tasksCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}
export interface Task {
  id: string
  title: string
  description: string
  status: "pending" | "in-progress" | "completed"
  priority: "high" | "medium" | "low"
  assignedTo: string
  assignedToName: string
  projectId: string
  createdBy: string
  createdAt: string
  updatedAt: string
  dueDate?: string
}
export default function DashboardPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { projects } = useSelector((state: RootState) => state.projects)
  const { tasks } = useSelector((state: RootState) => state.tasks)
  const dispatch = useDispatch()

  useEffect(() => {
  async function fetchProjects() {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Kullanıcı token'ı bulunamadı. Lütfen giriş yapın.")

      const res = await fetch("https://localhost:7016/projects", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error("Projeler yüklenemedi")

      const data: ProjectFromApi[] = await res.json()

      const projectsWithTasksCount: Project[] = data.map((p: any) => ({
        id: p.id,
        title: p.name,
        description: p.description,
        status: mapStatus(p.status),
        members: p.memberIds,
        tasksCount: p.tasksCount ?? 0,
        createdBy: p.ownerId ?? "unknown",
        createdAt: p.createdAt ?? new Date().toISOString(),
        updatedAt: p.updatedAt ?? new Date().toISOString(),
      }))

      dispatch(setProjects(projectsWithTasksCount))
    } catch (error) {
      console.error("Projeler yüklenirken hata:", error)
    }
  }

  async function fetchTasks() {
  try {
    const token = localStorage.getItem("token")
    if (!token) throw new Error("Token bulunamadı.")

    const res = await fetch("https://localhost:7016/tasks", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) throw new Error("Görevler yüklenemedi")

    const data: TaskFromApi[] = await res.json()

    const tasksMapped: Task[] = data.map(t => ({
  id: t.id,
  title: t.title,
  description: t.description,
  status: mapTaskStatus(t.status),
  priority: mapTaskPriority(t.priority),
  assignedTo: t.assignedTo,
  assignedToName: t.assignedToName,
  projectId: t.projectId,
  createdBy: t.createdBy,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
  dueDate: t.dueDate,
}))

    dispatch(setTasks({
      tasks: tasksMapped,
      totalPages: 1,
    }))
  } catch (error) {
    console.error(error)
  }
}

  fetchProjects()
  fetchTasks()
}, [dispatch])
  // İstatistikler
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "active").length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter((t) => t.status === "completed").length,
    inProgressTasks: tasks.filter((t) => t.status === "in-progress").length,
    pendingTasks: tasks.filter((t) => t.status === "pending").length,
  }

  const completionRate =
    stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hoş geldiniz, {user?.name}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Bugün{" "}
              {new Date().toLocaleDateString("tr-TR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/projects/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Yeni Proje
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
              <FolderOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProjects} aktif proje
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan Görev</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                Toplam {stats.totalTasks} görevden
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devam Eden</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">Aktif görev sayısı</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bekleyen</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingTasks}</div>
              <p className="text-xs text-muted-foreground">Atanmamış görev</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              İlerleme Durumu
            </CardTitle>
            <CardDescription>Genel görev tamamlanma oranınız</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tamamlanma Oranı</span>
                <span className="text-sm text-muted-foreground">
                  {completionRate.toFixed(1)}%
                </span>
              </div>
              <Progress value={completionRate} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{stats.completedTasks} tamamlandı</span>
                <span>{stats.totalTasks - stats.completedTasks} kalan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Projects & Tasks */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Son Projeler
                </CardTitle>
                <Link href="/projects">
                  <Button variant="ghost" size="sm">
                    Tümünü Gör
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.slice(0, 3).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <Link href={`/projects/${project.id}`}>
                        <h4 className="font-medium hover:text-blue-600 transition-colors">
                          {project.title}
                        </h4>
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="w-3 h-3 mr-1" />
                          {(project.members?.length ?? 0)} üye
                        </div>
                        <div className="flex items-center text-xs text-gray-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {project.tasksCount ?? 0} görev
                        </div>
                      </div>
                    </div>
                    <Badge variant={project.status === "active" ? "default" : "secondary"}>
                      {project.status === "active" ? "Aktif" : "Tamamlandı"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center">
        <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
        Son Görevler
      </CardTitle>
      <Link href="/tasks">
        <Button variant="ghost" size="sm">
          Tümünü Gör
        </Button>
      </Link>
    </div>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {tasks.slice(0, 3).map((task) => (
        <div
          key={task.id}
          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="flex-1">
            <Link href={`/tasks/${task.id}`}>
              <h4 className="font-medium hover:text-blue-600 transition-colors">
                {task.title}
              </h4>
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              {task.assignedToName && `Atanan: ${task.assignedToName}`}
            </p>
            <div className="flex items-center mt-2 space-x-4">
              <Badge
                variant={
                  task.priority === "high"
                    ? "destructive"
                    : task.priority === "medium"
                    ? "default"
                    : "secondary"
                }
                className="text-xs"
              >
                {task.priority === "high"
                  ? "Yüksek"
                  : task.priority === "medium"
                  ? "Orta"
                  : "Düşük"}
              </Badge>
              {task.dueDate && (
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(task.dueDate).toLocaleDateString("tr-TR")}
                </div>
              )}
            </div>
          </div>
          <Badge
            variant={
              task.status === "completed"
                ? "default"
                : task.status === "in-progress"
                ? "secondary"
                : "outline"
            }
          >
            {task.status === "completed"
              ? "Tamamlandı"
              : task.status === "in-progress"
              ? "Devam Ediyor"
              : "Bekliyor"}
          </Badge>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
