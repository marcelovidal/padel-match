import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrophyIcon, UsersIcon, StarIcon, CalendarIcon } from "lucide-react"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = createClient()

  // Obtener estadísticas del jugador
  const { data: player } = await supabase.from("players").select("*").eq("id", userId).single()

  // Obtener total de partidos jugados
  const { count: totalMatches } = await supabase
    .from("match_players")
    .select("*", { count: "exact", head: true })
    .eq("player_id", userId)
    .eq("status", "confirmed")

  // Obtener próximos partidos
  const { count: upcomingMatches } = await supabase
    .from("match_players")
    .select(
      `
      *,
      matches!inner(*)
    `,
      { count: "exact", head: true },
    )
    .eq("player_id", userId)
    .eq("status", "confirmed")
    .gte("matches.match_date", new Date().toISOString().split("T")[0])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Partidos Jugados</CardTitle>
          <TrophyIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMatches || 0}</div>
          <p className="text-xs text-muted-foreground">
            {player?.wins || 0} victorias / {player?.losses || 0} derrotas
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Próximos Partidos</CardTitle>
          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{upcomingMatches || 0}</div>
          <p className="text-xs text-muted-foreground">Partidos confirmados</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valoración Media</CardTitle>
          <StarIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{player?.average_rating.toFixed(1) || "0.0"}</div>
          <p className="text-xs text-muted-foreground">De 5 estrellas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categoría</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{player?.category || "-"}</div>
          <p className="text-xs text-muted-foreground">
            Posición: {player?.position === "drive" ? "Drive" : player?.position === "reves" ? "Revés" : "Ambas"}
          </p>
        </CardContent>
      </Card>
    </>
  )
}

