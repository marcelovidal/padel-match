"use client"

import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Calendar,
  Users,
  MapPin,
  Settings,
  LogOut
} from "lucide-react"
import { signOut } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

const sidebarNavItems = [
  {
    title: "Calendario",
    href: "/player/calendar",
    icon: Calendar
  },
  {
    title: "Jugadores",
    href: "/player/players",
    icon: Users
  },
  {
    title: "Clubes",
    href: "/player/clubs",
    icon: MapPin
  },
  {
    title: "Configuración",
    href: "/player/settings",
    icon: Settings
  }
]

export default function PlayerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      const { success, error } = await signOut()
      
      if (success) {
        toast({
          title: "Sesión cerrada",
          description: "Has cerrado sesión correctamente.",
        })
        router.push('/login')
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error?.message || "Ha ocurrido un error al cerrar sesión.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ha ocurrido un error al cerrar sesión.",
      })
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
        <div className="flex h-full flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            <Link href="/player" className="flex items-center gap-2 font-semibold">
              <span className="text-xl">PadelMatch</span>
            </Link>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-4 py-4">
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  Menú
                </h2>
                <div className="space-y-1">
                  {sidebarNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                        pathname === item.href
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                          : "transparent"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
          <div className="border-t p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <div className="flex h-[60px] items-center border-b px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">
              {sidebarNavItems.find((item) => item.href === pathname)?.title || "Dashboard"}
            </h1>
          </div>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
} 