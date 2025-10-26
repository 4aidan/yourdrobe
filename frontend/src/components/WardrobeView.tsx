import { useState } from "react";
import { ClothingItem } from "@/types/wardrobe";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, Search, X, Filter } from "lucide-react";
import { toast } from "sonner";

interface WardrobeViewProps {
  clothes: ClothingItem[];
  onRemove: (id: string) => void;
  onUpdate: (item: ClothingItem) => void;
}

export function WardrobeView({ clothes, onRemove }: WardrobeViewProps) {
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<ClothingItem | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredClothes = clothes.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.color.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesType && matchesCategory;
  });

  const handleDelete = () => {
    if (deleteItem) {
      onRemove(deleteItem.id);
      toast.success(`${deleteItem.name} removed from wardrobe`);
      setDeleteItem(null);
      setSelectedItem(null);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
    setCategoryFilter("all");
  };

  const hasActiveFilters = searchTerm || typeFilter !== "all" || categoryFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Your Wardrobe</h2>
          <p className="text-sm text-muted-foreground">
            {filteredClothes.length} of {clothes.length} items
            {hasActiveFilters && " (filtered)"}
          </p>
        </div>
        <Button
          onClick={() => setShowFilters(!showFilters)}
          variant="outline"
          className="border-2 border-black hover:bg-black hover:text-white h-11 px-6 font-bold"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="border-4 border-black p-6 bg-white shadow-brutal space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by name or color..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 border-2 border-black h-12 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-2 border-black h-12 font-medium">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="tops">Tops</SelectItem>
                  <SelectItem value="bottoms">Bottoms</SelectItem>
                  <SelectItem value="outerwear">Outerwear</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessories">Accessories</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wide">Category</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-2 border-black h-12 font-medium">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="border-2 border-black">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="loungewear">Loungewear</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="w-full h-11 font-bold hover:bg-black hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
          )}
        </div>
      )}

      {/* Items Grid - 3 columns */}
      {filteredClothes.length === 0 ? (
        <div className="border-4 border-black p-16 text-center bg-white shadow-brutal">
          <p className="text-lg font-bold mb-2">No items found</p>
          <p className="text-sm text-muted-foreground mb-4">
            {hasActiveFilters
              ? "Try adjusting your filters"
              : "Start by uploading your first item"}
          </p>
          {hasActiveFilters && (
            <Button
              variant="outline"
              onClick={clearFilters}
              className="border-2 border-black hover:bg-black hover:text-white font-bold"
            >
              Clear Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredClothes.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="border-2 border-black cursor-pointer hover-lift-brutal overflow-hidden bg-white group"
            >
              <div className="aspect-square overflow-hidden relative">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs font-bold">
                  {item.timesWorn}×
                </div>
              </div>
              <div className="p-3 space-y-1 border-t-2 border-black">
                <h3 className="font-bold text-sm truncate">{item.name}</h3>
                <p className="text-xs text-muted-foreground capitalize">{item.type} • {item.category}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="border-4 border-black shadow-brutal bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">{selectedItem?.name}</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-wide">Item Details</DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="border-2 border-black overflow-hidden">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full aspect-square object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 border-2 border-black p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Type</p>
                  <p className="font-bold capitalize">{selectedItem.type}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Category</p>
                  <p className="font-bold capitalize">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Color</p>
                  <p className="font-bold capitalize">{selectedItem.color}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Times Worn</p>
                  <p className="font-bold">{selectedItem.timesWorn}×</p>
                </div>
                {selectedItem.lastWorn && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Last Worn</p>
                    <p className="font-bold">{selectedItem.lastWorn}</p>
                  </div>
                )}
              </div>
              <Button
                variant="destructive"
                onClick={() => setDeleteItem(selectedItem)}
                className="w-full h-12 font-bold border-2 border-black"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove from Wardrobe
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <AlertDialogContent className="border-4 border-black shadow-brutal bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-2xl">Remove Item?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Remove "{deleteItem?.name}" from your wardrobe? This will also remove it from all saved outfits.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-2 border-black hover:bg-black hover:text-white font-bold h-12">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-black text-white hover:bg-gray-800 border-2 border-black font-bold h-12"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}