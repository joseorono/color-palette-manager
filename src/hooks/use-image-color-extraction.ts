import { useCallback, useState, useEffect, useRef } from "react";
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

  /**
   * Validates if the file is a proper image by attempting to load it
   * @param file - File to validate
   * @returns Promise resolving to boolean indicating if file is valid
   */
  const validateImage = useCallback((file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      // Check file size first (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image is too large. Maximum size is 10MB.");
        resolve(false);
        return;
      }

      // Create image element to test loading
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      // Set timeout to handle stalled loads
      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
        toast.error("Image loading timed out. The file might be corrupted.");
        resolve(false);
      }, 5000); // 5 second timeout

      img.onload = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        
        // Check if image has valid dimensions
        if (img.width === 0 || img.height === 0) {
          toast.error("Invalid image dimensions.");
          resolve(false);
          return;
        }
        
        resolve(true);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(objectUrl);
        toast.error("The file has an image extension but is not a valid image.");
        resolve(false);
      };

      img.src = objectUrl;
    });
  }, []);

  // Track current object URL for cleanup
  const currentObjectUrl = useRef<string | null>(null);

  // Cleanup function to prevent memory leaks
  const cleanupObjectUrl = useCallback(() => {
    if (currentObjectUrl.current) {
      URL.revokeObjectURL(currentObjectUrl.current);
      currentObjectUrl.current = null;
    }
  }, []);

  // Effect to clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      cleanupObjectUrl();
    };
  }, [cleanupObjectUrl]);

  const extractColors = useCallback(async () => {
    if (!uploadedFile) return;

    setIsProcessing(true);
    setExtractedColors([]);

    try {
      // Validate the image before processing
      const isValid = await validateImage(uploadedFile);
      if (!isValid) {
        setIsProcessing(false);
        return;
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      // Clean up previous object URL
      cleanupObjectUrl();
      
      // Create new object URL
      const url = URL.createObjectURL(uploadedFile);
      currentObjectUrl.current = url;

      // Set timeout to handle stalled loads
      const timeoutId = setTimeout(() => {
        toast.error("Image processing timed out. Try a smaller or less complex image.");
        setIsProcessing(false);
        cleanupObjectUrl();
      }, 15000); // 15 second timeout for processing

      img.onload = async () => {
        clearTimeout(timeoutId);
        
        try {
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

            if (colors.length > 0) {
              setExtractedColors(colors);
              toast.success(`Extracted ${colors.length} colors successfully!`);
            } else {
              toast.error("Could not extract any colors from this image.");
            }
          } else {
            toast.error("Failed to get image data from canvas.");
          }
        } catch (err) {
          console.error("Error during image processing:", err);
          toast.error("Error processing image data.");
        } finally {
          setIsProcessing(false);
          cleanupObjectUrl();
        }
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        toast.error("Failed to load image for processing.");
        setIsProcessing(false);
        cleanupObjectUrl();
      };

      img.src = url;
    } catch (error) {
      console.error("Unexpected error during image extraction:", error);
      toast.error("Unexpected error processing image.");
      setIsProcessing(false);
      cleanupObjectUrl();
    }
  }, [uploadedFile, colorCount, algorithm, validateImage, cleanupObjectUrl]);

  const handleImageUpload = useCallback((file: File) => {
    // Clean up previous preview URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    
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
  }, [extractColors, autoExtractOnUpload, previewUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) {
      toast.error("No file selected");
      return;
    }
    
    // Check MIME type first
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, GIF, etc.)");
      return;
    }
    
    // Additional check for zero-byte files
    if (file.size === 0) {
      toast.error("The file is empty and cannot be processed");
      return;
    }
    
    handleImageUpload(file);
  }, [handleImageUpload]);

  const clearImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    cleanupObjectUrl();
    setPreviewUrl(null);
    setUploadedFile(null);
    setExtractedColors([]);
  }, [previewUrl, cleanupObjectUrl]);

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
