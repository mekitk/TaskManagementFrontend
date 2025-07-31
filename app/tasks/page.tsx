"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { setTasks } from "@/store/slices/taskSlice"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskFilters } from "@/components/tasks/task-filters"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Plus, CheckSquare } from "lucide-react"

export default function TasksPage() {
  const { tasks, filters } = useSelector((state: RootState) => state.tasks)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [projectId, setProjectId] = useState("")
  const [projects, setProjects] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("https://localhost:7016/tasks/gettasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        const data = await res.json()
        dispatch(setTasks({ tasks: data, totalPages: 1 }))
      } catch (err) {
        console.error("Görevler alınamadı:", err)
      }
    }

   const fetchOptions = async () => {
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      console.warn("Token bulunamadı.")
      return
    }

    const [projectsRes, usersRes] = await Promise.all([
      fetch("https://localhost:7016/projects", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      fetch("https://localhost:7016/users", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])

    console.log("Projects status:", projectsRes.status)
    console.log("Users status:", usersRes.status)

    if (!projectsRes.ok || !usersRes.ok) {
      const errText = await Promise.all([projectsRes.text(), usersRes.text()])
      console.error("Projects Hatası:", errText[0])
      console.error("Users Hatası:", errText[1])
      return
    }

    const projectsData = await projectsRes.json()
    const usersData = await usersRes.json()

    console.log("Gelen projeler:", projectsData)
    console.log("Gelen kullanıcılar:", usersData)

    setProjects(projectsData)
    setUsers(usersData)
  } catch (error) {
    console.error("Proje veya kullanıcılar alınamadı:", error)
  }
}


    fetchTasks()
    fetchOptions()
    console.log("TOKEN:", localStorage.getItem("token"))
  }, [dispatch])

  const filteredTasks = tasks.filter((task) => {
    if (filters.status !== "all" && task.status !== filters.status) return false
    if (filters.priority !== "all" && task.priority !== filters.priority) return false
    if (filters.assignedTo !== "all" && task.assignedTo !== filters.assignedTo) return false
    return true
  })

  const stats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter((t) => t.status === "completed").length,
    inProgress: filteredTasks.filter((t) => t.status === "in-progress").length,
    pending: filteredTasks.filter((t) => t.status === "pending").length,
  }

  const canCreateTask =
    user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "manager"

  const handleCreate = async () => {
  const token = localStorage.getItem("token")
  if (!token) {
    alert("Lütfen giriş yapınız.")
    return
  }

  if (!title || !description || !dueDate || !assignedTo || !projectId) {
    alert("Lütfen tüm alanları doldurun.")
    return
  }

  const newTask = {
    title,
    description,
    dueDate,
    status: 0,
    priority: 1,
    assignedTo,
    createdBy: user?.id || "",
    projectId,
  }

  try {
    const res = await fetch("https://localhost:7016/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newTask), // << DÜZENLENEN KISIM
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(error)
    }

    const createdTask = await res.json()

    setIsCreateTaskOpen(false)
    setTitle("")
    setDescription("")
    setDueDate("")
    setAssignedTo("")
    setProjectId("")

    dispatch(setTasks({ tasks: [...tasks, createdTask], totalPages: 1 }))
  } catch (err) {
    alert("Görev oluşturulamadı: " + (err as Error).message)
  }
}

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tüm Görevler</h1>
            <p className="text-muted-foreground mt-2">Tüm projelerdeki görevleri yönet</p>
          </div>
          {canCreateTask && (
            <Button
              onClick={() => setIsCreateTaskOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Yeni Görev
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Toplam" value={stats.total} color="text-black" />
          <StatCard label="Tamamlanan" value={stats.completed} color="text-green-600" />
          <StatCard label="Devam Eden" value={stats.inProgress} color="text-blue-600" />
          <StatCard label="Bekleyen" value={stats.pending} color="text-orange-600" />
        </div>

        <TaskFilters />

        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskCard key={task.id} task={task} />)
          ) : (
            <Card className="text-center p-10">
              <CardContent>
                <p>Görev bulunamadı</p>
              </CardContent>
            </Card>
          )}
        </div>

        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogContent>
            <h2 className="text-xl font-bold mb-4">Yeni Görev</h2>
            <div className="space-y-4">
              <div>
                <Label>Başlık</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>
              <div>
                <Label>Açıklama</Label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} required />
              </div>
              <div>
                <Label>Bitiş Tarihi</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
              </div>
              <div>
                <Label>Proje</Label>
                <select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="w-full border rounded px-2 py-2">
                  <option value="">Proje Seç</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Atanacak Kişi</Label>
                <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full border rounded px-2 py-2">
                  <option value="">Kullanıcı Seç</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <Button className="w-full mt-2" onClick={handleCreate}>
                Oluştur
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
          <CheckSquare className={`h-6 w-6 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )
}
