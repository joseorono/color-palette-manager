import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { usePaletteStore } from "@/stores/palette-store";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { PalettePreview } from "./palette-preview";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";
import { ImageAnalyzer } from "@/lib/image-analyzer";
import { MAX_PALETTE_COLORS } from "@/constants";
import { HexColorString } from "@/types/palette";

interface ImageUploaderProps {
  onClose: () => void;
}

type ExtractionAlgorithm = 'new' | 'old';

export function ImageUploader({ onClose }: ImageUploaderProps) {
  const [colorCount, setColorCount] = useState([5]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<ExtractionAlgorithm>('new');
  const [extractedColors, setExtractedColors] = useState<HexColorString[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { loadPaletteFromUrl } = usePaletteStore();

  const extractColors = useCallback(
    async () => {
      if (!uploadedFile) return;

      setIsProcessing(true);
      setExtractedColors([]);

      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = async () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          const imageData = ctx?.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          if (imageData) {
            let colors: HexColorString[];

            switch (algorithm) {
              case 'old':
                colors = await ImageAnalyzer.extractColors_old(
                  imageData,
                  colorCount[0]
                );
                break;
              default:
                colors = await ImageAnalyzer.extractColors(
                  imageData,
                  colorCount[0]
                );
                break;
            }

            // Update preview colors
            setExtractedColors(colors);
            toast.success("Colors extracted successfully!");
          }
          setIsProcessing(false);
        };

        img.onerror = () => {
          toast.error("Failed to process image");
          setIsProcessing(false);
        };

        const url = URL.createObjectURL(uploadedFile);
        img.src = url;
      } catch (error) {
        toast.error("Error processing image");
        setIsProcessing(false);
      }
    },
    [uploadedFile, colorCount, algorithm]
  );

  const handleImageUpload = useCallback(
    (file: File) => {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUploadedFile(file);
      setExtractedColors([]); // Clear previous colors

      // Auto-extract colors when image is uploaded
      setTimeout(() => {
        extractColors();
      }, 100);
    },
    [extractColors]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/")) {
        handleImageUpload(file);
      } else {
        toast.error("Please upload a valid image file");
      }
    },
    [handleImageUpload]
  );

  const handleExtractAndUse = useCallback(() => {
    // ToDo: Rewrite this some it doesn't create a whole new palette why overriding the existing one
    if (extractedColors.length === 0) return;

    const url = `?colors=${encodeURIComponent(extractedColors.join(','))}`;
    loadPaletteFromUrl(url);
    toast.success("Palette loaded successfully!");
    onClose();
  }, [extractedColors, loadPaletteFromUrl, onClose]);

  // Auto re-extract when color count or algorithm changes (if image is uploaded)
  useEffect(() => {
    if (uploadedFile) {
      const timeoutId = setTimeout(() => {
        extractColors();
      }, 100); // Debounce to prevent rapid calls

      return () => clearTimeout(timeoutId);
    }
  }, [colorCount, algorithm, uploadedFile, extractColors]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div className="space-y-2">
      {/* Algorithm Selection */}
      <div className="mb-4">
        <RadioGroup value={algorithm} onValueChange={(value) => setAlgorithm(value as ExtractionAlgorithm)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="new" id="new" />
            <Label htmlFor="new" className="text-sm cursor-pointer mt-4">
              <div>
                <div className="font-medium">Advanced Algorithm (Recommended)</div>
                <div className="text-xs text-muted-foreground">
                  Intelligent analysis with adaptive sampling and color deduplication. Very accurate, but might not get the "vibe" of larger images.
                </div>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="old" id="old" />
            <Label htmlFor="old" className="text-sm cursor-pointer">
              <div>
                <div className="font-medium">Averaging Algorithm</div>
                <div className="text-xs text-muted-foreground">
                  Simple K-means clustering - faster but less sophisticated. Gets the general "vibe", as opposed the exact colors.
                </div>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Color Count Slider */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Number of colors to extract: {colorCount[0]}
        </Label>
        <Slider
          value={colorCount}
          onValueChange={setColorCount}
          max={MAX_PALETTE_COLORS}
          min={4}
          step={1}
          className="w-full"
        />
      </div>

      {/* Color Preview */}
      {extractedColors.length > 0 && (
        <div>
          <Label className="mb-2 block text-sm font-medium">
            Extracted Colors Preview
          </Label>
          <PalettePreview
            colors={extractedColors.map((hex, index) => ({
              id: `preview-${index}`,
              hex,
              locked: false
            }))}
            height="4rem"
            showTooltips={true}
            borderRadius="lg"
            showBorder={true}
          />
        </div>
      )}

      {/* Image Upload Area */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors ${isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 dark:border-gray-600"} ${isProcessing ? "cursor-not-allowed opacity-50" : "hover:border-gray-400"} `}
      >
        <input {...getInputProps()} />

        {previewUrl ? (
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="mx-auto max-h-48 max-w-full rounded-lg"
            />
            {!isProcessing && (
              <Button
                size="sm"
                variant="outline"
                className="absolute right-2 top-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewUrl(null);
                  setUploadedFile(null);
                  setExtractedColors([]);
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                {isDragActive ? "Drop your image here" : "Upload an image"}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Drag & drop or click to select • PNG, JPG, GIF up to 10MB
              </p>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white bg-opacity-75 dark:bg-gray-800 dark:bg-opacity-75">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Extracting colors...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          onClick={handleExtractAndUse}
          disabled={extractedColors.length === 0 || isProcessing}
          className="px-8"
        >
          Use This Palette
        </Button>
      </div>
    </div>
  );
}
