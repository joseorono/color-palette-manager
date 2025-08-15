"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreatePaletteModal } from "./create-palette-modal"

interface CreatePaletteTriggerProps {
  children?: React.ReactNode
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
}

export function CreatePaletteTrigger({ children, variant = "default", size = "default" }: CreatePaletteTriggerProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant={variant} size={size} onClick={() => setOpen(true)}>
        {children || (
          <>
            <Plus className="mr-2 h-4 w-4" />
            New Palette
          </>
        )}
      </Button>

      <CreatePaletteModal open={open} onOpenChange={setOpen} />
    </>
  )
}
