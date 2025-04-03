"use client"

import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">PadelMatch</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Aquí puedes agregar un buscador si lo necesitas */}
          </div>
          <nav className="flex items-center space-x-6">
            <Link href="/partidos" className="text-sm font-medium transition-colors hover:text-primary">
              Partidos
            </Link>
            <Link href="/jugadores" className="text-sm font-medium transition-colors hover:text-primary">
              Jugadores
            </Link>
            <Link href="/clubes" className="text-sm font-medium transition-colors hover:text-primary">
              Clubes
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ModeToggle />
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 