"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon, PencilIcon, TrashIcon, EyeIcon } from "lucide-react"
import Link from "next/link"

interface Score {
  id: string
  student: string
  category: string
  score: number
  date: string
  status: "aprobado" | "reprobado" | "pendiente"
}

const scores: Score[] = [
  {
    id: "1",
    student: "Juan Pérez",
    category: "Matemáticas",
    score: 95,
    date: "12/03/2023",
    status: "aprobado",
  },
  {
    id: "2",
    student: "María López",
    category: "Ciencias",
    score: 88,
    date: "15/03/2023",
    status: "aprobado",
  },
  {
    id: "3",
    student: "Carlos Rodríguez",
    category: "Historia",
    score: 45,
    date: "18/03/2023",
    status: "reprobado",
  },
  {
    id: "4",
    student: "Ana Martínez",
    category: "Literatura",
    score: 92,
    date: "20/03/2023",
    status: "aprobado",
  },
  {
    id: "5",
    student: "Pedro Sánchez",
    category: "Inglés",
    score: 65,
    date: "22/03/2023",
    status: "pendiente",
  },
  {
    id: "6",
    student: "Laura González",
    category: "Física",
    score: 78,
    date: "25/03/2023",
    status: "aprobado",
  },
  {
    id: "7",
    student: "Miguel Torres",
    category: "Química",
    score: 35,
    date: "28/03/2023",
    status: "reprobado",
  },
  {
    id: "8",
    student: "Sofía Ramírez",
    category: "Biología",
    score: 89,
    date: "01/04/2023",
    status: "aprobado",
  },
  {
    id: "9",
    student: "Javier Morales",
    category: "Geografía",
    score: 72,
    date: "03/04/2023",
    status: "aprobado",
  },
  {
    id: "10",
    student: "Carmen Vargas",
    category: "Arte",
    score: 95,
    date: "05/04/2023",
    status: "aprobado",
  },
]

export function ScoresTable() {
  const [page, setPage] = useState(1)
  const pageSize = 5
  const totalPages = Math.ceil(scores.length / pageSize)

  const paginatedScores = scores.slice((page - 1) * pageSize, page * pageSize)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estudiante</TableHead>
            <TableHead>Asignatura</TableHead>
            <TableHead>Puntuación</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedScores.map((score) => (
            <TableRow key={score.id}>
              <TableCell className="font-medium">{score.student}</TableCell>
              <TableCell>{score.category}</TableCell>
              <TableCell>{score.score}</TableCell>
              <TableCell>{score.date}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    score.status === "aprobado" ? "success" : score.status === "reprobado" ? "destructive" : "outline"
                  }
                >
                  {score.status.charAt(0).toUpperCase() + score.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Abrir menú</span>
                      <MoreHorizontalIcon className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Link href={`/scores/${score.id}`} className="flex items-center">
                        <EyeIcon className="mr-2 h-4 w-4" />
                        <span>Ver detalles</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href={`/scores/${score.id}`} className="flex items-center">
                        <PencilIcon className="mr-2 h-4 w-4" />
                        <span>Editar</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <TrashIcon className="mr-2 h-4 w-4" />
                      <span>Eliminar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4 px-4">
        <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
          <ChevronLeftIcon className="h-4 w-4" />
        </Button>
        <div className="text-sm text-muted-foreground">
          Página {page} de {totalPages}
        </div>
        <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
          <ChevronRightIcon className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

