import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
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
import { Checkbox } from "@/components/ui/checkbox";
import { TagInput } from "@/components/tag-input";
import { z } from "zod";
import { paletteFieldsZod } from "@/types/palette";

type PaletteMetadataFormValues = z.infer<
  ReturnType<typeof buildPaletteMetadataFormSchema>
>;

function buildPaletteMetadataFormSchema() {
  // Use only fields defined in paletteFieldsZod
  return z.object({
    name: paletteFieldsZod.name,
    description: paletteFieldsZod.description,
    isPublic: paletteFieldsZod.isPublic,
    tags: paletteFieldsZod.tags,
    isFavorite: paletteFieldsZod.isFavorite ?? z.boolean().default(false),
  });
}

type PaletteMetadataSidebarProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // New optional submit with full metadata
  onSubmit?: (values: PaletteMetadataFormValues) => void;
  initialValues?: Partial<PaletteMetadataFormValues>;
};

export function PaletteMetadataSidebar({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
}: PaletteMetadataSidebarProps) {
  const schema = buildPaletteMetadataFormSchema();
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);

  const form = useForm<PaletteMetadataFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description ?? "",
      isPublic: initialValues?.isPublic ?? false,
      tags: initialValues?.tags ?? [],
      isFavorite: initialValues?.isFavorite ?? false,
    },
    mode: "onChange",
  });

  // Keep tags in sync with form value
  useEffect(() => {
    form.setValue("tags", tags, { shouldValidate: true });
  }, [tags, form]);

  // When initialValues or external names change, reset the form and local tags
  useEffect(() => {
    const nextValues = {
      name: initialValues?.name || "",
      description: initialValues?.description ?? "",
      isPublic: initialValues?.isPublic ?? false,
      tags: initialValues?.tags ?? [],
      isFavorite: initialValues?.isFavorite ?? false,
    } as const;

    // Update local tags state to reflect new props
    setTags(nextValues.tags);

    // Reset the form with new defaults
    form.reset(nextValues);
  }, [initialValues, form]);

  const handleSubmit = (values: PaletteMetadataFormValues) => {
    // Call new onSubmit if provided
    if (onSubmit) onSubmit({ ...values, tags });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full overflow-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Palette Metadata</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Palette Name</FormLabel>
                    <FormControl>
                      <Input
                        id="palette-name"
                        placeholder="Enter palette name..."
                        {...field}
                        className={
                          fieldState.error
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Give your palette a clear, short name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
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
                      />
                    </FormControl>
                    <FormDescription>
                      Optional short description (max 256 chars)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags */}
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags (Optional)</FormLabel>
                    <FormControl>
                      <TagInput
                        tags={tags}
                        onTagsChange={setTags}
                        placeholder="Add tags..."
                        maxTags={10}
                      />
                    </FormControl>
                    <FormDescription>Add up to 10 short tags</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* isPublic */}
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Make this palette public</FormLabel>
                      <FormDescription>
                        Public palettes can be discovered by others
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* isFavorite */}
              <FormField
                control={form.control}
                name="isFavorite"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Add to favorites</FormLabel>
                      <FormDescription>
                        Mark this palette as a favorite
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
