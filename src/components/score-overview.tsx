"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

const data = [
  { name: "Ene", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Abr", value: 200 },
  { name: "May", value: 500 },
  { name: "Jun", value: 350 },
  { name: "Jul", value: 450 },
  { name: "Ago", value: 550 },
  { name: "Sep", value: 650 },
  { name: "Oct", value: 480 },
  { name: "Nov", value: 520 },
  { name: "Dic", value: 700 },
]

interface ScoreOverviewProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ScoreOverview({ className, ...props }: ScoreOverviewProps) {
  const [activeTab, setActiveTab] = useState("mensual")

  return (
    <Card className={cn("col-span-4", className)} {...props}>
      <CardHeader>
        <CardTitle>Evolución de Puntuaciones</CardTitle>
        <CardDescription>Visualiza la evolución de las puntuaciones a lo largo del tiempo.</CardDescription>
        <Tabs defaultValue="mensual" value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList>
            <TabsTrigger value="semanal">Semanal</TabsTrigger>
            <TabsTrigger value="mensual">Mensual</TabsTrigger>
            <TabsTrigger value="anual">Anual</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

