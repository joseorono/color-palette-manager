import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Loader } from "./loader"

interface LoadingCardProps {
  title?: string
  description?: string
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
  className?: string
}

export function LoadingCard({
  title = "Loading",
  description = "Please wait while we fetch your data...",
  variant = "spinner",
  className,
}: LoadingCardProps) {
  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="flex justify-center py-8">
        <Loader variant={variant} size="lg" />
      </CardContent>
    </Card>
  )
}
