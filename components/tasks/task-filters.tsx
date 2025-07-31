"use client"

import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store/store"
import { setFilters } from "@/store/slices/taskSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

export function TaskFilters() {
  const { filters } = useSelector((state: RootState) => state.tasks)
  const dispatch = useDispatch()

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Görev ara..." className="pl-10" />
          </div>

          <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Durumlar</SelectItem>
              <SelectItem value="pending">Bekliyor</SelectItem>
              <SelectItem value="in-progress">Devam Ediyor</SelectItem>
              <SelectItem value="completed">Tamamlandı</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.priority} onValueChange={(value) => handleFilterChange("priority", value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Öncelik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Öncelikler</SelectItem>
              <SelectItem value="high">Yüksek</SelectItem>
              <SelectItem value="medium">Orta</SelectItem>
              <SelectItem value="low">Düşük</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.assignedTo} onValueChange={(value) => handleFilterChange("assignedTo", value)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Atanan Kişi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm Kişiler</SelectItem>
              <SelectItem value="1">Ahmet Yılmaz</SelectItem>
              <SelectItem value="2">Mehmet Demir</SelectItem>
              <SelectItem value="3">Ayşe Kaya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
