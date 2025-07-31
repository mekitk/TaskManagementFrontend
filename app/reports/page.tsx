"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BarChart3, TrendingUp, Download, Calendar, Users, CheckCircle2, Clock, AlertCircle } from "lucide-react"

// Demo rapor verileri
const demoReportData = {
  overview: {
    totalProjects: 5,
    activeProjects: 3,
    totalTasks: 24,
    completedTasks: 12,
    inProgressTasks: 8,
    pendingTasks: 4,
    teamMembers: 4,
    completionRate: 50,
  },
  projectStats: [
    {
      id: "1",
      name: "E-ticaret Platformu",
      totalTasks: 12,
      completedTasks: 6,
      completionRate: 50,
      status: "active",
    },
    {
      id: "2",
      name: "Mobil Uygulama",
      totalTasks: 8,
      completedTasks: 4,
      completionRate: 50,
      status: "active",
    },
    {
      id: "3",
      name: "API Geliştirme",
      totalTasks: 4,
      completedTasks: 2,
      completionRate: 50,
      status: "completed",
    },
  ],
  teamPerformance: [
    {
      id: "1",
      name: "Ahmet Yılmaz",
      role: "Manager",
      completedTasks: 5,
      inProgressTasks: 3,
      efficiency: 85,
    },
    {
      id: "2",
      name: "Mehmet Demir",
      role: "Developer",
      completedTasks: 4,
      inProgressTasks: 2,
      efficiency: 78,
    },
    {
      id: "3",
      name: "Ayşe Kaya",
      role: "Developer",
      completedTasks: 3,
      inProgressTasks: 3,
      efficiency: 72,
    },
  ],
}

export default function ReportsPage() {
  const { user } = useSelector((state: RootState) => state.auth)
  const [reportData, setReportData] = useState(demoReportData)
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedProject, setSelectedProject] = useState("all")

  const canViewReports = user?.role === "admin" || user?.role === "manager"

  if (!canViewReports) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Card className="text-center p-8">
            <CardContent>
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Erişim Yetkisi Yok</h3>
              <p className="text-gray-600">Raporları görüntülemek için yeterli yetkiniz bulunmuyor.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Raporlar</h1>
            <p className="text-gray-600 mt-2">Proje ve takım performansını analiz edin</p>
          </div>
          <div className="flex space-x-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-48">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Dönem seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Bu Hafta</SelectItem>
                <SelectItem value="month">Bu Ay</SelectItem>
                <SelectItem value="quarter">Bu Çeyrek</SelectItem>
                <SelectItem value="year">Bu Yıl</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Raporu İndir
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.overview.totalProjects}</div>
              <p className="text-xs text-muted-foreground">{reportData.overview.activeProjects} aktif</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan Görev</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.overview.completedTasks}</div>
              <p className="text-xs text-muted-foreground">Toplam {reportData.overview.totalTasks} görevden</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Devam Eden</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.overview.inProgressTasks}</div>
              <p className="text-xs text-muted-foreground">Aktif görev sayısı</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Takım Üyesi</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.overview.teamMembers}</div>
              <p className="text-xs text-muted-foreground">Aktif üye sayısı</p>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
              Genel İlerleme
            </CardTitle>
            <CardDescription>Tüm projelerdeki genel tamamlanma durumu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Tamamlanma Oranı</span>
                <span className="text-sm text-muted-foreground">{reportData.overview.completionRate}%</span>
              </div>
              <Progress value={reportData.overview.completionRate} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{reportData.overview.completedTasks} tamamlandı</span>
                <span>{reportData.overview.totalTasks - reportData.overview.completedTasks} kalan</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Project Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Proje Performansı</CardTitle>
              <CardDescription>Projelerin tamamlanma durumu</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.projectStats.map((project) => (
                  <div key={project.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{project.name}</span>
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>
                          {project.status === "active" ? "Aktif" : "Tamamlandı"}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">{project.completionRate}%</span>
                    </div>
                    <Progress value={project.completionRate} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{project.completedTasks} tamamlandı</span>
                      <span>{project.totalTasks} toplam</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Takım Performansı</CardTitle>
              <CardDescription>Takım üyelerinin verimlilik oranları</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.teamPerformance.map((member) => (
                  <div key={member.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{member.name}</span>
                        <p className="text-xs text-gray-600">{member.role}</p>
                      </div>
                      <span className="text-sm font-medium">{member.efficiency}%</span>
                    </div>
                    <Progress value={member.efficiency} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{member.completedTasks} tamamlandı</span>
                      <span>{member.inProgressTasks} devam ediyor</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Önemli Bulgular</CardTitle>
            <CardDescription>Bu dönem için öne çıkan veriler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">Başarılar</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    API Geliştirme projesi başarıyla tamamlandı
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Takım verimliliği %15 arttı
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
                    Görev tamamlama süresi %20 azaldı
                  </li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-orange-600">İyileştirme Alanları</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-orange-600" />4 görev belirlenen tarihten geç tamamlandı
                  </li>
                  <li className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-orange-600" />
                    Bazı projelerde kaynak dağılımı dengesiz
                  </li>
                  <li className="flex items-center">
                    <AlertCircle className="w-4 h-4 mr-2 text-orange-600" />
                    Takım iletişimi artırılabilir
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
