"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ScoreItem {
  id: string
  name: string
  category: string
  score: number
  date: string
  avatar?: string
}

const recentScores: ScoreItem[] = [
  {
    id: "1",
    name: "Juan Pérez",
    category: "Matemáticas",
    score: 95,
    date: "Hace 2 horas",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "María López",
    category: "Ciencias",
    score: 88,
    date: "Hace 3 horas",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    category: "Historia",
    score: 76,
    date: "Hace 5 horas",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Ana Martínez",
    category: "Literatura",
    score: 92,
    date: "Hace 6 horas",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Pedro Sánchez",
    category: "Inglés",
    score: 85,
    date: "Hace 8 horas",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

interface RecentScoresProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RecentScores({ className, ...props }: RecentScoresProps) {
  return (
    <Card className={cn("col-span-3", className)} {...props}>
      <CardHeader>
        <CardTitle>Puntuaciones Recientes</CardTitle>
        <CardDescription>Las últimas puntuaciones registradas en el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentScores.map((score) => (
            <div key={score.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={score.avatar} alt={score.name} />
                <AvatarFallback>
                  {score.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{score.name}</p>
                <p className="text-sm text-muted-foreground">
                  {score.category} - {score.date}
                </p>
              </div>
              <div className="ml-auto font-medium">
                <Badge variant={score.score >= 90 ? "success" : score.score >= 70 ? "default" : "destructive"}>
                  {score.score}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

