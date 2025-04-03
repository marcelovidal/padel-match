import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, ClockIcon, MapPinIcon, CreditCardIcon, TrophyIcon } from "lucide-react"

interface MatchDetailsProps {
  match: any
  result?: any
}

export function MatchDetails({ match, result }: MatchDetailsProps) {
  const matchDate = parseISO(`${match.match_date}T${match.start_time}`)

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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Detalles del Partido</CardTitle>
            <CardDescription>Información sobre el partido y su ubicación</CardDescription>
          </div>
          <Badge variant={getLevelBadgeVariant(match.level)}>{getLevelText(match.level)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{format(matchDate, "EEEE d 'de' MMMM 'de' yyyy", { locale: es })}</span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span>
                {format(parseISO(`2000-01-01T${match.start_time}`), "HH:mm")} -
                {format(parseISO(`2000-01-01T${match.end_time}`), "HH:mm")}
              </span>
            </div>
            {match.courts && match.courts.clubs && (
              <div className="flex items-center">
                <MapPinIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>
                  {match.courts.name}, {match.courts.clubs.name}, {match.courts.clubs.city}
                </span>
              </div>
            )}
            {match.price_per_player && (
              <div className="flex items-center">
                <CreditCardIcon className="mr-2 h-5 w-5 text-muted-foreground" />
                <span>{match.price_per_player}€ por jugador</span>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium mr-2">Creado por:</span>
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={match.creator.avatar_url || ""} alt={match.creator.full_name} />
                  <AvatarFallback>
                    {match.creator.full_name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span>{match.creator.full_name}</span>
              </div>
            </div>

            {match.notes && (
              <div className="mt-4">
                <span className="text-sm font-medium block mb-1">Notas:</span>
                <p className="text-sm text-muted-foreground">{match.notes}</p>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="border-t pt-4">
            <div className="flex items-center mb-2">
              <TrophyIcon className="mr-2 h-5 w-5 text-yellow-500" />
              <span className="font-medium">Resultado del partido</span>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <div className="text-center">
                <span className="text-2xl font-bold">{result.team_a_score}</span>
                <p className="text-sm text-muted-foreground">Equipo A</p>
              </div>
              <span className="text-xl font-bold">-</span>
              <div className="text-center">
                <span className="text-2xl font-bold">{result.team_b_score}</span>
                <p className="text-sm text-muted-foreground">Equipo B</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

