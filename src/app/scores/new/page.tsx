import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ScoreForm } from "@/components/scores/score-form"

export const metadata: Metadata = {
  title: "Nueva Puntuación | Sistema de Puntuación",
  description: "Añade una nueva puntuación al sistema",
}

export default function NewScorePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Nueva Puntuación" text="Añade una nueva puntuación al sistema." />
      <div className="grid gap-8">
        <ScoreForm />
      </div>
    </DashboardShell>
  )
}

