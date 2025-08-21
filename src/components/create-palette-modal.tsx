"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import {
  Palette as PaletteIcon,
  Heart,
  Globe,
  Lock,
  AlertCircle,
} from "lucide-react";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingButton } from "@/components/ui/loading-button";
import { TagInput } from "@/components/tag-input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InlineColorPicker } from "@/components/form-fields/inline-color-picker";
import { toast } from "@/hooks/use-toast";
// Only importing what we need
import {
  newPaletteFormSchema,
  Palette,
  type NewPaletteFormValues,
} from "@/types/palette";
import { ColorUtils } from "@/lib/color-utils";
import { PaletteUrlUtils } from "@/lib/palette-url-utils";
import { PaletteUtils } from "@/lib/palette-utils";
import { PaletteDBQueries } from "@/db/queries";

interface CreatePaletteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InsertPaletteMutationResult {
  id: string;
  palette: Omit<Palette, "id" | "createdAt" | "updatedAt">;
}

async function insertPaletteMutation(data: NewPaletteFormValues): Promise<InsertPaletteMutationResult> {

  const newPalette = PaletteUtils.newPaletteFormValuesToPalette(data);
  const paletteId = await PaletteDBQueries.insertPalette(newPalette);

  return {
    id: paletteId,
    palette: newPalette,
  };
}

export function CreatePaletteModal({
  open,
  onOpenChange,
}: CreatePaletteModalProps) {
  const navigate = useNavigate();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<NewPaletteFormValues>({
    resolver: zodResolver(newPaletteFormSchema),
    defaultValues: {
      name: "New Palette",
      description: "Your latest color palette.",
      tags: [],
      isPublic: false,
      isFavorite: false,
      baseColor: ColorUtils.generateRandomColorHex(),
    },
    mode: "onChange", // Validate on change for better UX
  });

  const { mutate: createPalette, isPending } = useMutation({
    mutationFn: insertPaletteMutation,
    onSuccess: (newPalette: InsertPaletteMutationResult) => {
      toast({
        title: "Palette Created!",
        description: `"${newPalette.palette.name}" has been created successfully.`,
      });

      // Close modal
      onOpenChange(false);

      // Reset form
      form.reset();
      setTags([]);

      // Navigate to palette editor using React Router
      navigate(PaletteUrlUtils.generatePaletteIdUrl(newPalette.id));
    },
    onError: (error: Error) => {
      toast({
        title: "Error Creating Palette",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: NewPaletteFormValues) => {
    try {
      setFormError(null);
      const formData = {
        ...values,
        tags: tags,
      };
      // Validate tags length here since it's managed separately from the form
      if (tags.length > 10) {
        setFormError("Maximum 10 tags allowed");
        return;
      }
      // Check if any tags exceed the max length
      const invalidTag = tags.find((tag) => tag.length > 50);
      if (invalidTag) {
        setFormError(
          `Tag "${invalidTag}" exceeds maximum length of 50 characters`
        );
        return;
      }
      createPalette(formData);
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
        setTags([]);
        setFormError(null);
      }
    }
  };

  // Update form tags when tags state changes
  useEffect(() => {
    form.setValue("tags", tags, {
      shouldValidate: true,
    });
  }, [tags, form]);

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PaletteIcon className="h-5 w-5" />
            Create New Palette
          </DialogTitle>
          <DialogDescription>
            Create a new color palette to organize your favorite colors. You can
            always edit it later.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* General Form Error Alert */}
            {formError && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Palette Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter palette name"
                      {...field}
                      disabled={isPending}
                      className={
                        fieldState.error
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Give your palette a memorable name (2-100 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Base Color Field */}
            <FormField
              control={form.control}
              name="baseColor"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Base Color</FormLabel>
                  <FormControl>
                    <InlineColorPicker
                      placeholder="Enter base color (e.g. #4285F4)"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      disabled={isPending}
                      className={
                        fieldState.error
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter the base color for your palette or use the color picker
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your palette..."
                      className={`min-h-[80px] ${fieldState.error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the inspiration or use case for this palette
                    (10-500 characters)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags Field */}
            <FormField
              control={form.control}
              name="tags"
              render={() => (
                <FormItem>
                  <FormLabel>Tags (Optional)</FormLabel>
                  <FormControl>
                    <div
                      className={
                        tags.length > 10
                          ? "rounded-md border border-red-500 p-1"
                          : ""
                      }
                    >
                      <TagInput
                        tags={tags}
                        onTagsChange={setTags}
                        placeholder="Add tags to organize your palette..."
                        maxTags={10}
                        disabled={isPending}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Add tags to help categorize and find your palette later (max
                    10 tags)
                  </FormDescription>
                  {tags.length > 10 && (
                    <p className="text-sm font-medium text-red-500">
                      Maximum 10 tags allowed
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Checkboxes */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        {field.value ? (
                          <Globe className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-500" />
                        )}
                        Make this palette public
                      </FormLabel>
                      <FormDescription>
                        Public palettes can be discovered and used by other
                        users
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFavorite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        <Heart
                          className={`h-4 w-4 ${field.value ? "fill-current text-red-500" : "text-gray-500"}`}
                        />
                        Add to favorites
                      </FormLabel>
                      <FormDescription>
                        Mark this palette as a favorite for quick access
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2 pt-2">
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
                loadingText="Creating..."
                className="min-w-[140px]"
              >
                Let's Create it!
              </LoadingButton>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
