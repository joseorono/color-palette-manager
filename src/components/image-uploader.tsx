import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { usePaletteStore } from "@/stores/palette-store";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { PaletteUtils } from "@/lib/palette-utils";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploaderProps {
  onClose: () => void;
}

export function ImageUploader({ onClose }: ImageUploaderProps) {
  const [colorCount, setColorCount] = useState([5]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { setPaletteFromUrl } = usePaletteStore();

  const processImage = useCallback(
    async (file: File) => {
      setIsProcessing(true);

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
            const colors = await PaletteUtils.extractColorsFromImage(
              imageData,
              colorCount[0]
            );
            setPaletteFromUrl(colors);
            toast.success("Colors extracted successfully!");
            onClose();
          }
          setIsProcessing(false);
        };

        img.onerror = () => {
          toast.error("Failed to process image");
          setIsProcessing(false);
        };

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        img.src = url;
      } catch (error) {
        toast.error("Error processing image");
        setIsProcessing(false);
      }
    },
    [colorCount, setPaletteFromUrl, onClose]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file && file.type.startsWith("image/")) {
        processImage(file);
      } else {
        toast.error("Please upload a valid image file");
      }
    },
    [processImage]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div className="space-y-6">
      {/* Color Count Slider */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Number of colors to extract: {colorCount[0]}
        </Label>
        <Slider
          value={colorCount}
          onValueChange={setColorCount}
          max={10}
          min={2}
          step={1}
          className="w-full"
        />
      </div>

      {/* Image Upload Area */}
      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-300 dark:border-gray-600"} ${isProcessing ? "cursor-not-allowed opacity-50" : "hover:border-gray-400"} `}
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
                variant="destructive"
                className="absolute right-2 top-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewUrl(null);
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
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isProcessing}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
