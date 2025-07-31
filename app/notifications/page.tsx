"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setNotifications, markAsRead, markAllAsRead, removeNotification } from "@/store/slices/notificationSlice"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, CheckCircle2, X, Filter, BookMarkedIcon as MarkAsRead } from "lucide-react"

// Demo bildirimler
const demoNotifications = [
  {
    id: "1",
    title: "Yeni görev atandı",
    message: "Size 'Kullanıcı arayüzü tasarımı' görevi atandı",
    type: "info" as const,
    read: false,
    createdAt: "2024-01-20T10:30:00Z",
    userId: "1",
  },
  {
    id: "2",
    title: "Görev tamamlandı",
    message: "Mehmet Demir 'Veritabanı şeması oluşturma' görevini tamamladı",
    type: "success" as const,
    read: false,
    createdAt: "2024-01-20T09:15:00Z",
    userId: "1",
  },
  {
    id: "3",
    title: "Proje güncellendi",
    message: "E-ticaret Platformu projesinde değişiklikler yapıldı",
    type: "info" as const,
    read: true,
    createdAt: "2024-01-19T16:45:00Z",
    userId: "1",
  },
  {
    id: "4",
    title: "Görev gecikti",
    message: "API endpoint geliştirme görevi belirlenen tarihten geç",
    type: "warning" as const,
    read: false,
    createdAt: "2024-01-19T14:20:00Z",
    userId: "1",
  },
  {
    id: "5",
    title: "Yeni takım üyesi",
    message: "Ali Özkan takıma katıldı",
    type: "success" as const,
    read: true,
    createdAt: "2024-01-18T11:00:00Z",
    userId: "1",
  },
]

export default function NotificationsPage() {
  const { notifications, unreadCount } = useSelector((state: RootState) => state.notifications)
  const dispatch = useDispatch()
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    // Demo bildirimlerini yükle
    dispatch(setNotifications(demoNotifications))
  }, [dispatch])

  // Filtrelenmiş bildirimler
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "unread") return !notification.read
    if (filter === "read") return notification.read
    if (filter !== "all" && notification.type !== filter) return false
    return true
  })

  const handleMarkAsRead = (id: string) => {
    dispatch(markAsRead(id))
  }

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead())
  }

  const handleRemoveNotification = (id: string) => {
    dispatch(removeNotification(id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "warning":
        return <Bell className="w-5 h-5 text-orange-600" />
      case "error":
        return <X className="w-5 h-5 text-red-600" />
      default:
        return <Bell className="w-5 h-5 text-blue-600" />
    }
  }

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-100 text-green-800">Başarı</Badge>
      case "warning":
        return <Badge className="bg-orange-100 text-orange-800">Uyarı</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-800">Hata</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Bilgi</Badge>
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bildirimler</h1>
            <p className="text-gray-600 mt-2">
              Tüm bildirimlerinizi görüntüleyin ve yönetin
              {unreadCount > 0 && <span className="ml-2 text-blue-600 font-medium">({unreadCount} okunmamış)</span>}
            </p>
          </div>
          <div className="flex space-x-3">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filtrele" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tüm Bildirimler</SelectItem>
                <SelectItem value="unread">Okunmamış</SelectItem>
                <SelectItem value="read">Okunmuş</SelectItem>
                <SelectItem value="info">Bilgi</SelectItem>
                <SelectItem value="success">Başarı</SelectItem>
                <SelectItem value="warning">Uyarı</SelectItem>
                <SelectItem value="error">Hata</SelectItem>
              </SelectContent>
            </Select>
            {unreadCount > 0 && (
              <Button onClick={handleMarkAllAsRead} variant="outline">
                <MarkAsRead className="w-4 h-4 mr-2" />
                Tümünü Okundu İşaretle
              </Button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`transition-all hover:shadow-md ${
                  !notification.read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {getNotificationBadge(notification.type)}
                          {!notification.read && (
                            <Badge variant="destructive" className="text-xs">
                              Yeni
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{notification.message}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span>{new Date(notification.createdAt).toLocaleString("tr-TR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveNotification(notification.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Bildirim bulunamadı</h3>
                <p className="text-gray-600">
                  {filter === "all" ? "Henüz hiç bildiriminiz yok." : `Seçili filtreye uygun bildirim bulunamadı.`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Stats */}
        {notifications.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Toplam</p>
                    <p className="text-2xl font-bold">{notifications.length}</p>
                  </div>
                  <Bell className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Okunmamış</p>
                    <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                  </div>
                  <Bell className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Başarı</p>
                    <p className="text-2xl font-bold text-green-600">
                      {notifications.filter((n) => n.type === "success").length}
                    </p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Uyarı</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {notifications.filter((n) => n.type === "warning").length}
                    </p>
                  </div>
                  <Bell className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
