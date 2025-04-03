"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import { PencilIcon, UserPlusIcon, TrophyIcon, Share2Icon } from "lucide-react"

interface MatchActionsProps {
  match: any
  userInMatch: any
  isCreator: boolean
  isMatchFull: boolean
  isPastMatch: boolean
  userId: string
}

const resultSchema = z.object({
  teamAScore: z
    .string()
    .min(1, "Obligatorio")
    .refine((val) => !isNaN(Number.parseInt(val)), {
      message: "Debe ser un número",
    }),
  teamBScore: z
    .string()
    .min(1, "Obligatorio")
    .refine((val) => !isNaN(Number.parseInt(val)), {
      message: "Debe ser un número",
    }),
})

export function MatchActions({ match, userInMatch, isCreator, isMatchFull, isPastMatch, userId }: MatchActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<z.infer<typeof resultSchema>>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      teamAScore: "",
      teamBScore: "",
    },
  })

  // Función para unirse al partido
  const joinMatch = async () => {
    setIsLoading(true)
    try {
      // Verificar si el partido está lleno
      if (isMatchFull) {
        // Unirse a la lista de espera
        const { error } = await supabase.from("match_players").insert({
          match_id: match.id,
          player_id: userId,
          status: "waitlist",
        })

        if (error) throw error

        toast.success("Te has unido a la lista de espera")
      } else {
        // Unirse como jugador confirmado
        const { error } = await supabase.from("match_players").insert({
          match_id: match.id,
          player_id: userId,
          status: "confirmed",
        })

        if (error) throw error

        toast.success("Te has unido al partido correctamente")
      }

      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al unirse al partido")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para abandonar el partido
  const leaveMatch = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("match_players").delete().eq("match_id", match.id).eq("player_id", userId)

      if (error) throw error

      toast.success("Has abandonado el partido correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al abandonar el partido")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para eliminar el partido
  const deleteMatch = async () => {
    setIsLoading(true)
    try {
      // Primero eliminar los jugadores del partido
      const { error: playersError } = await supabase.from("match_players").delete().eq("match_id", match.id)

      if (playersError) throw playersError

      // Luego eliminar el partido
      const { error } = await supabase.from("matches").delete().eq("id", match.id)

      if (error) throw error

      toast.success("Partido eliminado correctamente")
      router.push("/matches")
    } catch (error: any) {
      toast.error(error.message || "Error al eliminar el partido")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para registrar el resultado del partido
  const registerResult = async (values: z.infer<typeof resultSchema>) => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("match_results").insert({
        match_id: match.id,
        team_a_score: Number.parseInt(values.teamAScore),
        team_b_score: Number.parseInt(values.teamBScore),
        recorded_by: userId,
      })

      if (error) throw error

      // Marcar el partido como completado
      const { error: updateError } = await supabase.from("matches").update({ is_completed: true }).eq("id", match.id)

      if (updateError) throw updateError

      toast.success("Resultado registrado correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al registrar el resultado")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para compartir el partido
  const shareMatch = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Partido de pádel - ${match.match_date}`,
          text: `Te invito a un partido de pádel el ${match.match_date} a las ${match.start_time}`,
          url: window.location.href,
        })
        .then(() => toast.success("Partido compartido correctamente"))
        .catch((error) => console.error("Error al compartir:", error))
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => toast.success("Enlace copiado al portapapeles"))
        .catch(() => toast.error("Error al copiar el enlace"))
    }
  }

  // Función para aceptar una invitación
  const acceptInvitation = async (playerId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("match_players")
        .update({ status: "confirmed", response_at: new Date().toISOString() })
        .eq("match_id", match.id)
        .eq("player_id", playerId)

      if (error) throw error

      toast.success("Invitación aceptada correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al aceptar la invitación")
    } finally {
      setIsLoading(false)
    }
  }

  // Función para rechazar una invitación
  const rejectInvitation = async (playerId: string) => {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("match_players")
        .update({ status: "rejected", response_at: new Date().toISOString() })
        .eq("match_id", match.id)
        .eq("player_id", playerId)

      if (error) throw error

      toast.success("Invitación rechazada")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al rechazar la invitación")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones</CardTitle>
        <CardDescription>Opciones disponibles para este partido</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCreator ? (
          // Acciones para el creador del partido
          <>
            {!isPastMatch && (
              <>
                <Button asChild className="w-full">
                  <Link href={`/matches/${match.id}/edit`}>
                    <PencilIcon className="mr-2 h-4 w-4" />
                    Editar Partido
                  </Link>
                </Button>

                <Button asChild className="w-full">
                  <Link href={`/matches/${match.id}/invite`}>
                    <UserPlusIcon className="mr-2 h-4 w-4" />
                    Invitar Jugadores
                  </Link>
                </Button>
              </>
            )}

            <Button variant="outline" className="w-full" onClick={shareMatch}>
              <Share2Icon className="mr-2 h-4 w-4" />
              Compartir Partido
            </Button>

            {isPastMatch && !match.is_completed && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <TrophyIcon className="mr-2 h-4 w-4" />
                    Registrar Resultado
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Registrar Resultado</DialogTitle>
                    <DialogDescription>Introduce el resultado final del partido</DialogDescription>
                  </DialogHeader>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(registerResult)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="teamAScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Equipo A</FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="teamBScore"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel></FormLabel>
                              <FormControl>
                                <Input type="number" min="0" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button disabled={isLoading} className="w-full" type="submit">
                        {isLoading ? "Registrando..." : "Registrar"}
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}

            <Button variant="destructive" className="w-full" onClick={deleteMatch} disabled={isLoading}>
              Eliminar Partido
            </Button>
          </>
        ) : (
          // Acciones para los jugadores
          <>
            {!userInMatch ? (
              <Button className="w-full" onClick={joinMatch} disabled={isLoading || isMatchFull}>
                {isMatchFull ? "Unirse a la lista de espera" : "Unirse al Partido"}
              </Button>
            ) : (
              <Button variant="destructive" className="w-full" onClick={leaveMatch} disabled={isLoading}>
                Abandonar Partido
              </Button>
            )}

            <Button variant="outline" className="w-full" onClick={shareMatch}>
              <Share2Icon className="mr-2 h-4 w-4" />
              Compartir Partido
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

