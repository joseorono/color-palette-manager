import React, { useState } from 'react';
import { db } from './main';
import { Palette } from '@/types';
import { PaletteDBQueries } from './queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Sample data
const samplePalettes: Omit<Palette, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Material Design",
    description: "Google's Material Design color palette",
    colors: [
      { hex: "#F44336", locked: false, name: "Red", role: "accent" },
      { hex: "#2196F3", locked: false, name: "Blue", role: "primary" },
      { hex: "#4CAF50", locked: false, name: "Green", role: "secondary" },
      { hex: "#FFC107", locked: false, name: "Amber", role: "muted" },
      { hex: "#9C27B0", locked: false, name: "Purple", role: "card" },
    ],
    isPublic: true,
    tags: ["material", "google", "popular"],
    favoriteCount: 42,
    isFavorite: false,
  },
  {
    name: "Tailwind CSS",
    description: "Default color palette from Tailwind CSS",
    colors: [
      { hex: "#3B82F6", locked: false, name: "Blue", role: "primary" },
      { hex: "#10B981", locked: false, name: "Emerald", role: "secondary" },
      { hex: "#EF4444", locked: false, name: "Red", role: "accent" },
      { hex: "#F59E0B", locked: false, name: "Amber", role: "muted" },
      { hex: "#8B5CF6", locked: false, name: "Violet", role: "card" },
    ],
    isPublic: true,
    tags: ["tailwind", "modern", "web"],
    favoriteCount: 38,
    isFavorite: true,
  },
  {
    name: "Super Secret Palette",
    description: "A secret palette that only you know about (actually the one used by the app).",
    colors: [
      { hex: "#1F1F1F", locked: false, name: "Black", role: "primary" },
      { hex: "#E9FCFF", locked: false, name: "Azure Web", role: "secondary" },
      { hex: "#F5F6FA", locked: false, name: "White", role: "accent" },
      { hex: "#93E6EF", locked: false, name: "Electric Blue", role: "muted" },
      { hex: "#46CEE6", locked: false, name: "Vivid Sky Blue", role: "card" },
      { hex: "#1A8499", locked: false, name: "Blue Munsell", role: "card" },
      { hex: "#095764", locked: false, name: "Midnight Green", role: "card" },
    ],
    isPublic: false,
    tags: ["secret", "own"],
    favoriteCount: 38,
    isFavorite: true,
  },
  {
    name: "Nord Theme",
    description: "Arctic, north-bluish color palette",
    colors: [
      { hex: "#8FBCBB", locked: false, name: "Nord 7", role: "primary" },
      { hex: "#88C0D0", locked: false, name: "Nord 8", role: "secondary" },
      { hex: "#81A1C1", locked: false, name: "Nord 9", role: "accent" },
      { hex: "#5E81AC", locked: false, name: "Nord 10", role: "background" },
      { hex: "#BF616A", locked: false, name: "Nord 11", role: "border" },
    ],
    isPublic: true,
    tags: ["nord", "arctic", "cool"],
    favoriteCount: 27,
    isFavorite: false,
  },
  {
    name: "Solarized",
    description: "Precision colors for machines and people",
    colors: [
      { hex: "#268BD2", locked: false, name: "Blue", role: "primary" },
      { hex: "#859900", locked: false, name: "Green", role: "secondary" },
      { hex: "#D33682", locked: false, name: "Magenta", role: "accent" },
      { hex: "#CB4B16", locked: false, name: "Orange", role: "foreground" },
      { hex: "#DC322F", locked: false, name: "Red", role: "muted" },
    ],
    isPublic: true,
    tags: ["solarized", "ethan schoonover", "popular"],
    favoriteCount: 31,
    isFavorite: false,
  },
];
/**
 * Seeds the database with sample data
 * @returns Promise that resolves when seeding is complete
 */
const seedDatabase = async () => {
    try {
      const paletteCount = await db.palettes.count();

      if (paletteCount === 0) {
        console.log('Seeding palettes...');
        const now = new Date();

        // Create properly formatted palettes array
        const palettesWithTimestamps = samplePalettes.map(palette => ({
          id: crypto.randomUUID(),
          ...palette,
          createdAt: now,
          updatedAt: now,
        }));

        // Insert all palettes at once using bulkAdd
        await db.palettes.bulkAdd(palettesWithTimestamps);

        console.log(`Added ${palettesWithTimestamps.length} palettes`);
        console.log(await PaletteDBQueries.getAllPalettes());
      } else {
        console.log(`Database already has ${paletteCount} palettes, skipping palette seed`);
      }

      return { success: true };
    } catch (error) {
      console.error('Error seeding database:', error);
      return { success: false, error };
    }
  };

/**
 * Clears all data from the database
 * @returns Promise that resolves when clearing is complete
 */
const clearDatabase = async () => {
  try {
    await db.palettes.clear();
    console.log('Database cleared');
    return { success: true };
  } catch (error) {
    console.error('Error clearing database:', error);
    return { success: false, error };
  }
};

/**
 * Resets the database by clearing it and then seeding it
 * @returns Promise that resolves when reset is complete
 */
const resetDatabase = async () => {
  await clearDatabase();
  return seedDatabase();
};

export const DatabaseSeeder = () => {
  const [log, setLog] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const runCommand = async (command: 'seed' | 'clear' | 'reset') => {
    setIsProcessing(true);
    setLog([]);
    const consoleLog = (message: string) => {
      setLog(prevLog => [...prevLog, message]);
      console.log(message);
    };

    let result;
    try {
      consoleLog(`Executing command: ${command}`);
      switch (command) {
        case 'seed':
          result = await seedDatabase();
          break;
        case 'clear':
          result = await clearDatabase();
          break;
        case 'reset':
          result = await resetDatabase();
          break;
        default:
          consoleLog('Invalid command');
          result = { success: false, error: 'Invalid command' };
      }
      consoleLog(`Result: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      consoleLog(`Error: ${error}`);
      result = { success: false, error: error.message };
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Database Management Tool</CardTitle>
          <CardDescription>
            This tool allows you to manage the IndexedDB database directly from the browser.
            Use these utilities to seed, clear, or reset your palette database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => runCommand('seed')}
              disabled={isProcessing}
              variant="default"
              className="min-w-[120px]"
            >
              {isProcessing ? 'Seeding...' : 'Seed Database'}
            </Button>
            <Button
              onClick={() => runCommand('clear')}
              disabled={isProcessing}
              variant="destructive"
              className="min-w-[120px]"
            >
              {isProcessing ? 'Clearing...' : 'Clear Database'}
            </Button>
            <Button
              onClick={() => runCommand('reset')}
              disabled={isProcessing}
              variant="outline"
              className="min-w-[120px]"
            >
              {isProcessing ? 'Resetting...' : 'Reset Database'}
            </Button>
          </div>

          {isProcessing && (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <Badge variant="secondary">Processing...</Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {log.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Command Log</CardTitle>
            <CardDescription>Output from database operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md font-mono text-sm max-h-96 overflow-y-auto">
              {log.map((line, index) => (
                <div key={index} className="mb-1 text-muted-foreground">
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
