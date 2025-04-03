import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon, BarChart3Icon, UsersIcon, BookOpenIcon } from "lucide-react"

export function ScoreStats() {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
          <BarChart3Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">85.6</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +2.5%
            </span>{" "}
            desde el mes pasado
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
          <UsersIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">245</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 inline-flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +12
            </span>{" "}
            nuevos este mes
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Asignaturas</CardTitle>
          <BookOpenIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">18</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-rose-500 inline-flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              -1
            </span>{" "}
            desde el semestre anterior
          </p>
        </CardContent>
      </Card>
    </>
  )
}

