"use client"

import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoaderProps {
  variant?: "spinner" | "dots" | "pulse" | "skeleton"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function Loader({ variant = "spinner", size = "md", className }: LoaderProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className={cn(
          "animate-pulse rounded-full bg-muted-foreground/70",
          {
            "h-1 w-1": size === "sm",
            "h-2 w-2": size === "md",
            "h-3 w-3": size === "lg",
          }
        )} />
        <div className={cn(
          "animate-pulse rounded-full bg-muted-foreground/70 animation-delay-200",
          {
            "h-1 w-1": size === "sm",
            "h-2 w-2": size === "md",
            "h-3 w-3": size === "lg",
          }
        )} />
        <div className={cn(
          "animate-pulse rounded-full bg-muted-foreground/70 animation-delay-500",
          {
            "h-1 w-1": size === "sm",
            "h-2 w-2": size === "md",
            "h-3 w-3": size === "lg",
          }
        )} />
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("relative", className)}>
        <div className={cn(
          "animate-ping rounded-full bg-muted-foreground/30 absolute inset-0",
          sizeClasses[size]
        )} />
        <div className={cn(
          "rounded-full bg-muted-foreground/70 relative",
          sizeClasses[size]
        )} />
      </div>
    )
  }

  if (variant === "skeleton") {
    return (
      <div className={cn(
        "animate-pulse bg-muted rounded",
        {
          "h-4 w-20": size === "sm",
          "h-6 w-32": size === "md",
          "h-10 w-48": size === "lg",
        },
        className
      )} />
    )
  }

  // Default spinner
  return (
    <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size], className)} />
  )
}
