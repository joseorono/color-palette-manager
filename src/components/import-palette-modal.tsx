"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Upload, AlertCircle, FileJson, Info, FileUp } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingButton } from "@/components/ui/loading-button";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PaletteImport } from "@/lib/palette-import";
import { InsertPaletteMutationResult, Palette } from "@/types/palette";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";
import { PaletteDBQueries } from "@/db/queries";

interface ImportPaletteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Schema for the import form
const importPaletteFormSchema = z.object({
  jsonData: z.string().min(1, "JSON data is required"),
});

type ImportPaletteFormValues = z.infer<typeof importPaletteFormSchema>;

// Mock function - replace with your actual database insertion
async function insertImportedPaletteMutation(
  palette: Palette
): Promise<InsertPaletteMutationResult> {
  // In a real implementation, this would save to your database
  const paletteId = await PaletteDBQueries.insertPalette(palette);
  return {
    id: paletteId,
    palette: palette,
  };
}

export default function ImportPaletteModal({
  open,
  onOpenChange,
}: ImportPaletteModalProps) {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isValidJson, setIsValidJson] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<string>("text");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const form = useForm<ImportPaletteFormValues>({
    resolver: zodResolver(importPaletteFormSchema),
    defaultValues: {
      jsonData: "",
    },
    mode: "onChange",
  });

  const { mutate: importPalette, isPending } = useMutation({
    mutationFn: async (data: ImportPaletteFormValues) => {
      const palette = await PaletteImport.fromJSON(data.jsonData);
      return insertImportedPaletteMutation(palette);
    },
    onSuccess: (result: InsertPaletteMutationResult) => {
      toast.success(`"${result.palette.name}" has been imported successfully.`);

      // Close modal
      onOpenChange(false);

      // Reset form
      form.reset();

      // Navigate to palette editor using React Router
      navigate(PaletteUrlUtils.generatePaletteIdUrl(result.id));
    },
    onError: (error: Error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
      setFormError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    },
  });

  const onSubmit = (values: ImportPaletteFormValues) => {
    try {
      setFormError(null);
      importPalette(values);
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is JSON
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      setFormError("Please upload a valid JSON file");
      return;
    }

    try {
      setFormError(null);
      const content = await file.text();
      
      // Validate JSON
      const isValid = validateJson(content);
      if (isValid) {
        // Store the file and content for later use
        setSelectedFile(file);
        setFileContent(content);
        // Set the JSON content in the form
        form.setValue("jsonData", content);
      }
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to read the file"
      );
    }
  };

  const handleImportFile = () => {
    if (fileContent) {
      importPalette({ jsonData: fileContent });
    }
  };

  const handleModalClose = (newOpen: boolean) => {
    if (!isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Reset form when closing
        form.reset();
        setFormError(null);
        setIsValidJson(null);
        setActiveTab("text");
        setSelectedFile(null);
        setFileContent(null);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const validateJson = (jsonString: string) => {
    const isValid = PaletteImport.isValidPaletteJSON(jsonString);
    setIsValidJson(isValid);
    return isValid;
  };

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-md max-sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center px-5 justify-center mb-5 gap-2">
            <Upload className="h-5 w-5" />
            Import Palette
          </DialogTitle>
          <DialogDescription>
            Import a color palette from JSON data. The JSON must be in the
            format exported by this application.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="flex items-center gap-2">
              <FileJson className="h-4 w-4" />
              Paste JSON
            </TabsTrigger>
            <TabsTrigger value="file" className="flex items-center gap-2">
              <FileUp className="h-4 w-4" />
              Upload File
            </TabsTrigger>
          </TabsList>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* General Form Error Alert */}
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {/* JSON Validation Status */}
            {isValidJson === true && (
              <Alert
                variant="default"
                className="mb-6 border-green-500 bg-green-50"
              >
                <Info className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  Valid palette JSON detected! Ready to import.
                </AlertDescription>
              </Alert>
            )}

            {isValidJson === false && (
              <Alert
                variant="default"
                className="mb-6 border-amber-500 bg-amber-50"
              >
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-700">
                  Invalid palette JSON format. Please check your data.
                </AlertDescription>
              </Alert>
            )}

            <TabsContent value="text" className="space-y-4">
              {/* JSON Data Field */}
              <FormField
                control={form.control}
                name="jsonData"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <FileJson className="h-4 w-4" />
                      Palette JSON Data
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Paste JSON data here... (e.g., {"name":"My Palette","colors":[{"hex":"#ff0000","locked":false}]})'
                        className={`min-h-[200px] font-mono text-sm ${
                          fieldState.error
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value) {
                            validateJson(e.target.value);
                          } else {
                            setIsValidJson(null);
                          }
                        }}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormDescription>
                      Paste the JSON data exported from this application or
                      another compatible source
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="file" className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <FileUp className="h-8 w-8 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2">Upload JSON File</h3>
                {selectedFile ? (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm font-medium text-green-800">
                      File selected: {selectedFile.name}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {(selectedFile.size / 1024).toFixed(1)} KB • Ready to import
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mb-4">
                    Select a .json file containing palette data
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isPending}
                />
                <Button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {selectedFile ? "Change File" : "Select File"}
                </Button>
                <p className="text-xs text-gray-400 mt-4">
                  Maximum file size: 1MB
                </p>
              </div>
            </TabsContent>

            {/* Submit Button - Only show for text tab */}
            {activeTab === "text" && (
              <div className="flex space-x-2 pt-4 justify-center">
                <LoadingButton
                  type="submit"
                  loading={isPending}
                  loadingText="Importing..."
                  className="min-w-[140px]"
                  disabled={isPending || isValidJson === false}
                >
                  Import Palette
                </LoadingButton>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleModalClose(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            )}

            {/* Import and Cancel Buttons for file tab */}
            {activeTab === "file" && (
              <div className="flex space-x-2 pt-4 justify-center">
                <LoadingButton
                  type="button"
                  loading={isPending}
                  loadingText="Importing..."
                  onClick={handleImportFile}
                  disabled={isPending || !selectedFile || isValidJson !== true}
                  className="min-w-[140px]"
                >
                  Import Palette
                </LoadingButton>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleModalClose(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
