"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useDispatch } from "react-redux"
import type { Task } from "@/store/slices/taskSlice"
import { updateTask } from "@/store/slices/taskSlice"

interface EditTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  task: Task
}

export function EditTaskDialog({ open, onOpenChange, task }: EditTaskDialogProps) {
  const dispatch = useDispatch()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUpdate = async () => {
    setIsSubmitting(true)
    const token = localStorage.getItem("token")
    if (!token) return alert("Yetkisiz işlem")

    try {
      const res = await fetch(`https://localhost:7016/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...task,
          title,
          description,
        }),
      })

      if (!res.ok) throw new Error(await res.text())

      const updated = await res.json()
      dispatch(updateTask(updated))
      onOpenChange(false)
    } catch (err) {
      alert("Güncelleme başarısız: " + (err as Error).message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Görev Düzenle</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Başlık" />
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Açıklama" />
          <Button onClick={handleUpdate} disabled={isSubmitting}>
            {isSubmitting ? "Güncelleniyor..." : "Güncelle"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
