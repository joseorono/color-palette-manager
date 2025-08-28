import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { ImageAnalyzer } from "@/lib/image-analyzer";
import { HexColorString } from "@/types/palette";
import { toast } from "sonner";

export type ExtractionAlgorithm = 'new' | 'old';

interface UseImageColorExtractionOptions {
  initialColorCount?: number;
  initialAlgorithm?: ExtractionAlgorithm;
  autoExtractOnUpload?: boolean;
}

interface UseImageColorExtractionReturn {
  // State
  colorCount: number[];
  setColorCount: (count: number[]) => void;
  isProcessing: boolean;
  previewUrl: string | null;
  algorithm: ExtractionAlgorithm;
  setAlgorithm: (algorithm: ExtractionAlgorithm) => void;
  extractedColors: HexColorString[];
  uploadedFile: File | null;
  
  // Actions
  extractColors: () => Promise<void>;
  clearImage: () => void;
  
  // Dropzone
  getRootProps: () => any;
  getInputProps: () => any;
  isDragActive: boolean;
}

/**
 * Custom hook for image color extraction functionality
 * Encapsulates all the logic for uploading images, extracting colors, and managing state
 */
export function useImageColorExtraction(
  options: UseImageColorExtractionOptions = {}
): UseImageColorExtractionReturn {
  const {
    initialColorCount = 5,
    initialAlgorithm = 'new',
    autoExtractOnUpload = true
  } = options;

  const [colorCount, setColorCount] = useState([initialColorCount]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<ExtractionAlgorithm>(initialAlgorithm);
  const [extractedColors, setExtractedColors] = useState<HexColorString[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const extractColors = useCallback(async () => {
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

        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData) {
          let colors: HexColorString[];

          switch (algorithm) {
            case 'old':
              colors = await ImageAnalyzer.extractColors_old(imageData, colorCount[0]);
              break;
            default:
              colors = await ImageAnalyzer.extractColors(imageData, colorCount[0]);
              break;
          }

          setExtractedColors(colors);
          toast.success(`Extracted ${colors.length} colors successfully!`);
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
  }, [uploadedFile, colorCount, algorithm]);

  const handleImageUpload = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setUploadedFile(file);
    setExtractedColors([]);

    // Auto-extract colors when image is uploaded (if enabled)
    if (autoExtractOnUpload) {
      setTimeout(() => {
        extractColors();
      }, 100);
    }
  }, [extractColors, autoExtractOnUpload]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type.startsWith("image/")) {
      handleImageUpload(file);
    } else {
      toast.error("Please upload a valid image file");
    }
  }, [handleImageUpload]);

  const clearImage = useCallback(() => {
    setPreviewUrl(null);
    setUploadedFile(null);
    setExtractedColors([]);
  }, []);

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

  return {
    // State
    colorCount,
    setColorCount,
    isProcessing,
    previewUrl,
    algorithm,
    setAlgorithm,
    extractedColors,
    uploadedFile,
    
    // Actions
    extractColors,
    clearImage,
    
    // Dropzone
    getRootProps,
    getInputProps,
    isDragActive,
  };
}
