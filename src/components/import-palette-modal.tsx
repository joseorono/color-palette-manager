"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Upload, AlertCircle, FileJson, Info } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { toast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { PaletteImport } from "@/lib/palette-import";
import { Palette } from "@/types/palette";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";

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
): Promise<Palette> {
  // In a real implementation, this would save to your database
  return palette;
}

export default function ImportPaletteModal({
  open,
  onOpenChange,
}: ImportPaletteModalProps) {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const [isValidJson, setIsValidJson] = useState<boolean | null>(null);

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
    onSuccess: (importedPalette: Palette) => {
      toast({
        title: "Palette Imported!",
        description: `"${importedPalette.name}" has been imported successfully.`,
      });

      // Close modal
      onOpenChange(false);

      // Reset form
      form.reset();

      // Navigate to palette editor using React Router
      navigate(PaletteUrlUtils.generatePaletteIdUrl(importedPalette.id));
    },
    onError: (error: Error) => {
      toast({
        title: "Error Importing Palette",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
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

  const handleModalClose = (newOpen: boolean) => {
    if (!isPending) {
      onOpenChange(newOpen);
      if (!newOpen) {
        // Reset form when closing
        form.reset();
        setFormError(null);
        setIsValidJson(null);
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Palette
          </DialogTitle>
          <DialogDescription>
            Import a color palette from JSON data. The JSON must be in the
            format exported by this application.
          </DialogDescription>
        </DialogHeader>

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

            {/* Submit Button */}
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleModalClose(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                loading={isPending}
                loadingText="Importing..."
                className="min-w-[140px]"
                disabled={isPending || isValidJson === false}
              >
                Import Palette
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
