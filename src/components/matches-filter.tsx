"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, FilterIcon, XIcon } from "lucide-react"

export function MatchesFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [level, setLevel] = useState(searchParams.get("level") || "")
  const [date, setDate] = useState<Date | undefined>(
    searchParams.get("date") ? new Date(searchParams.get("date") as string) : undefined,
  )
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  // Actualizar la URL cuando cambien los filtros
  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    if (level) {
      params.set("level", level)
    } else {
      params.delete("level")
    }

    if (date) {
      params.set("date", format(date, "yyyy-MM-dd"))
    } else {
      params.delete("date")
    }

    if (status && status !== "all") {
      params.set("status", status)
    } else {
      params.delete("status")
    }

    router.push(`${pathname}?${params.toString()}`)
  }, [level, date, status, pathname, router, searchParams])

  // Limpiar todos los filtros
  const clearFilters = () => {
    setLevel("")
    setDate(undefined)
    setStatus("all")
  }

  // Verificar si hay filtros activos
  const hasActiveFilters = level || date || status !== "all"

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <Tabs defaultValue={status} value={status} onValueChange={setStatus} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="my">Mis Partidos</TabsTrigger>
              <TabsTrigger value="available">Disponibles</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={() => setIsFiltersVisible(!isFiltersVisible)} className="mr-2">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filtros
              {hasActiveFilters && <span className="ml-1 rounded-full bg-primary w-2 h-2" />}
            </Button>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <XIcon className="h-4 w-4 mr-2" />
                Limpiar
              </Button>
            )}
          </div>
        </div>

        {isFiltersVisible && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
            <div>
              <label className="text-sm font-medium mb-1 block">Nivel</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los niveles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los niveles</SelectItem>
                  <SelectItem value="clasico">Clásico</SelectItem>
                  <SelectItem value="alto">Alto</SelectItem>
                  <SelectItem value="medio">Medio</SelectItem>
                  <SelectItem value="bajo">Bajo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Fecha</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP", { locale: es }) : <span>Cualquier fecha</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                  <div className="p-3 border-t">
                    <Button variant="ghost" size="sm" onClick={() => setDate(undefined)} className="w-full">
                      Limpiar
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

