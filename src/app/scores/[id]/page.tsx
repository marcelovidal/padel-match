import type { Metadata } from "next"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ScoreForm } from "@/components/scores/score-form"

export const metadata: Metadata = {
  title: "Editar Puntuación | Sistema de Puntuación",
  description: "Edita una puntuación existente en el sistema",
}

export default function EditScorePage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Editar Puntuación" text="Modifica los detalles de una puntuación existente." />
      <div className="grid gap-8">
        <ScoreForm id={params.id} />
      </div>
    </DashboardShell>
  )
}

