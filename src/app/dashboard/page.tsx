import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingMatches } from "@/components/dashboard/upcoming-matches"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { PlayerSuggestions } from "@/components/dashboard/player-suggestions"

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard de PadelMatch",
}

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Obtener próximos partidos del usuario
  const { data: upcomingMatches } = await supabase
    .from("matches")
    .select(`
      *,
      courts:courts(
        id,
        name,
        clubs:clubs(
          id,
          name,
          address
        )
      ),
      match_players!inner(
        id,
        player_id,
        status
      )
    `)
    .eq("match_players.player_id", session.user.id)
    .eq("match_players.status", "confirmed")
    .gte("match_date", new Date().toISOString().split("T")[0])
    .order("match_date", { ascending: true })
    .limit(5)

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-8">Bienvenido, {profile?.full_name}</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <DashboardStats userId={session.user.id} />
      </div>

      <div className="grid gap-6 md:grid-cols-7 lg:grid-cols-12">
        <div className="md:col-span-4 lg:col-span-8">
          <UpcomingMatches matches={upcomingMatches || []} />
          <RecentActivity userId={session.user.id} className="mt-6" />
        </div>
        <div className="md:col-span-3 lg:col-span-4">
          <PlayerSuggestions userId={session.user.id} />
        </div>
      </div>
    </div>
  )
}

