import { createClient } from "@/lib/supabase/server"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrophyIcon, CalendarIcon, MessageSquareIcon, BellIcon, StarIcon } from "lucide-react"

interface RecentActivityProps {
  userId: string
  className?: string
}

export async function RecentActivity({ userId, className }: RecentActivityProps) {
  const supabase = createClient()

  // Obtener notificaciones recientes
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  // Función para obtener el icono según el tipo de notificación
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "match_invitation":
      case "match_confirmation":
      case "match_cancellation":
        return <TrophyIcon className="h-4 w-4" />
      case "reservation_confirmation":
      case "reservation_cancellation":
        return <CalendarIcon className="h-4 w-4" />
      case "player_rating":
        return <StarIcon className="h-4 w-4" />
      default:
        return <BellIcon className="h-4 w-4" />
    }
  }

  // Función para obtener el color de la badge según el tipo de notificación
  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "match_invitation":
        return "secondary"
      case "match_confirmation":
        return "success"
      case "match_cancellation":
        return "destructive"
      case "reservation_confirmation":
        return "success"
      case "reservation_cancellation":
        return "destructive"
      case "player_rating":
        return "secondary"
      default:
        return "default"
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimas notificaciones y actividades</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications && notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start space-x-4">
                <div className={`rounded-full p-2 bg-${getNotificationBadge(notification.type)}/10`}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <Badge variant={getNotificationBadge(notification.type) as any}>
                      {notification.type
                        .split("_")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <MessageSquareIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No hay actividad reciente</h3>
            <p className="text-sm text-muted-foreground mt-1">Las notificaciones y actividades aparecerán aquí</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

