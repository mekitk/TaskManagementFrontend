"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Clock, Edit, CheckCircle2 } from "lucide-react"

interface TaskHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  taskId: string
}

// Demo görev geçmişi verisi
const demoTaskLogs = [
  {
    id: "1",
    taskId: "1",
    action: "Görev oluşturuldu",
    oldValue: "",
    newValue: "",
    userId: "1",
    userName: "Ahmet Yılmaz",
    timestamp: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    taskId: "1",
    action: "Durum değiştirildi",
    oldValue: "pending",
    newValue: "in-progress",
    userId: "1",
    userName: "Ahmet Yılmaz",
    timestamp: "2024-01-16T14:30:00Z",
  },
  {
    id: "3",
    taskId: "1",
    action: "Açıklama güncellendi",
    oldValue: "Eski açıklama",
    newValue: "Yeni açıklama",
    userId: "2",
    userName: "Mehmet Demir",
    timestamp: "2024-01-18T09:15:00Z",
  },
  {
    id: "4",
    taskId: "1",
    action: "Öncelik değiştirildi",
    oldValue: "medium",
    newValue: "high",
    userId: "1",
    userName: "Ahmet Yılmaz",
    timestamp: "2024-01-19T16:45:00Z",
  },
]

export function TaskHistoryDialog({ open, onOpenChange, taskId }: TaskHistoryDialogProps) {
  const [taskLogs, setTaskLogs] = useState<typeof demoTaskLogs>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open && taskId) {
      setIsLoading(true)
      // Demo verilerini yükle
      setTimeout(() => {
        setTaskLogs(demoTaskLogs.filter((log) => log.taskId === taskId))
        setIsLoading(false)
      }, 500)
    }
  }, [open, taskId])

  const getActionIcon = (action: string) => {
    if (action.includes("oluşturuldu")) return <CheckCircle2 className="w-4 h-4 text-green-600" />
    if (action.includes("değiştirildi") || action.includes("güncellendi"))
      return <Edit className="w-4 h-4 text-blue-600" />
    return <Clock className="w-4 h-4 text-gray-600" />
  }

  const getValueText = (action: string, oldValue: string, newValue: string) => {
    if (action.includes("Durum")) {
      const statusMap: Record<string, string> = {
        pending: "Bekliyor",
        "in-progress": "Devam Ediyor",
        completed: "Tamamlandı",
      }
      return `${statusMap[oldValue] || oldValue} → ${statusMap[newValue] || newValue}`
    }
    if (action.includes("Öncelik")) {
      const priorityMap: Record<string, string> = {
        low: "Düşük",
        medium: "Orta",
        high: "Yüksek",
      }
      return `${priorityMap[oldValue] || oldValue} → ${priorityMap[newValue] || newValue}`
    }
    if (oldValue && newValue) {
      return `"${oldValue}" → "${newValue}"`
    }
    return ""
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Görev Geçmişi
          </DialogTitle>
          <DialogDescription>Bu görevde yapılan tüm değişiklikleri görüntüleyin.</DialogDescription>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : taskLogs.length > 0 ? (
            <div className="space-y-4">
              {taskLogs.map((log, index) => (
                <div key={log.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="flex-shrink-0 mt-1">{getActionIcon(log.action)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={`/cloud-computing.png?height=24&width=24&query=${log.userName}`} />
                        <AvatarFallback className="text-xs">
                          {log.userName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-gray-900">{log.userName}</span>
                      <span className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleString("tr-TR")}</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">{log.action}</p>
                    {log.oldValue && log.newValue && (
                      <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                        {getValueText(log.action, log.oldValue, log.newValue)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Bu görev için henüz geçmiş kaydı bulunmuyor.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
