import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"

interface PlayerSuggestionsProps {
  userId: string
}

export async function PlayerSuggestions({ userId }: PlayerSuggestionsProps) {
  const supabase = createClient()

  // Obtener información del jugador actual
  const { data: currentPlayer } = await supabase.from("players").select("*").eq("id", userId).single()

  // Obtener jugadores sugeridos basados en la categoría y posición
  const { data: suggestedPlayers } = await supabase
    .from("players")
    .select(`
      *,
      profiles:profiles(
        id,
        full_name,
        avatar_url
      )
    `)
    .neq("id", userId)
    .eq("category", currentPlayer?.category)
    .order("average_rating", { ascending: false })
    .limit(5)

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Jugadores Sugeridos</CardTitle>
        <CardDescription>Jugadores de tu nivel que podrían interesarte</CardDescription>
      </CardHeader>
      <CardContent>
        {suggestedPlayers && suggestedPlayers.length > 0 ? (
          <div className="space-y-4">
            {suggestedPlayers.map((player) => (
              <div key={player.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={player.profiles.avatar_url || ""} alt={player.profiles.full_name} />
                    <AvatarFallback>
                      {player.profiles.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{player.profiles.full_name}</p>
                    <div className="flex items-center space-x-2">
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
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/players/${player.id}`}>Ver</Link>
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <h3 className="text-lg font-medium">No hay sugerencias disponibles</h3>
            <p className="text-sm text-muted-foreground mt-1">Completa tu perfil para recibir sugerencias</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

