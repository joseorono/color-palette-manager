import { Suspense, useState, useEffect } from "react";
import { Color } from "@/types/palette";
import { ExportFormat } from "@/constants/export";
import { PaletteExport } from "@/lib/palette-export";
import LoaderAnim from "./loaders/loader-anim";

interface ExportPreviewProps {
  colors: Color[];
  format: ExportFormat;
}

interface ExportContentProps {
  colors: Color[];
  format: ExportFormat;
}

function ExportContent({ colors, format }: ExportContentProps) {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generatePreview = async () => {
      setIsLoading(true);
      try {
        const result = await PaletteExport.export(colors, format);

        if (typeof result.content === "string") {
          setContent(result.content);
        } else {
          setContent("Binary content ready for download");
        }
      } catch (error) {
        console.error("Export preview error:", error);
        setContent("Error generating preview");
      } finally {
        setIsLoading(false);
      }
    };

    generatePreview();
  }, [colors, format]);

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <LoaderAnim size={32} />
      </div>
    );
  }

  // For image formats, we'll show a placeholder since we can't easily preview blobs
  if (format === ExportFormat.PNG) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800">
        <div className="text-center">
          <div className="mb-1 text-sm font-medium text-gray-900 dark:text-white">
            Image Preview
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {format.toUpperCase()} format ready for download
          </div>
        </div>
      </div>
    );
  }

  // For text-based formats, show the actual content
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-gray-900 dark:text-white">
        {format.toUpperCase()} Preview
      </div>
      <div className="max-h-96 overflow-auto rounded-lg border bg-gray-50 dark:bg-gray-900">
        <pre className="whitespace-pre-wrap p-3 text-xs text-gray-800 dark:text-gray-200">
          {content}
        </pre>
      </div>
    </div>
  );
}

export function ExportPreview({ colors, format }: ExportPreviewProps) {
  return (
    <div className="h-full">
      <Suspense
        fallback={
          <div className="flex h-32 items-center justify-center">
            <LoaderAnim size={32} />
          </div>
        }
      >
        <ExportContent colors={colors} format={format} />
      </Suspense>
    </div>
  );
}
