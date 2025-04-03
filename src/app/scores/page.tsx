import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ScoresTable } from "@/components/scores/scores-table"
import { ScoresTableFilters } from "@/components/scores/scores-table-filters"

export const metadata: Metadata = {
  title: "Puntuaciones | Sistema de Puntuación",
  description: "Gestiona todas las puntuaciones del sistema",
}

export default function ScoresPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Puntuaciones"
        text="Gestiona y visualiza todas las puntuaciones registradas en el sistema."
      >
        <ScoresTableFilters />
      </DashboardHeader>
      <ScoresTable />
    </DashboardShell>
  )
}

