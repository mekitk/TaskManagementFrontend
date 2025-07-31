"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/store/store"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { LayoutDashboard, FolderOpen, CheckSquare, Users, Settings, Bell, BarChart3, CheckCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projeler",
    url: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Görevler",
    url: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "Takım",
    url: "/team",
    icon: Users,
    adminOnly: true,
  },
  {
    title: "Raporlar",
    url: "/reports",
    icon: BarChart3,
    managerOnly: true,
  },
  {
    title: "Bildirimler",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Ayarlar",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const { user } = useSelector((state: RootState) => state.auth)
  const { unreadCount } = useSelector((state: RootState) => state.notifications)
  const pathname = usePathname()

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.adminOnly && user?.role !== "admin") return false
    if (item.managerOnly && !["admin", "manager"].includes(user?.role || "")) return false
    console.log("Kullanıcının rolü:", user?.role)

    return true
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800"
      case "manager":
        return "bg-blue-100 text-blue-800"
      case "developer":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRoleText = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "Admin"
      case "manager":
        return "Manager"
      case "developer":
        return "Developer"
      default:
        return "Kullanıcı"
    }
  }

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">TaskFlow</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url} className="flex items-center">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                      {item.title === "Bildirimler" && unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {unreadCount}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar || "/cloud-computing.png"} alt={user?.name} />
            <AvatarFallback>
              {user?.name
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <div className="flex items-center space-x-2">
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              
              <Badge className={`text-xs ${getRoleBadgeColor(user?.role || "")}`}>
                {getRoleText(user?.role || "")}
              </Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
