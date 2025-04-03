"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signUp } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type UserRole = 'player' | 'club_owner'
type PlayerPosition = 'drive' | 'reves' | 'ambas'
type PlayerCategory = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: 'player' as UserRole,
    position: 'ambas' as PlayerPosition,
    category: '5' as PlayerCategory,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validar formato de teléfono (opcional)
    if (formData.phone && !/^\+?[\d\s-()]{8,}$/.test(formData.phone)) {
      toast({
        title: "Error",
        description: "El formato del teléfono no es válido",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    const { success, error } = await signUp({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      phone: formData.phone || null,
      role: formData.role,
      position: formData.role === 'player' ? formData.position : undefined,
      category: formData.role === 'player' ? formData.category : undefined,
    })

    if (success) {
      toast({
        title: "¡Registro exitoso!",
        description: "Tu cuenta ha sido creada correctamente",
      })
      router.push("/login")
    } else {
      toast({
        title: "Error",
        description: error?.message || "Hubo un error al crear la cuenta",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (value: UserRole) => {
    setFormData((prev) => ({ ...prev, role: value }))
  }

  const handlePositionChange = (value: PlayerPosition) => {
    setFormData((prev) => ({ ...prev, position: value }))
  }

  const handleCategoryChange = (value: PlayerCategory) => {
    setFormData((prev) => ({ ...prev, category: value }))
  }

  return (
    <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/">PadelMatch</Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "PadelMatch ha revolucionado la forma en que organizo mis partidos de pádel. ¡Es increíble!"
            </p>
            <footer className="text-sm">Sofia Rodríguez</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Crear una cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus datos para crear tu cuenta
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label>Tipo de Usuario</Label>
                <RadioGroup
                  defaultValue="player"
                  value={formData.role}
                  onValueChange={handleRoleChange}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="player"
                      id="player"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="player"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-medium">Jugador</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="club_owner"
                      id="club_owner"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="club_owner"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="text-sm font-medium">Dueño de Club</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.role === 'player' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="position">Posición</Label>
                    <Select
                      value={formData.position}
                      onValueChange={handlePositionChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu posición" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drive">Drive</SelectItem>
                        <SelectItem value="reves">Revés</SelectItem>
                        <SelectItem value="ambas">Ambas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Categoría</Label>
                    <Select
                      value={formData.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu categoría" />
                      </SelectTrigger>
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
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="Tu nombre"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Tu apellido"
                  type="text"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="nombre@ejemplo.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Teléfono (opcional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="+34 123 456 789"
                  type="tel"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 