"use client"

import { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { updateUser } from "@/store/slices/authSlice"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { User, Bell, Shield, Palette, Save, Upload } from "lucide-react"

export default function SettingsPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskAssignments: true,
    projectUpdates: true,
    teamInvitations: true,
    weeklyReports: false,
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30",
    loginAlerts: true,
  })

  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: "light",
    language: "tr",
    dateFormat: "dd/mm/yyyy",
    timezone: "Europe/Istanbul",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleProfileUpdate = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      // Demo güncelleme
      await new Promise((resolve) => setTimeout(resolve, 1000))

      dispatch(updateUser(profileData))
      setMessage("Profil bilgileriniz başarıyla güncellendi.")
    } catch (error) {
      setMessage("Profil güncellenirken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNotificationUpdate = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      // Demo güncelleme
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Bildirim ayarlarınız başarıyla güncellendi.")
    } catch (error) {
      setMessage("Bildirim ayarları güncellenirken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSecurityUpdate = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      // Demo güncelleme
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Güvenlik ayarlarınız başarıyla güncellendi.")
    } catch (error) {
      setMessage("Güvenlik ayarları güncellenirken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAppearanceUpdate = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      // Demo güncelleme
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Görünüm ayarlarınız başarıyla güncellendi.")
    } catch (error) {
      setMessage("Görünüm ayarları güncellenirken bir hata oluştu.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ayarlar</h1>
          <p className="text-gray-600 mt-2">Hesap ve uygulama ayarlarınızı yönetin</p>
        </div>

        {/* Message */}
        {message && (
          <Alert>
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="w-4 h-4 mr-2" />
              Bildirimler
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Güvenlik
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Görünüm
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profil Bilgileri
                </CardTitle>
                <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={profileData.avatar || "/cloud-computing.png"} alt={profileData.name} />
                    <AvatarFallback className="text-lg">
                      {profileData.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Upload className="w-4 h-4 mr-2" />
                      Fotoğraf Değiştir
                    </Button>
                    <p className="text-xs text-gray-500 mt-1">JPG, PNG veya GIF. Maksimum 2MB.</p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Input id="role" value={user?.role || ""} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate">Katılım Tarihi</Label>
                    <Input id="joinDate" value="15 Ocak 2024" disabled />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileUpdate} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Bildirim Ayarları
                </CardTitle>
                <CardDescription>Hangi bildirimleri almak istediğinizi seçin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">E-posta Bildirimleri</Label>
                      <p className="text-sm text-gray-500">Önemli güncellemeler için e-posta alın</p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="pushNotifications">Push Bildirimleri</Label>
                      <p className="text-sm text-gray-500">Tarayıcı bildirimleri alın</p>
                    </div>
                    <Switch
                      id="pushNotifications"
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="taskAssignments">Görev Atamaları</Label>
                      <p className="text-sm text-gray-500">Size görev atandığında bildirim alın</p>
                    </div>
                    <Switch
                      id="taskAssignments"
                      checked={notificationSettings.taskAssignments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, taskAssignments: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="projectUpdates">Proje Güncellemeleri</Label>
                      <p className="text-sm text-gray-500">Projelerinizde değişiklik olduğunda bildirim alın</p>
                    </div>
                    <Switch
                      id="projectUpdates"
                      checked={notificationSettings.projectUpdates}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, projectUpdates: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="teamInvitations">Takım Davetleri</Label>
                      <p className="text-sm text-gray-500">Takıma davet edildiğinizde bildirim alın</p>
                    </div>
                    <Switch
                      id="teamInvitations"
                      checked={notificationSettings.teamInvitations}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, teamInvitations: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weeklyReports">Haftalık Raporlar</Label>
                      <p className="text-sm text-gray-500">Haftalık ilerleme raporları alın</p>
                    </div>
                    <Switch
                      id="weeklyReports"
                      checked={notificationSettings.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, weeklyReports: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleNotificationUpdate} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Güvenlik Ayarları
                </CardTitle>
                <CardDescription>Hesabınızın güvenliğini artırın</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="twoFactorAuth">İki Faktörlü Kimlik Doğrulama</Label>
                      <p className="text-sm text-gray-500">Hesabınız için ek güvenlik katmanı ekleyin</p>
                    </div>
                    <Switch
                      id="twoFactorAuth"
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) =>
                        setSecuritySettings({ ...securitySettings, twoFactorAuth: checked })
                      }
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Oturum Zaman Aşımı</Label>
                    <Select
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Zaman aşımı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 dakika</SelectItem>
                        <SelectItem value="30">30 dakika</SelectItem>
                        <SelectItem value="60">1 saat</SelectItem>
                        <SelectItem value="240">4 saat</SelectItem>
                        <SelectItem value="480">8 saat</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">Belirtilen süre sonra otomatik çıkış yapılır</p>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="loginAlerts">Giriş Uyarıları</Label>
                      <p className="text-sm text-gray-500">Hesabınıza giriş yapıldığında e-posta alın</p>
                    </div>
                    <Switch
                      id="loginAlerts"
                      checked={securitySettings.loginAlerts}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, loginAlerts: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Şifre Değiştir</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                      <Input id="currentPassword" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Yeni Şifre</Label>
                      <Input id="newPassword" type="password" />
                    </div>
                  </div>
                  <Button variant="outline">Şifreyi Değiştir</Button>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSecurityUpdate} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2" />
                  Görünüm Ayarları
                </CardTitle>
                <CardDescription>Uygulamanın görünümünü kişiselleştirin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Tema</Label>
                    <Select
                      value={appearanceSettings.theme}
                      onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, theme: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tema seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Açık</SelectItem>
                        <SelectItem value="dark">Koyu</SelectItem>
                        <SelectItem value="system">Sistem</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">Dil</Label>
                    <Select
                      value={appearanceSettings.language}
                      onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, language: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Dil seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tr">Türkçe</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Tarih Formatı</Label>
                    <Select
                      value={appearanceSettings.dateFormat}
                      onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, dateFormat: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tarih formatı seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Saat Dilimi</Label>
                    <Select
                      value={appearanceSettings.timezone}
                      onValueChange={(value) => setAppearanceSettings({ ...appearanceSettings, timezone: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Saat dilimi seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Istanbul">İstanbul (UTC+3)</SelectItem>
                        <SelectItem value="Europe/London">Londra (UTC+0)</SelectItem>
                        <SelectItem value="America/New_York">New York (UTC-5)</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo (UTC+9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleAppearanceUpdate} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
