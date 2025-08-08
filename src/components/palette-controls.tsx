import { useState } from 'react';
import { usePaletteStore } from '@/stores/palette-store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Slider } from './ui/slider';
import { Save, Share, Upload, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { ImageUploader } from './image-uploader';

export function PaletteControls() {
  const [paletteSize, setPaletteSize] = useState([5]);
  const [paletteName, setPaletteName] = useState('');
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const { 
    currentPalette, 
    generateNewPalette, 
    savePalette 
  } = usePaletteStore();

  const handleSizChange = (value: number[]) => {
    setPaletteSize(value);
    generateNewPalette(value[0]);
  };

  const handleSave = async () => {
    if (!paletteName.trim()) {
      toast.error('Please enter a palette name');
      return;
    }
    
    try {
      await savePalette(paletteName.trim());
      toast.success('Palette saved successfully!');
      setIsSaveOpen(false);
      setPaletteName('');
    } catch (error) {
      toast.error('Failed to save palette');
    }
  };

  const handleShare = async () => {
    const colors = currentPalette.map(c => c.hex.replace('#', ''));
    const url = `${window.location.origin}?colors=${colors.join(',')}`;
    
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Palette URL copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      {/* Palette Size Control */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <Label className="text-sm font-medium mb-2 block">
          Palette Size: {paletteSize[0]} colors
        </Label>
        <Slider
          value={paletteSize}
          onValueChange={handleSizChange}
          max={16}
          min={2}
          step={1}
          className="w-32"
        />
      </div>

      {/* Save Palette */}
      <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Save className="w-4 h-4" />
            Save Palette
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Palette</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="palette-name">Palette Name</Label>
              <Input
                id="palette-name"
                value={paletteName}
                onChange={(e) => setPaletteName(e.target.value)}
                placeholder="Enter palette name..."
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsSaveOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Palette */}
      <Button onClick={handleShare} variant="outline" className="gap-2">
        <Share className="w-4 h-4" />
        Share
      </Button>

      {/* Upload Image */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Upload className="w-4 h-4" />
            Extract from Image
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Extract Colors from Image</DialogTitle>
          </DialogHeader>
          <ImageUploader onClose={() => setIsUploadOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}