import { useEffect, useCallback } from 'react';
import { usePaletteStore } from '@/stores/palette-store';
import { ColorCard } from './color-card';
import { PaletteControls } from './palette-controls';
import { ExportModal } from './export-modal';
import { Button } from './ui/button';
import { Shuffle, Plus } from 'lucide-react';

export function PaletteGenerator() {
  const {
    currentPalette,
    isGenerating,
    generateNewPalette,
    regenerateUnlocked,
    addColor,
  } = usePaletteStore();

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.code === 'Space' && !event.repeat) {
      event.preventDefault();
      regenerateUnlocked();
    }
  }, [regenerateUnlocked]);

  useEffect(() => {
    // Generate initial palette
    if (currentPalette.length === 0) {
      generateNewPalette();
    }
    
    // Add keyboard listeners
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress, generateNewPalette, currentPalette.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Color Palette Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create beautiful color palettes with ease. Press spacebar to generate new colors.
          </p>
          
          <div className="flex justify-center gap-4 mb-8">
            <Button
              onClick={() => generateNewPalette()}
              disabled={isGenerating}
              className="gap-2"
            >
              <Shuffle className="w-4 h-4" />
              Generate New
            </Button>
            
            <Button
              onClick={addColor}
              variant="outline"
              disabled={currentPalette.length >= 16}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Color
            </Button>
          </div>
        </div>

        {/* Palette Display */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-2">
            {currentPalette.map((color) => (
              <ColorCard key={color.id} color={color} />
            ))}
          </div>
        </div>

        {/* Controls */}
        <PaletteControls />
        
        {/* Export Modal */}
        <ExportModal />
      </div>
    </div>
  );
}