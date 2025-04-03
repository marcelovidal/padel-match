"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { StarIcon, SearchIcon, UserPlusIcon } from "lucide-react"
import { toast } from "sonner"

interface PlayerInviteFormProps {
  matchId: string
  availablePlayers: any[]
}

export function PlayerInviteForm({ matchId, availablePlayers }: PlayerInviteFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClient()

  // Filtrar jugadores según la búsqueda
  const filteredPlayers = availablePlayers.filter((player) =>
    player.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  // Función para seleccionar/deseleccionar un jugador
  const togglePlayerSelection = (playerId: string) => {
    if (selectedPlayers.includes(playerId)) {
      setSelectedPlayers(selectedPlayers.filter((id) => id !== playerId))
    } else {
      setSelectedPlayers([...selectedPlayers, playerId])
    }
  }

  // Función para invitar a los jugadores seleccionados
  const invitePlayers = async () => {
    if (selectedPlayers.length === 0) {
      toast.error("Selecciona al menos un jugador para invitar")
      return
    }

    setIsLoading(true)
    try {
      // Crear array de objetos para insertar
      const playersToInvite = selectedPlayers.map((playerId) => ({
        match_id: matchId,
        player_id: playerId,
        status: "invited",
      }))

      const { error } = await supabase.from("match_players").insert(playersToInvite)

      if (error) throw error

      // Crear notificaciones para los jugadores invitados
      const notifications = selectedPlayers.map((playerId) => ({
        user_id: playerId,
        type: "match_invitation",
        title: "Invitación a partido",
        message: `Has sido invitado a un partido de pádel el ${new Date().toLocaleDateString()}`,
        related_id: matchId,
      }))

      const { error: notificationError } = await supabase.from("notifications").insert(notifications)

      if (notificationError) console.error("Error al crear notificaciones:", notificationError)

      toast.success(`${selectedPlayers.length} jugadores invitados correctamente`)
      router.push(`/matches/${matchId}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al invitar jugadores")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecciona Jugadores</CardTitle>
        <CardDescription>Busca y selecciona los jugadores que quieres invitar al partido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar jugadores..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="border rounded-md">
          {filteredPlayers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <UserPlusIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No hay jugadores disponibles</h3>
              <p className="text-sm text-muted-foreground mt-1">No se encontraron jugadores para invitar</p>
            </div>
          ) : (
            <div className="divide-y">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer"
                  onClick={() => togglePlayerSelection(player.id)}
                >
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedPlayers.includes(player.id)}
                      onCheckedChange={() => togglePlayerSelection(player.id)}
                    />
                    <Avatar>
                      <AvatarImage src={player.profiles.avatar_url || ""} alt={player.profiles.full_name} />
                      <AvatarFallback>
                        {player.profiles.full_name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{player.profiles.full_name}</p>
                      <div className="flex items-center space-x-2 text-sm">
                        <div className="flex">{renderStars(player.average_rating)}</div>
                        <Badge variant="outline" className="text-xs">
                          {player.category}ª
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {player.position === "drive" ? "Drive" : player.position === "reves" ? "Revés" : "Ambas"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancelar
        </Button>
        <Button onClick={invitePlayers} disabled={isLoading || selectedPlayers.length === 0}>
          {isLoading ? "Invitando..." : `Invitar (${selectedPlayers.length})`}
        </Button>
      </CardFooter>
    </Card>
  )
}

