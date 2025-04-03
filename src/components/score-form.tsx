"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  studentName: z.string().min(2, {
    message: "El nombre del estudiante debe tener al menos 2 caracteres.",
  }),
  category: z.string({
    required_error: "Por favor selecciona una asignatura.",
  }),
  score: z.number().min(0).max(100),
  date: z.string(),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ScoreFormProps {
  id?: string
}

export function ScoreForm({ id }: ScoreFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Default values for the form
  const defaultValues: Partial<FormValues> = {
    studentName: "",
    category: "",
    score: 75,
    date: new Date().toISOString().split("T")[0],
    notes: "",
  }

  // If editing, we would fetch the score data here
  // and update defaultValues

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  function onSubmit(data: FormValues) {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: id ? "Puntuación actualizada" : "Puntuación creada",
        description: id
          ? "La puntuación ha sido actualizada correctamente."
          : "La nueva puntuación ha sido creada correctamente.",
      })
      router.push("/scores")
    }, 1000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{id ? "Editar Puntuación" : "Nueva Puntuación"}</CardTitle>
        <CardDescription>
          {id
            ? "Actualiza los detalles de la puntuación existente."
            : "Completa el formulario para añadir una nueva puntuación."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="studentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Estudiante</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre completo" {...field} />
                  </FormControl>
                  <FormDescription>Ingresa el nombre completo del estudiante.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asignatura</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una asignatura" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="matematicas">Matemáticas</SelectItem>
                      <SelectItem value="ciencias">Ciencias</SelectItem>
                      <SelectItem value="historia">Historia</SelectItem>
                      <SelectItem value="literatura">Literatura</SelectItem>
                      <SelectItem value="ingles">Inglés</SelectItem>
                      <SelectItem value="fisica">Física</SelectItem>
                      <SelectItem value="quimica">Química</SelectItem>
                      <SelectItem value="biologia">Biología</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Selecciona la asignatura a la que corresponde esta puntuación.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Puntuación: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormDescription>Ajusta la puntuación entre 0 y 100.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormDescription>Fecha en la que se registró la puntuación.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Observaciones adicionales..." className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Añade cualquier observación o comentario relevante.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => router.push("/scores")}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Guardando..." : id ? "Actualizar" : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  )
}

