"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { StarIcon, UserPlusIcon, XIcon, CheckIcon, UserIcon } from "lucide-react"

interface MatchPlayersProps {
  players: any[]
  matchId: string
  isCreator: boolean
  userId: string
  isPastMatch: boolean
}

export function MatchPlayers({ players, matchId, isCreator, userId, isPastMatch }: MatchPlayersProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("confirmed")
  const router = useRouter()
  const supabase = createClient()

  // Filtrar jugadores por estado
  const confirmedPlayers = players.filter((player) => player.status === "confirmed")
  const invitedPlayers = players.filter((player) => player.status === "invited")
  const waitlistPlayers = players.filter((player) => player.status === "waitlist")

  // Función para aceptar una invitación
  const acceptInvitation = async (playerId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("match_players")
        .update({ status: "confirmed", response_at: new Date().toISOString() })
        .eq("match_id", matchId)
        .eq("player_id", playerId)

      if (error) throw error

      toast.success("Invitación aceptada correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al aceptar la invitación")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para rechazar una invitación
  const rejectInvitation = async (playerId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("match_players")
        .update({ status: "rejected", response_at: new Date().toISOString() })
        .eq("match_id", matchId)
        .eq("player_id", playerId)

      if (error) throw error

      toast.success("Invitación rechazada")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al rechazar la invitación")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para asignar equipo y posición a un jugador
  const assignTeamAndPosition = async (playerId: string, team: string, position: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("match_players")
        .update({ team, position })
        .eq("match_id", matchId)
        .eq("player_id", playerId)

      if (error) throw error

      toast.success("Jugador actualizado correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el jugador")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para eliminar un jugador del partido
  const removePlayer = async (playerId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("match_players").delete().eq("match_id", matchId).eq("player_id", playerId)

      if (error) throw error

      toast.success("Jugador eliminado correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el jugador")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para renderizar estrellas según la valoración
  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <StarIcon
          key={i}
          className={`h-3 w-3 ${i < Math.floor(rating) ? "text-yellow-500 fill-yellow-500" : "text-muted-foreground"}`}
        />
      ))
  }

  // Componente para mostrar un jugador
  const PlayerItem = ({ player, showActions = false, showTeamPosition = false }) => {
    const [team, setTeam] = useState(player.team || "")
    const [position, setPosition] = useState(player.position || "")

    return (
      <div className="flex items-center justify-between py-3">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={player.players.avatar_url || ""} alt={player.players.full_name} />
            <AvatarFallback>
              {player.players.full_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{player.players.full_name}</p>
            <div className="flex items-center space-x-2 text-sm">
              {player.players.players && (
                <>
                  <div className="flex">{renderStars(player.players.players.average_rating)}</div>
                  <Badge variant="outline" className="text-xs">
                    {player.players.players.category}ª
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {player.players.players.position === "drive"
                      ? "Drive"
                      : player.players.players.position === "reves"
                        ? "Revés"
                        : "Ambas"}
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        {showTeamPosition && isCreator && !isPastMatch && (
          <div className="flex items-center space-x-2">
            <Select
              value={team}
              onValueChange={(value) => {
                setTeam(value)
                assignTeamAndPosition(player.player_id, value, position)
              }}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Equipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_team">Sin equipo</SelectItem>
                <SelectItem value="team_a">Equipo A</SelectItem>
                <SelectItem value="team_b">Equipo B</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={position}
              onValueChange={(value) => {
                setPosition(value)
                assignTeamAndPosition(player.player_id, team, value)
              }}
            >
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Posición" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no_position">Sin posición</SelectItem>
                <SelectItem value="drive">Drive</SelectItem>
                <SelectItem value="reves">Revés</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showTeamPosition && !isCreator && (
          <div className="flex items-center space-x-2">
            {player.team && (
              <Badge variant={player.team === "team_a" ? "default" : "secondary"}>
                {player.team === "team_a" ? "Equipo A" : "Equipo B"}
              </Badge>
            )}
            {player.position && <Badge variant="outline">{player.position === "drive" ? "Drive" : "Revés"}</Badge>}
          </div>
        )}

        {showActions && (
          <div className="flex items-center space-x-2">
            {player.player_id === userId && player.status === "invited" && (
              <>
                <Button size="sm" onClick={() => acceptInvitation(player.player_id)} disabled={isLoading}>
                  <CheckIcon className="h-4 w-4 mr-1" />
                  Aceptar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => rejectInvitation(player.player_id)}
                  disabled={isLoading}
                >
                  <XIcon className="h-4 w-4 mr-1" />
                  Rechazar
                </Button>
              </>
            )}

            {isCreator && player.player_id !== userId && !isPastMatch && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <XIcon className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Eliminar jugador</DialogTitle>
                    <DialogDescription>
                      ¿Estás seguro de que quieres eliminar a este jugador del partido?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {}}>
                      Cancelar
                    </Button>
                    <Button variant="destructive" onClick={() => removePlayer(player.player_id)} disabled={isLoading}>
                      {isLoading ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Jugadores</CardTitle>
            <CardDescription>Jugadores confirmados e invitados al partido</CardDescription>
          </div>
          {isCreator && !isPastMatch && confirmedPlayers.length < 4 && (
            <Button asChild>
              <a href={`/matches/${matchId}/invite`}>
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Invitar Jugadores
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="confirmed" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="confirmed">Confirmados ({confirmedPlayers.length})</TabsTrigger>
            <TabsTrigger value="invited">Invitados ({invitedPlayers.length})</TabsTrigger>
            <TabsTrigger value="waitlist">En espera ({waitlistPlayers.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="confirmed" className="mt-4">
            {confirmedPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No hay jugadores confirmados</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Los jugadores que acepten la invitación aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {confirmedPlayers.map((player) => (
                  <PlayerItem key={player.id} player={player} showActions={true} showTeamPosition={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="invited" className="mt-4">
            {invitedPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No hay jugadores invitados</h3>
                <p className="text-sm text-muted-foreground mt-1">Los jugadores invitados al partido aparecerán aquí</p>
              </div>
            ) : (
              <div className="divide-y">
                {invitedPlayers.map((player) => (
                  <PlayerItem key={player.id} player={player} showActions={true} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="waitlist" className="mt-4">
            {waitlistPlayers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No hay jugadores en espera</h3>
                <p className="text-sm text-muted-foreground mt-1">Los jugadores en lista de espera aparecerán aquí</p>
              </div>
            ) : (
              <div className="divide-y">
                {waitlistPlayers.map((player) => (
                  <PlayerItem key={player.id} player={player} showActions={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

