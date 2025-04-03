"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusIcon, SearchIcon, FilterIcon } from "lucide-react"
import Link from "next/link"

export function ScoresTableFilters() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar puntuaciones..." className="w-full pl-8" />
        </div>
        <Button variant="outline" size="icon" onClick={() => setIsFiltersVisible(!isFiltersVisible)}>
          <FilterIcon className="h-4 w-4" />
          <span className="sr-only">Filtrar</span>
        </Button>
        <Button asChild>
          <Link href="/scores/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Nueva Puntuación
          </Link>
        </Button>
      </div>

      {isFiltersVisible && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Asignatura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="matematicas">Matemáticas</SelectItem>
              <SelectItem value="ciencias">Ciencias</SelectItem>
              <SelectItem value="historia">Historia</SelectItem>
              <SelectItem value="literatura">Literatura</SelectItem>
              <SelectItem value="ingles">Inglés</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="aprobado">Aprobado</SelectItem>
              <SelectItem value="reprobado">Reprobado</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reciente">Más reciente</SelectItem>
              <SelectItem value="antiguo">Más antiguo</SelectItem>
              <SelectItem value="ultima-semana">Última semana</SelectItem>
              <SelectItem value="ultimo-mes">Último mes</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

