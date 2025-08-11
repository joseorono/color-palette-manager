"use client"

import { useState, useEffect } from "react"
import type { Palette } from "@/types/palette"
import { PaletteDBQueries } from "@/db/queries"

// Mock data for demonstration
// const mockPalettes: Palette[] = [
//   {
//     id: "1",
//     name: "Ocean Breeze",
//     description: "Calming blues and teals inspired by ocean waves",
//     colors: [
//       { hex: "#0077BE", name: "Ocean Blue", locked: true },
//       { hex: "#00A8CC", name: "Turquoise", locked: true },
//       { hex: "#7DD3C0", name: "Mint", locked: true },
//       { hex: "#FFEAA7", name: "Sand", locked: true },
//       { hex: "#FFFFFF", name: "Foam", locked: true },
//     ],
//     createdAt: new Date("2024-01-15"),
//     updatedAt: new Date("2024-01-20"),
//     isPublic: true,
//     tags: ["blue", "ocean", "calm", "nature"],
//     favoriteCount: 24,
//     isFavorite: true,
//   },
//   {
//     id: "2",
//     name: "Sunset Vibes",
//     description: "Warm oranges and pinks of a beautiful sunset",
//     colors: [
//       { hex: "#FF6B6B", name: "Coral", locked: true },
//       { hex: "#FF8E53", name: "Orange", locked: true },
//       { hex: "#FF6B9D", name: "Pink", locked: true },
//       { hex: "#A8E6CF", name: "Mint Green", locked: true },
//     ],
//     createdAt: new Date("2024-01-10"),
//     updatedAt: new Date("2024-01-18"),
//     isPublic: false,
//     tags: ["warm", "sunset", "vibrant"],
//     favoriteCount: 12,
//     isFavorite: false,
//   },
//   {
//     id: "3",
//     name: "Forest Path",
//     description: "Earthy greens and browns from a woodland walk",
//     colors: [
//       { hex: "#2D5016", name: "Forest Green", locked: true },
//       { hex: "#61892F", name: "Leaf Green", locked: true },
//       { hex: "#86C232", name: "Bright Green", locked: true },
//       { hex: "#6B4423", name: "Tree Bark", locked: true },
//       { hex: "#A0522D", name: "Earth", locked: true },
//     ],
//     createdAt: new Date("2024-01-05"),
//     updatedAt: new Date("2024-01-15"),
//     isPublic: true,
//     tags: ["green", "nature", "earth", "forest"],
//     favoriteCount: 8,
//     isFavorite: true,
//   },
//   {
//     id: "4",
//     name: "Midnight City",
//     description: "Dark and moody colors with neon accents",
//     colors: [
//       { hex: "#1A1A2E", name: "Midnight", locked: true },
//       { hex: "#16213E", name: "Deep Blue", locked: true },
//       { hex: "#0F3460", name: "Navy", locked: true },
//       { hex: "#E94560", name: "Neon Pink", locked: true },
//       { hex: "#F39C12", name: "Electric Orange", locked: true },
//     ],
//     createdAt: new Date("2024-01-12"),
//     updatedAt: new Date("2024-01-22"),
//     isPublic: true,
//     tags: ["dark", "neon", "city", "modern"],
//     favoriteCount: 31,
//     isFavorite: false,
//   },
// ]

export function usePalettes() {
  const [palettes, setPalettes] = useState<Palette[]>([])
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    // Simulate API call
    const loadPalettes = async () => {
      const paletteDBData = await PaletteDBQueries.getAllPalettes()
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPalettes(paletteDBData)
      setIsLoading(false)
    }

    loadPalettes()
  }, [])

  const toggleFavorite = (paletteId: string) => {
    setPalettes(prev => prev.map(palette =>
      palette.id === paletteId
        ? { ...palette, isFavorite: !palette.isFavorite }
        : palette
    ))
  }

  const deletePalette = (paletteId: string) => {
    setPalettes(prev => prev.filter(palette => palette.id !== paletteId))
  }

  return {
    palettes,
    isLoading,
    toggleFavorite,
    deletePalette,
  }
}
