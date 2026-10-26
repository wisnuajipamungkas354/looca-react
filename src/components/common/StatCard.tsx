import React from "react"
import { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  colorClass?: string
  bgClass?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass = "text-pink-deep",
  bgClass = "bg-pink-light dark:bg-pink-900/20",
}) => {
  return (
    <Card className="hover:-translate-y-1 transition-all duration-200">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="font-heading text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${bgClass} ${colorClass} shadow-xs`}
        >
          <Icon className="h-7 w-7" />
        </div>
      </CardContent>
    </Card>
  )
}
