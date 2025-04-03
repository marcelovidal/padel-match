export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Bienvenido a PadelMatch</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Organiza partidos de pádel, encuentra jugadores y gestiona clubes de manera fácil y rápida.
      </p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Organiza Partidos</h2>
          <p className="text-muted-foreground">
            Crea partidos y encuentra jugadores para completar tu equipo.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Encuentra Jugadores</h2>
          <p className="text-muted-foreground">
            Conecta con otros jugadores y forma equipos para tus partidos.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h2 className="text-2xl font-semibold mb-4">Gestiona Clubes</h2>
          <p className="text-muted-foreground">
            Administra tu club de pádel y organiza torneos y eventos.
          </p>
        </div>
      </div>
    </div>
  )
} 