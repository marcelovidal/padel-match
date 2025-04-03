"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { CalendarIcon, ClockIcon } from "lucide-react"

const matchFormSchema = z.object({
  matchDate: z.date({
    required_error: "La fecha del partido es obligatoria",
  }),
  startTime: z.string({
    required_error: "La hora de inicio es obligatoria",
  }),
  endTime: z.string({
    required_error: "La hora de finalización es obligatoria",
  }),
  level: z.enum(["clasico", "alto", "medio", "bajo"], {
    required_error: "El nivel del partido es obligatorio",
  }),
  clubId: z.string().optional(),
  courtId: z.string().optional(),
  pricePerPlayer: z.string().optional(),
  notes: z.string().optional(),
})

interface MatchFormProps {
  userId: string
  clubs: {
    id: string
    name: string
    address: string
    city: string
  }[]
  matchId?: string
}

export function MatchForm({ userId, clubs, matchId }: MatchFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [courts, setCourts] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()
  
  const form = useForm<z.infer<typeof matchFormSchema>>({
    resolver: zodResolver(matchFormSchema),
    defaultValues: {
      matchDate: new Date(),
      startTime: "18:00",
      endTime: "19:30",
      level: "medio",
      notes: "",
    },
  })
  
  // Cargar datos del partido si estamos editando
  useEffect(() => {
    const loadMatchData = async () => {
      if (matchId) {
        setIsLoading(true)
        try {
          const { data: match, error } = await supabase
            .from("matches")
            .select("*")
            .eq("id", matchId)
            .single()
          
          if (error) throw error
          
          if (match) {
            form.setValue("matchDate", new Date(match.match_date))
            form.setValue("startTime", match.start_time.substring(0, 5))
            form.setValue("endTime", match.end_time.substring(0, 5))
            form.setValue("level", match.level)
            form.setValue("clubId", match.court_id ? "club_id_here" : undefined) // Necesitaríamos obtener el club_id
            form.setValue("courtId", match.court_id || undefined)
            form.setValue("pricePerPlayer", match.price_per_player ? match.price_per_player.toString() : "")
            form.setValue("notes", match.notes || "")
            
            // Si hay una cancha seleccionada, cargar las canchas del club
            if (match.court_id) {
              const { data: court } = await supabase
                .from("courts")
                .select("club_id")
                .eq("id", match.court_id)
                .single()
              
              if (court) {
                form.setValue("clubId", court.club_id)
                await loadCourts(court.club_id)
              }
            }
          }
        } catch (error: any) {
          toast.error("Error al cargar los datos del partido")
          console.error(error)
        } finally {
          setIsLoading(false)
        }
      }
    }
    
    loadMatchData()
  }, [matchId, form, supabase])
  
  // Cargar canchas cuando se selecciona un club
  const loadCourts = async (clubId: string) => {
    try {
      const { data, error } = await supabase
        .from("courts")
        .select("*")
        .eq("club_id", clubId)
        .order("court_number", { ascending: true })
      
      if (error) throw error
      
      setCourts(data || [])
    } catch (error: any) {
      toast.error("Error al cargar las canchas")
      console.error(error)
    }
  }
  
  // Manejar cambio de club
  const handleClubChange = async (clubId: string) => {
    form.setValue("clubId", clubId)
    form.setValue("courtId", undefined)
    await loadCourts(clubId)
  }
  
  async function onSubmit(values: z.infer<typeof matchFormSchema>) {
    setIsLoading(true)
    try {
      const matchData = {
        creator_id: userId,
        match_date: format(values.matchDate, "yyyy-MM-dd"),
        start_time: values.startTime,
        end_time: values.endTime,
        level: values.level,
        court_id: values.courtId || null,
        price_per_player: values.pricePerPlayer ? Number.parseFloat(values.pricePerPlayer) : null,
        notes: values.notes || null,
      }
      
      let matchId
      
      if (matchId) {
        // Actualizar partido existente
        const { error } = await supabase
          .from("matches")
          .update(matchData)
          .eq("id", matchId)
        
        if (error) throw error
      } else {
        // Crear nuevo partido
        const { data, error } = await supabase
          .from("matches")
          .insert(matchData)
          .select()
        
        if (error) throw error
        
        matchId = data[0].id
        
        // Añadir al creador como jugador confirmado
        const { error: playerError } = await supabase
          .from("match_players")
          .insert({
            match_id: matchId,
            player_id: userId,
            status: "confirmed",
          })
        
        if (playerError) throw playerError
      }
      
      toast.success(matchId ? "Partido actualizado correctamente" : "Partido creado correctamente")
      router.push(`/matches/${matchId}`)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al guardar el partido")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="matchDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha del partido</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="w-full pl-3 text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Selecciona una fecha</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Selecciona la fecha para el partido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nivel del partido</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="clasico">Clásico</SelectItem>
                        <SelectItem value="alto">Alto</SelectItem>
                        <SelectItem value="medio">Medio</SelectItem>
                        <SelectItem value="bajo">Bajo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Nivel de juego esperado para este partido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de inicio</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Hora de inicio del partido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de finalización</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <ClockIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Hora de finalización del partido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="clubId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Club (opcional)</FormLabel>
                    <Select 
                      onValueChange={(value) => handleClubChange(value)} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un club" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clubs.map((club) => (
                          <SelectItem key={club.id} value={club.id}>
                            {club.name} - {club.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona el club donde se jugará el partido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="courtId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancha (opcional)</FormLabel>
                    <FormControl>
                      <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                        disabled={courts.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una cancha" />
                        </SelectTrigger>
                        <SelectContent>
                        {courts.map((court) => (
                          <SelectItem key={court.id} value={court.id}>
                            {court.name} - {court.price_per-hour}€/hora
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Selecciona la cancha para el partido
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pricePerPlayer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio por jugador (opcional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0.00" 
                        {...field} 
                        step="0.01"
                        min="0"
                      />
                    </FormControl>
                    <FormDescription>
                      Precio a pagar por cada jugador (en euros)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas adicionales (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Añade información adicional sobre el partido..." 
                      {...field} 
                      rows={4}
                    />
                  </FormControl>
                  <FormDescription>
                    Información adicional para los jugadores
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : matchId ? "Actualizar Partido" : "Crear Partido"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

