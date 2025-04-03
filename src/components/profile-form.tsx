"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

const profileSchema = z.object({
  fullName: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  phone: z.string().optional(),
})

const playerSchema = z.object({
  position: z.enum(["drive", "reves", "ambas"], {
    required_error: "Selecciona tu posición preferida",
  }),
  category: z.enum(["1", "2", "3", "4", "5", "6", "7", "8"], {
    required_error: "Selecciona tu categoría",
  }),
})

interface ProfileFormProps {
  profile: any
  player: any
}

export function ProfileForm({ profile, player }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const router = useRouter()
  const supabase = createClient()

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: profile.full_name || "",
      phone: profile.phone || "",
    },
  })

  const playerForm = useForm<z.infer<typeof playerSchema>>({
    resolver: zodResolver(playerSchema),
    defaultValues: {
      position: player.position || "ambas",
      category: player.category || "5",
    },
  })

  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          phone: values.phone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      toast.success("Perfil actualizado correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el perfil")
    } finally {
      setIsLoading(false)
    }
  }

  async function onPlayerSubmit(values: z.infer<typeof playerSchema>) {
    setIsLoading(true)
    try {
      const { error } = await supabase
        .from("players")
        .update({
          position: values.position,
          category: values.category,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      toast.success("Datos de jugador actualizados correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar los datos de jugador")
    } finally {
      setIsLoading(false)
    }
  }

  async function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return
    }

    setIsLoading(true)
    try {
      const file = event.target.files[0]
      const fileExt = file.name.split(".").pop()
      const fileName = `${profile.id}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Subir imagen a Supabase Storage
      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Obtener URL pública
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      // Actualizar perfil con la nueva URL
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          avatar_url: data.publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (updateError) throw updateError

      toast.success("Avatar actualizado correctamente")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar el avatar")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información de Perfil</CardTitle>
        <CardDescription>Actualiza tu información personal y de jugador</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="player">Jugador</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url || ""} alt={profile.full_name} />
                  <AvatarFallback className="text-2xl">
                    {profile.full_name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center">
                  <label htmlFor="avatar" className="text-sm text-primary hover:underline cursor-pointer">
                    Cambiar avatar
                  </label>
                  <input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={uploadAvatar}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex-1">
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre completo" {...field} />
                          </FormControl>
                          <FormDescription>Este es el nombre que verán otros jugadores</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono (opcional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+34 600 000 000" {...field} />
                          </FormControl>
                          <FormDescription>Tu número de teléfono para contacto</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Guardando..." : "Guardar cambios"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Información de la cuenta</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{profile.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rol</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.role === "player"
                      ? "Jugador"
                      : profile.role === "club_owner"
                        ? "Dueño de Club"
                        : "Administrador"}
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="player">
            <Form {...playerForm}>
              <form onSubmit={playerForm.handleSubmit(onPlayerSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={playerForm.control}
                    name="position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Posición preferida</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu posición" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="drive">Drive</SelectItem>
                            <SelectItem value="reves">Revés</SelectItem>
                            <SelectItem value="ambas">Ambas</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Tu posición preferida en la pista</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={playerForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1ª</SelectItem>
                            <SelectItem value="2">2ª</SelectItem>
                            <SelectItem value="3">3ª</SelectItem>
                            <SelectItem value="4">4ª</SelectItem>
                            <SelectItem value="5">5ª</SelectItem>
                            <SelectItem value="6">6ª</SelectItem>
                            <SelectItem value="7">7ª</SelectItem>
                            <SelectItem value="8">8ª</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>Tu nivel de juego actual</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="border rounded-md p-4 bg-muted/50">
                  <h3 className="text-lg font-medium mb-2">Estadísticas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium">Partidos jugados</p>
                      <p className="text-xl font-bold">{player.total_matches || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Victorias / Derrotas</p>
                      <p className="text-xl font-bold">
                        {player.wins || 0} / {player.losses || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Valoración media</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

