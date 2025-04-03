"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboardIcon, ListChecksIcon, SettingsIcon, UsersIcon, BookOpenIcon } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ReactNode
}

export function MainNav() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/",
      icon: <LayoutDashboardIcon className="mr-2 h-4 w-4" />,
    },
    {
      title: "Puntuaciones",
      href: "/scores",
      icon: <ListChecksIcon className="mr-2 h-4 w-4" />,
    },
    {
      title: "Estudiantes",
      href: "/students",
      icon: <UsersIcon className="mr-2 h-4 w-4" />,
    },
    {
      title: "Asignaturas",
      href: "/subjects",
      icon: <BookOpenIcon className="mr-2 h-4 w-4" />,
    },
    {
      title: "Configuración",
      href: "/settings",
      icon: <SettingsIcon className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href ? "text-primary" : "text-muted-foreground",
          )}
        >
          {item.icon}
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

