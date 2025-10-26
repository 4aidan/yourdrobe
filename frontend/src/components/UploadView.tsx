import { useState } from "react";
import { ClothingItem } from "@/types/wardrobe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Image as ImageIcon, Camera, Info } from "lucide-react";
import { toast } from "sonner";

interface UploadViewProps {
  onUpload: (item: ClothingItem) => void;
}

export function UploadView({ onUpload }: UploadViewProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ClothingItem["type"]>("tops");
  const [color, setColor] = useState("");
  const [category, setCategory] = useState<ClothingItem["category"]>("casual");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"url" | "camera">("camera");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result as string);
      toast.success("Image uploaded successfully!");
    };
    reader.onerror = () => {
      toast.error("Failed to upload image");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !color || !imageUrl) {
      toast.error("Please fill in all fields and upload an image");
      return;
    }

    const newItem: ClothingItem = {
      id: Date.now().toString(),
      name,
      type,
      color,
      category,
      imageUrl,
      timesWorn: 0,
    };

    onUpload(newItem);
    toast.success(`${name} added to wardrobe!`);

    setName("");
    setColor("");
    setImageUrl("");
    setType("tops");
    setCategory("casual");
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Add New Item</h2>
        <p className="text-sm text-muted-foreground">Catalog a new piece</p>
      </div>

      {/* Photography Tips */}
      <div className="border-2 border-black p-4 bg-gray-50">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="font-bold text-sm">📸 Photography Tips</p>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• <strong>Lay items flat</strong> on a plain surface</li>
              <li>• Use a <strong>white or light background</strong></li>
              <li>• Ensure good lighting (natural light works best)</li>
              <li>• Center the item in the frame</li>
              <li>• Avoid shadows and wrinkles</li>
            </ul>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload Method Toggle */}
        <div className="border-2 border-black p-1 flex">
          <button
            type="button"
            onClick={() => setUploadMethod("camera")}
            className={`flex-1 py-3 px-4 font-bold transition-all ${
              uploadMethod === "camera"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <Camera className="w-4 h-4 inline mr-2" />
            Camera
          </button>
          <button
            type="button"
            onClick={() => setUploadMethod("url")}
            className={`flex-1 py-3 px-4 font-bold transition-all ${
              uploadMethod === "url"
                ? "bg-black text-white"
                : "hover:bg-gray-100"
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-2" />
            URL
          </button>
        </div>

        {/* Camera/File Upload */}
        {uploadMethod === "camera" && (
          <div className="space-y-2">
            <Label htmlFor="fileUpload" className="font-bold uppercase text-xs tracking-wide">Upload Photo</Label>
            <div className="border-2 border-black p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <input
                id="fileUpload"
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="fileUpload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <Camera className="w-12 h-12" />
                <div className="space-y-1">
                  <p className="font-bold">Take Photo or Choose from Gallery</p>
                  <p className="text-xs text-muted-foreground">Flat-lay on plain background recommended</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG, HEIC (Max 5MB)</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Image URL Input */}
        {uploadMethod === "url" && (
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="font-bold uppercase text-xs tracking-wide">Image URL</Label>
            <div className="relative">
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="pl-11 border-2 border-black h-11 font-medium"
              />
              <ImageIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4" />
            </div>
          </div>
        )}

        {/* Image Preview */}
        {imageUrl && (
          <div className="border-2 border-black overflow-hidden">
            <img
              src={imageUrl}
              alt="Preview"
              className="w-full aspect-square object-cover"
              onError={() => toast.error("Invalid image")}
            />
          </div>
        )}

        {/* Item Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="font-bold uppercase text-xs tracking-wide">Item Name</Label>
          <Input
            id="name"
            placeholder="e.g., Black T-Shirt"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-black h-11 font-medium"
          />
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label htmlFor="type" className="font-bold uppercase text-xs tracking-wide">Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as ClothingItem["type"])}>
            <SelectTrigger className="border-2 border-black h-11 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-2 border-black">
              <SelectItem value="tops">Tops</SelectItem>
              <SelectItem value="bottoms">Bottoms</SelectItem>
              <SelectItem value="outerwear">Outerwear</SelectItem>
              <SelectItem value="shoes">Shoes</SelectItem>
              <SelectItem value="accessories">Accessories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label htmlFor="color" className="font-bold uppercase text-xs tracking-wide">Color</Label>
          <Input
            id="color"
            placeholder="e.g., Black, Blue, Red"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="border-2 border-black h-11 font-medium"
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="font-bold uppercase text-xs tracking-wide">Category</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as ClothingItem["category"])}
          >
            <SelectTrigger className="border-2 border-black h-11 font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-2 border-black">
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="formal">Formal</SelectItem>
              <SelectItem value="loungewear">Loungewear</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black h-12 font-bold"
        >
          <Upload className="w-4 h-4 mr-2" />
          Add to Wardrobe
        </Button>
      </form>
    </div>
  );
}