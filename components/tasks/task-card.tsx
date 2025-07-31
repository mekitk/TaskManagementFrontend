"use client"

import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { updateTask, deleteTask } from "@/store/slices/taskSlice"
import type { Task } from "@/store/slices/taskSlice"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Calendar, MoreHorizontal, Edit, Trash2, User, Clock, CheckCircle2 } from "lucide-react"
import { TaskHistoryDialog } from "./task-history-dialog"
import { EditTaskDialog } from "./edit-task-dialog"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
interface TaskCardProps {
  task: Task
}

export function TaskCard({ task }: TaskCardProps) {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const [showHistory, setShowHistory] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case "high":
        return "Yüksek"
      case "medium":
        return "Orta"
      case "low":
        return "Düşük"
      default:
        return "Bilinmiyor"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Tamamlandı"
      case "in-progress":
        return "Devam Ediyor"
      case "pending":
        return "Bekliyor"
      default:
        return "Bilinmiyor"
    }
  }

  const handleStatusChange = (newStatus: Task["status"]) => {
    const updatedTask = { ...task, status: newStatus, updatedAt: new Date().toISOString() }
    dispatch(updateTask(updatedTask))
  }

  const canEditTask = user?.role === "admin" || user?.role === "manager" || task.createdBy === user?.id
  const canDeleteTask = user?.role === "admin" || task.createdBy === user?.id

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"

 const handleDelete = async () => {
  setIsDeleting(true)
  const token = localStorage.getItem("token")
  if (!token) {
    alert("Lütfen giriş yapınız.")
    setIsDeleting(false)
    return
    
  }

  try {
    const res = await fetch(`https://localhost:7016/tasks/${task.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText)
    }

    dispatch(deleteTask(task.id))
  } catch (error) {
    alert("Görev silinemedi: " + (error as Error).message)
  } finally {
    setIsDeleting(false)
  }
}


  return (
    <>
      <Card className={`task-card-hover ${isOverdue ? "border-red-200 bg-red-50" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" disabled={isDeleting}>
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowHistory(true)}>
                  <Clock className="w-4 h-4 mr-2" />
                  Geçmiş
                </DropdownMenuItem>
                {canEditTask && (
  <DropdownMenuItem onClick={() => setShowEditModal(true)}>
    <Edit className="w-4 h-4 mr-2" />
    Düzenle
  </DropdownMenuItem>
)}
              {canDeleteTask && (
  <DropdownMenuItem
    className="text-red-600"
    onClick={() => setShowDeleteConfirm(true)}
  >
    <Trash2 className="w-4 h-4 mr-2" />
    {isDeleting ? "Siliniyor..." : "Sil"}
  </DropdownMenuItem>
)}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-4">
            {/* Badges */}
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(task.priority)}>{getPriorityText(task.priority)}</Badge>
              <Badge className={getStatusColor(task.status)}>{getStatusText(task.status)}</Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Gecikmiş
                </Badge>
              )}
            </div>

            {/* Assigned User */}
            {task.assignedTo && task.assignedToName && (
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-gray-400" />
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={`/cloud-computing.png?height=24&width=24&query=${task.assignedToName}`} />
                    <AvatarFallback className="text-xs">
                      {task.assignedToName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-gray-600">{task.assignedToName}</span>
                </div>
              </div>
            )}

            {/* Due Date */}
            {task.dueDate && (
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={`text-sm ${isOverdue ? "text-red-600 font-medium" : "text-gray-600"}`}>
                  {new Date(task.dueDate).toLocaleDateString("tr-TR")}
                </span>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 pt-2 border-t">
              {task.status !== "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("completed")}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Tamamla
                </Button>
              )}
              {task.status === "pending" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("in-progress")}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Başla
                </Button>
              )}
              {task.status === "completed" && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleStatusChange("in-progress")}
                  className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Yeniden Aç
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <TaskHistoryDialog open={showHistory} onOpenChange={setShowHistory} taskId={task.id} />
      <EditTaskDialog open={showEditModal} onOpenChange={setShowEditModal} task={task} />

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Görev silinsin mi?</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Görev kalıcı olarak silinecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirm(false)}>Vazgeç</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await handleDelete()
                setShowDeleteConfirm(false)
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "Siliniyor..." : "Evet, sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
