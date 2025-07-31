"use client"

import type React from "react"

import { useState } from "react"
import { useDispatch } from "react-redux"
import { addTask } from "@/store/slices/taskSlice"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function CreateTaskDialog({ open, onOpenChange, projectId }: CreateTaskDialogProps) {
  const dispatch = useDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    assignedTo: "1", // Updated default value
    dueDate: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Demo görev oluşturma
      const newTask = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: "pending" as const,
        priority: formData.priority as "low" | "medium" | "high",
        assignedTo: formData.assignedTo || undefined,
        assignedToName: formData.assignedTo ? getAssignedToName(formData.assignedTo) : undefined,
        projectId,
        createdBy: "1", // Demo user ID
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        dueDate: formData.dueDate || undefined,
      }

      dispatch(addTask(newTask))

      // Form'u temizle ve dialog'u kapat
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "1", // Updated default value
        dueDate: "",
      })
      onOpenChange(false)
    } catch (error) {
      console.error("Görev oluşturulurken hata:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getAssignedToName = (userId: string) => {
    const users: Record<string, string> = {
      "1": "Ahmet Yılmaz",
      "2": "Mehmet Demir",
      "3": "Ayşe Kaya",
    }
    return users[userId] || "Bilinmeyen Kullanıcı"
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Yeni Görev Oluştur</DialogTitle>
          <DialogDescription>Proje için yeni bir görev oluşturun ve takım üyelerine atayın.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Görev Başlığı *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Görev başlığını girin"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Görev açıklamasını girin"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Öncelik</Label>
              <Select value={formData.priority} onValueChange={(value) => handleChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Öncelik seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Düşük</SelectItem>
                  <SelectItem value="medium">Orta</SelectItem>
                  <SelectItem value="high">Yüksek</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Atanan Kişi</Label>
              <Select value={formData.assignedTo} onValueChange={(value) => handleChange("assignedTo", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Kişi seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Ahmet Yılmaz</SelectItem>
                  <SelectItem value="2">Mehmet Demir</SelectItem>
                  <SelectItem value="3">Ayşe Kaya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Bitiş Tarihi</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => handleChange("dueDate", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Oluşturuluyor..." : "Görev Oluştur"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
