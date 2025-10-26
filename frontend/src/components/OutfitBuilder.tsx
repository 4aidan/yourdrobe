import { useState } from "react";
import { ClothingItem, Outfit } from "@/types/wardrobe";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Trash2, Check, Sparkles, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { generateAIOutfit } from "@/utils/aiOutfitGenerator";
import { CalendarView } from "@/components/CalendarView";
import { format } from "date-fns";

interface OutfitBuilderProps {
  clothes: ClothingItem[];
  outfits: Outfit[];
  onSaveOutfit: (outfit: Outfit) => void;
  onDeleteOutfit: (id: string) => void;
  onMarkWorn: (outfitId: string) => void;
}

export function OutfitBuilder({
  clothes,
  outfits,
  onSaveOutfit,
  onDeleteOutfit,
  onMarkWorn,
}: OutfitBuilderProps) {
  const [isBuilding, setIsBuilding] = useState(false);
  const [isAIMode, setIsAIMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(undefined);
  const [selectingType, setSelectingType] = useState<ClothingItem["type"] | null>(null);
  const [viewingOutfit, setViewingOutfit] = useState<Outfit | null>(null);
  const [deleteOutfit, setDeleteOutfit] = useState<Outfit | null>(null);

  const types: ClothingItem["type"][] = ["tops", "bottoms", "outerwear", "shoes", "accessories"];

  const getItemForType = (type: ClothingItem["type"]) => {
    return selectedItems.find((item) => item.type === type);
  };

  const handleSelectItem = (item: ClothingItem) => {
    const filtered = selectedItems.filter((i) => i.type !== item.type);
    setSelectedItems([...filtered, item]);
    setSelectingType(null);
  };

  const generateOutfitName = (items: ClothingItem[], date?: Date): string => {
    if (date) {
      return format(date, "MMM d, yyyy");
    }
    
    const categories = items.map(item => item.category);
    if (categories.includes("formal")) return "Formal Look";
    if (categories.includes("sports")) return "Active Wear";
    if (categories.includes("loungewear")) return "Casual Day";
    return "Daily Outfit";
  };

  const handleGenerateAI = () => {
    if (clothes.length < 2) {
      toast.error("Add more items to your wardrobe to use AI generation");
      return;
    }

    const aiOutfit = generateAIOutfit(clothes);
    
    if (aiOutfit.length === 0) {
      toast.error("Couldn't generate an outfit. Try adding more items!");
      return;
    }

    setSelectedItems(aiOutfit);
    setIsAIMode(true);
    setIsBuilding(true);
    toast.success("AI outfit generated! ✨");
  };

  const handleRegenerateAI = () => {
    const aiOutfit = generateAIOutfit(clothes);
    setSelectedItems(aiOutfit);
    toast.success("New outfit generated! ✨");
  };

  const handleSaveOutfit = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select at least one item");
      return;
    }

    const outfitName = generateOutfitName(selectedItems, scheduledDate);

    const newOutfit: Outfit = {
      id: Date.now().toString(),
      name: outfitName,
      items: selectedItems,
      timesWorn: 0,
      createdAt: new Date().toISOString(),
      scheduledDate: scheduledDate ? format(scheduledDate, "yyyy-MM-dd") : undefined,
    };

    onSaveOutfit(newOutfit);
    toast.success(`Outfit saved!`);
    setIsBuilding(false);
    setIsAIMode(false);
    setSelectedItems([]);
    setScheduledDate(undefined);
  };

  const handleCloseBuilder = () => {
    setIsBuilding(false);
    setIsAIMode(false);
    setSelectedItems([]);
    setScheduledDate(undefined);
  };

  const handleDelete = () => {
    if (deleteOutfit) {
      onDeleteOutfit(deleteOutfit.id);
      toast.success(`Outfit deleted`);
      setDeleteOutfit(null);
      setViewingOutfit(null);
    }
  };

  const handleMarkWorn = (outfit: Outfit) => {
    onMarkWorn(outfit.id);
    toast.success(`Marked as worn today!`);
    setViewingOutfit(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">Outfit Calendar</h2>
          <p className="text-sm text-muted-foreground">Plan your outfits by date</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={handleGenerateAI}
            className="bg-black text-white hover:bg-gray-800 border-2 border-black h-11 px-6 font-bold"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Create
          </Button>
          <Button
            onClick={() => {
              setIsAIMode(false);
              setIsBuilding(true);
            }}
            variant="outline"
            className="border-2 border-black hover:bg-black hover:text-white h-11 px-6 font-bold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Manual
          </Button>
        </div>
      </div>

      {/* Calendar View */}
      <CalendarView outfits={outfits} onSelectOutfit={setViewingOutfit} />

      {/* Outfit Builder Dialog */}
      <Dialog open={isBuilding} onOpenChange={handleCloseBuilder}>
        <DialogContent className="border-4 border-black shadow-brutal max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-bold text-2xl">
              {isAIMode && <Sparkles className="w-6 h-6" />}
              {isAIMode ? "AI Generated Outfit" : "Create New Outfit"}
            </DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-wide">
              {isAIMode 
                ? "AI selected items that work well together" 
                : "Select items to build your outfit"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            {/* Date Picker */}
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-wide">Schedule Date (Optional)</p>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-medium border-2 border-black hover:bg-black hover:text-white h-12"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-2 border-black shadow-brutal bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Item Slots - 3 columns */}
            <div className="grid grid-cols-3 gap-3">
              {types.map((type) => {
                const item = getItemForType(type);
                return (
                  <div key={type} className="space-y-2">
                    <p className="capitalize text-xs font-bold uppercase tracking-wide">{type}</p>
                    <button
                      onClick={() => setSelectingType(type)}
                      className="w-full aspect-square border-2 border-black hover:bg-gray-100 transition-colors flex items-center justify-center relative overflow-hidden bg-white"
                    >
                      {item ? (
                        <>
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                          {isAIMode && (
                            <div className="absolute top-2 right-2 bg-black text-white p-1">
                              <Sparkles className="w-3 h-3" />
                            </div>
                          )}
                        </>
                      ) : (
                        <Plus className="w-8 h-8 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isAIMode && (
                <Button
                  variant="outline"
                  onClick={handleRegenerateAI}
                  className="border-2 border-black hover:bg-black hover:text-white h-12 font-bold"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleCloseBuilder}
                className="flex-1 border-2 border-black hover:bg-black hover:text-white h-12 font-bold"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveOutfit}
                className="flex-1 bg-black text-white hover:bg-gray-800 border-2 border-black h-12 font-bold"
              >
                Save Outfit
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Item Selection Dialog */}
      <Dialog open={!!selectingType} onOpenChange={() => setSelectingType(null)}>
        <DialogContent className="border-4 border-black shadow-brutal max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle className="capitalize font-bold text-2xl">Select {selectingType}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {clothes
              .filter((item) => item.type === selectingType)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="border-2 border-black hover:bg-gray-100 transition-colors overflow-hidden bg-white"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full aspect-square object-cover"
                  />
                  <p className="p-2 text-xs font-medium truncate border-t-2 border-black">{item.name}</p>
                </button>
              ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Outfit Detail Dialog */}
      <Dialog open={!!viewingOutfit} onOpenChange={() => setViewingOutfit(null)}>
        <DialogContent className="border-4 border-black shadow-brutal bg-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">{viewingOutfit?.name}</DialogTitle>
            <DialogDescription className="text-xs uppercase tracking-wide">Outfit Details</DialogDescription>
          </DialogHeader>
          {viewingOutfit && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {viewingOutfit.items.map((item) => (
                  <div key={item.id} className="border-2 border-black overflow-hidden bg-white">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full aspect-square object-cover"
                    />
                    <p className="p-2 text-xs font-medium truncate border-t-2 border-black">{item.name}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 border-2 border-black p-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Items</p>
                  <p className="font-bold">{viewingOutfit.items.length}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Times Worn</p>
                  <p className="font-bold">{viewingOutfit.timesWorn}×</p>
                </div>
                {viewingOutfit.scheduledDate && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Scheduled</p>
                    <p className="font-bold">
                      {new Date(viewingOutfit.scheduledDate + "T00:00:00").toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                )}
                {viewingOutfit.lastWorn && (
                  <div className="col-span-2">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground mb-1">Last Worn</p>
                    <p className="font-bold">{viewingOutfit.lastWorn}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleMarkWorn(viewingOutfit)}
                  className="flex-1 bg-black text-white hover:bg-gray-800 border-2 border-black h-12 font-bold"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Wore Today
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteOutfit(viewingOutfit)}
                  className="flex-1 h-12 font-bold border-2 border-black"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteOutfit} onOpenChange={() => setDeleteOutfit(null)}>
        <AlertDialogContent className="border-4 border-black shadow-brutal bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-2xl">Delete Outfit?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Delete "{deleteOutfit?.name}"? This will not affect individual clothing items.
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}