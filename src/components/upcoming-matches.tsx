"use client"

import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPinIcon, CalendarIcon, ClockIcon, UsersIcon } from "lucide-react"

interface UpcomingMatchesProps {
  matches: any[]
}

export function UpcomingMatches({ matches }: UpcomingMatchesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximos Partidos</CardTitle>
        <CardDescription>Tus partidos confirmados para los próximos días</CardDescription>
      </CardHeader>
      <CardContent>
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <UsersIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No tienes partidos próximos</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">Organiza un partido o únete a uno existente</p>
            <Button asChild>
              <Link href="/matches/new">Crear Partido</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const matchDate = new Date(`${match.match_date}T${match.start_time}`)

              return (
                <div key={match.id} className="flex flex-col space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          match.level === "clasico"
                            ? "default"
                            : match.level === "alto"
                              ? "destructive"
                              : match.level === "medio"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {match.level.charAt(0).toUpperCase() + match.level.slice(1)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(matchDate, { addSuffix: true, locale: es })}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/matches/${match.id}`}>Ver detalles</Link>
                    </Button>
                  </div>
                  <div className="grid gap-1">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>{format(matchDate, "EEEE d 'de' MMMM", { locale: es })}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <ClockIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(new Date(`2000-01-01T${match.start_time}`), "HH:mm")} -
                        {format(new Date(`2000-01-01T${match.end_time}`), "HH:mm")}
                      </span>
                    </div>
                    {match.courts && (
                      <div className="flex items-center text-sm">
                        <MapPinIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>
                          {match.courts.name}, {match.courts.clubs.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

