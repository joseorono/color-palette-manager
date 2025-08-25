// deprecated: just here for reference!
// import { useEffect, useState } from "react";
// import { usePaletteStore } from "@/stores/palette-store";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";

// import { Save, Share, Upload, Check, Link, ChevronDown } from "lucide-react";
// import { toast } from "sonner";
// import { ImageUploader } from "./image-uploader";
// import { DebouncedSlider } from "./ui/debounced-slider";
// import { ShareUtils } from "@/lib/share-utils";

// export function PaletteControls() {
//   const {
//     currentPalette,
//     generateNewPalette,
//     savePalette,
//     isSaved,
//     hasUnsavedChanges,
//   } = usePaletteStore();
//   const [paletteSize, setPaletteSize] = useState(currentPalette?.colors.length || 5);
//   const [paletteName, setPaletteName] = useState("");
//   const [isSaveOpen, setIsSaveOpen] = useState(false);
//   const [isUploadOpen, setIsUploadOpen] = useState(false);

//   const handleSizeChange = (value: number[]) => {
//     generateNewPalette(value[0]);
//     setPaletteSize(value[0]); // so the change looks immediate, without waiting for the useEffect
//   };

//   useEffect(() => {
//     setPaletteSize(currentPalette?.colors.length || 5);
//   }, [currentPalette]);

//   const handleSave = async () => {
//     if (!paletteName.trim()) {
//       toast.error("Please enter a palette name");
//       return;
//     }

//     try {
//       await savePalette(paletteName.trim());
//       toast.success(
//         currentPalette?.id
//           ? "Palette updated successfully!"
//           : "Palette saved successfully!"
//       );
//       setIsSaveOpen(false);
//       setPaletteName("");
//     } catch (error) {
//       toast.error("Failed to save palette");
//     }
//   };

//   const handleCopyUrl = async () => {
//     if (!currentPalette) return;
//     const result = await ShareUtils.copyUrlToClipboard(
//       ShareUtils.generateEditorUrl(currentPalette),
//       "Palette URL copied to clipboard!"
//     );
//     if (result.success) {
//       toast.success(result.message);
//     } else {
//       toast.error(result.message);
//     }
//   };

//   const handleShare = async () => {
//     if (!currentPalette) return;
//     const result = await ShareUtils.sharePalette(currentPalette);
//     if (result.success) {
//       toast.success(result.message);
//     } else if (result.method !== 'error') {
//       toast.success(result.message);
//     }
//   };

//   return (
//     <div className="mb-8 flex flex-wrap justify-center gap-4">
//       {/* Palette Size Control */}
//       <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
//         <DebouncedSlider
//           value={[paletteSize]}
//           onChange={handleSizeChange}
//           debounce={500}
//           max={16}
//           min={2}
//           step={1}
//           className="w-32"
//         />
//       </div>

//       {/* Save Palette */}
//       <Dialog open={isSaveOpen} onOpenChange={setIsSaveOpen}>
//         <DialogTrigger asChild>
//           <Button
//             variant={hasUnsavedChanges ? "default" : "outline"}
//             className="gap-2"
//           >
//             {isSaved && !hasUnsavedChanges ? (
//               <Check className="h-4 w-4" />
//             ) : (
//               <Save className="h-4 w-4" />
//             )}
//             {currentPalette?.id ? "Save Changes" : "Save Palette"}
//             {hasUnsavedChanges && <span className="ml-1 text-xs">•</span>}
//           </Button>
//         </DialogTrigger>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>
//               {currentPalette?.id ? "Update Palette" : "Save Palette"}
//             </DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="palette-name">Palette Name</Label>
//               <Input
//                 id="palette-name"
//                 value={paletteName}
//                 onChange={(e) => setPaletteName(e.target.value)}
//                 placeholder="Enter palette name..."
//               />
//             </div>
//             <div className="flex justify-end gap-3">
//               <Button variant="outline" onClick={() => setIsSaveOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleSave}>
//                 {currentPalette?.id ? "Update" : "Save"}
//               </Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Share Palette */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" className="gap-2">
//             <Share className="h-4 w-4" />
//             Share
//             <ChevronDown className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end">
//           <DropdownMenuItem onClick={handleShare}>
//             <Share className="mr-2 h-4 w-4" />
//             Share Palette via Apps
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={handleCopyUrl}>
//             <Link className="mr-2 h-4 w-4" />
//             Copy Shareable URL
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Upload Image */}
//       <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
//         <DialogTrigger asChild>
//           <Button variant="outline" className="gap-2">
//             <Upload className="h-4 w-4" />
//             Extract from Image
//           </Button>
//         </DialogTrigger>
//         <DialogContent className="max-w-lg">
//           <DialogHeader>
//             <DialogTitle>Extract Colors from Image</DialogTitle>
//           </DialogHeader>
//           <ImageUploader onClose={() => setIsUploadOpen(false)} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
