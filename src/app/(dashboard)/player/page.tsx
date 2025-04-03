"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, MapPin, Trophy } from "lucide-react"

const stats = [
  {
    title: "Próximos Partidos",
    value: "3",
    icon: Calendar,
    description: "Tienes 3 partidos programados para esta semana"
  },
  {
    title: "Jugadores Conectados",
    value: "12",
    icon: Users,
    description: "12 jugadores están disponibles para jugar"
  },
  {
    title: "Clubes Cercanos",
    value: "5",
    icon: MapPin,
    description: "5 clubes de pádel en tu área"
  },
  {
    title: "Nivel",
    value: "5ª",
    icon: Trophy,
    description: "Tu categoría actual es 5ª"
  }
]

export default function PlayerDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bienvenido a tu panel de control. Aquí podrás gestionar tus partidos y encontrar jugadores.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Próximos Partidos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No tienes partidos programados para hoy.
            </p>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Jugadores Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No hay jugadores disponibles en este momento.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 