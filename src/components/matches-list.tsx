"use client"

import { useState } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPinIcon, CalendarIcon, ClockIcon, UsersIcon, TrophyIcon } from "lucide-react"

interface MatchesListProps {
  matches: any[]
  userId: string
}

export function MatchesList({ matches, userId }: MatchesListProps) {
  const [view, setView] = useState("grid")

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <TrophyIcon className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium">No hay partidos disponibles</h3>
        <p className="text-muted-foreground mt-2 mb-6">No se encontraron partidos con los filtros seleccionados</p>
        <Button asChild>
          <Link href="/matches/new">Crear un partido</Link>
        </Button>
      </div>
    )
  }

  // Función para obtener el color de la badge según el nivel
  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "clasico":
        return "default"
      case "alto":
        return "destructive"
      case "medio":
        return "secondary"
      case "bajo":
        return "outline"
      default:
        return "default"
    }
  }

  // Función para obtener el texto del nivel
  const getLevelText = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1)
  }

  // Función para obtener el estado del partido para el usuario actual
  const getMatchStatus = (match: any) => {
    if (match.creator_id === userId) {
      return {
        text: "Creador",
        variant: "default" as const,
      }
    }

    const playerInMatch = match.match_players.find((player: any) => player.player_id === userId)

    if (playerInMatch) {
      switch (playerInMatch.status) {
        case "confirmed":
          return {
            text: "Confirmado",
            variant: "success" as const,
          }
        case "invited":
          return {
            text: "Invitado",
            variant: "secondary" as const,
          }
        case "rejected":
          return {
            text: "Rechazado",
            variant: "destructive" as const,
          }
        case "waitlist":
          return {
            text: "En espera",
            variant: "outline" as const,
          }
        default:
          return {
            text: "Desconocido",
            variant: "outline" as const,
          }
      }
    }

    return null
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-muted-foreground">
          {matches.length} {matches.length === 1 ? "partido encontrado" : "partidos encontrados"}
        </div>
        <Tabs defaultValue="grid" value={view} onValueChange={setView}>
          <TabsList>
            <TabsTrigger value="grid">Cuadrícula</TabsTrigger>
            <TabsTrigger value="list">Lista</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <TabsContent value="grid" className="mt-0">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => {
            const matchDate = parseISO(`${match.match_date}T${match.start_time}`)
            const confirmedPlayers = match.match_players.filter((player: any) => player.status === "confirmed")
            const matchStatus = getMatchStatus(match)

            return (
              <Card key={match.id} className="overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge variant={getLevelBadgeVariant(match.level)}>{getLevelText(match.level)}</Badge>
                    {matchStatus && <Badge variant={matchStatus.variant}>{matchStatus.text}</Badge>}
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{format(matchDate, "EEEE d 'de' MMMM", { locale: es })}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {format(parseISO(`2000-01-01T${match.start_time}`), "HH:mm")} -
                        {format(parseISO(`2000-01-01T${match.end_time}`), "HH:mm")}
                      </span>
                    </div>
                    {match.courts && match.courts.clubs && (
                      <div className="flex items-center text-sm">
                        <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span>
                          {match.courts.name}, {match.courts.clubs.name}, {match.courts.clubs.city}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{confirmedPlayers.length} / 4 jugadores confirmados</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex -space-x-2">
                      {confirmedPlayers.slice(0, 4).map((player: any) => (
                        <Avatar key={player.id} className="border-2 border-background">
                          <AvatarImage src={player.players.avatar_url || ""} alt={player.players.full_name} />
                          <AvatarFallback>
                            {player.players.full_name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {confirmedPlayers.length < 4 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                          +{4 - confirmedPlayers.length}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <CardFooter className="bg-muted/50 p-4">
                  <Button asChild className="w-full">
                    <Link href={`/matches/${match.id}`}>Ver detalles</Link>
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      </TabsContent>

      <TabsContent value="list" className="mt-0">
        <div className="space-y-4">
          {matches.map((match) => {
            const matchDate = parseISO(`${match.match_date}T${match.start_time}`)
            const confirmedPlayers = match.match_players.filter((player: any) => player.status === "confirmed")
            const matchStatus = getMatchStatus(match)

            return (
              <Card key={match.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="space-y-3 md:flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getLevelBadgeVariant(match.level)}>{getLevelText(match.level)}</Badge>
                        {matchStatus && <Badge variant={matchStatus.variant}>{matchStatus.text}</Badge>}
                      </div>

                      <div className="grid md:grid-cols-2 gap-2">
                        <div className="flex items-center text-sm">
                          <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{format(matchDate, "EEEE d 'de' MMMM", { locale: es })}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(parseISO(`2000-01-01T${match.start_time}`), "HH:mm")} -
                            {format(parseISO(`2000-01-01T${match.end_time}`), "HH:mm")}
                          </span>
                        </div>
                        {match.courts && match.courts.clubs && (
                          <div className="flex items-center text-sm">
                            <MapPinIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                            <span>
                              {match.courts.name}, {match.courts.clubs.name}, {match.courts.clubs.city}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <UsersIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span>{confirmedPlayers.length} / 4 jugadores confirmados</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 flex items-center space-x-4">
                      <div className="flex -space-x-2">
                        {confirmedPlayers.slice(0, 3).map((player: any) => (
                          <Avatar key={player.id} className="border-2 border-background">
                            <AvatarImage src={player.players.avatar_url || ""} alt={player.players.full_name} />
                            <AvatarFallback>
                              {player.players.full_name
                                .split(" ")
                                .map((n: string) => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {confirmedPlayers.length < 4 && (
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-xs font-medium">
                            +{4 - confirmedPlayers.length}
                          </div>
                        )}
                      </div>

                      <Button asChild>
                        <Link href={`/matches/${match.id}`}>Ver detalles</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </TabsContent>
    </div>
  )
}

