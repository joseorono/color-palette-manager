import React, { useState } from 'react';
import { db } from './main'; // Asegúrate de que esta ruta sea correcta para tu proyecto
import { Palette } from '@/types';
import { PaletteDBQueries } from './queries';

// Datos de ejemplo
const samplePalettes = [
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
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Utilidad de Base de Datos Dexie.js</h1>
      <p>
        Esta herramienta te permite gestionar la base de datos de IndexedDB directamente desde el navegador.
      </p>
      <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <button
          onClick={() => runCommand('seed')}
          disabled={isProcessing}
          style={{ padding: '10px 15px', cursor: 'pointer' }}
        >
          {isProcessing ? 'Seeding...' : 'Seed Database'}
        </button>
        <button
          onClick={() => runCommand('clear')}
          disabled={isProcessing}
          style={{ padding: '10px 15px', cursor: 'pointer' }}
        >
          {isProcessing ? 'Clearing...' : 'Clear Database'}
        </button>
        <button
          onClick={() => runCommand('reset')}
          disabled={isProcessing}
          style={{ padding: '10px 15px', cursor: 'pointer' }}
        >
          {isProcessing ? 'Resetting...' : 'Reset Database'}
        </button>
      </div>
      
      {log.length > 0 && (
        <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', backgroundColor: '#f9f9f9', whiteSpace: 'pre-wrap' }}>
          <h2>Registro de Comandos:</h2>
          {log.map((line, index) => (
            <p key={index} style={{ margin: '0' }}>{line}</p>
          ))}
        </div>
      )}
    </div>
  );
};
