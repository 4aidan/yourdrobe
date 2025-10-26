import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WardrobeView } from "@/components/WardrobeView";
import { AnalyticsView } from "@/components/AnalyticsView";
import { UploadView } from "@/components/UploadView";
import { OutfitBuilder } from "@/components/OutfitBuilder";
import { Upload, Shirt, BarChart3, Calendar } from "lucide-react";
import { ClothingItem, Outfit } from "@/types/wardrobe";
import { loadClothes, saveClothes, loadOutfits, saveOutfits } from "@/utils/storage";
import { toast } from "sonner";

const Index = () => {
  const [clothes, setClothes] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [activeTab, setActiveTab] = useState("wardrobe");

  useEffect(() => {
    setClothes(loadClothes());
    setOutfits(loadOutfits());
  }, []);

  useEffect(() => {
    if (clothes.length > 0) {
      saveClothes(clothes);
    }
  }, [clothes]);

  useEffect(() => {
    if (outfits.length > 0) {
      saveOutfits(outfits);
    }
  }, [outfits]);

  const addClothingItem = (item: ClothingItem) => {
    setClothes([...clothes, item]);
    toast.success("Item added! View it in your wardrobe");
    setActiveTab("wardrobe");
  };

  const removeClothingItem = (id: string) => {
    setClothes(clothes.filter((item) => item.id !== id));
    setOutfits(
      outfits.map((outfit) => ({
        ...outfit,
        items: outfit.items.filter((item) => item.id !== id),
      }))
    );
  };

  const updateClothingItem = (updatedItem: ClothingItem) => {
    setClothes(clothes.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
  };

  const saveOutfit = (outfit: Outfit) => {
    setOutfits([...outfits, outfit]);
  };

  const deleteOutfit = (id: string) => {
    setOutfits(outfits.filter((outfit) => outfit.id !== id));
  };

  const markOutfitWorn = (outfitId: string) => {
    const today = new Date().toISOString().split("T")[0];
    
    setOutfits(
      outfits.map((outfit) => {
        if (outfit.id === outfitId) {
          const updatedClothes = clothes.map((item) => {
            if (outfit.items.some((outfitItem) => outfitItem.id === item.id)) {
              return {
                ...item,
                timesWorn: item.timesWorn + 1,
                lastWorn: today,
              };
            }
            return item;
          });
          setClothes(updatedClothes);

          return {
            ...outfit,
            timesWorn: outfit.timesWorn + 1,
            lastWorn: today,
          };
        }
        return outfit;
      })
    );
  };

  return (
    <div className="min-h-screen bg-white pb-28">
      {/* Header */}
      <header className="border-b-4 border-black sticky top-0 z-10 bg-white shadow-brutal-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border-2 border-black bg-white flex items-center justify-center">
              <Shirt className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">yourdrobe</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="wardrobe" className="mt-0">
            <WardrobeView
              clothes={clothes}
              onRemove={removeClothingItem}
              onUpdate={updateClothingItem}
            />
          </TabsContent>

          <TabsContent value="outfits" className="mt-0">
            <OutfitBuilder
              clothes={clothes}
              outfits={outfits}
              onSaveOutfit={saveOutfit}
              onDeleteOutfit={deleteOutfit}
              onMarkWorn={markOutfitWorn}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0">
            <AnalyticsView clothes={clothes} onRemove={removeClothingItem} />
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <UploadView onUpload={addClothingItem} />
          </TabsContent>

          {/* Bottom Navigation */}
          <TabsList className="fixed bottom-6 left-1/2 transform -translate-x-1/2 border-4 border-black p-2 h-auto z-50 bg-white shadow-brutal">
            <TabsTrigger
              value="wardrobe"
              className="px-8 py-4 data-[state=active]:bg-black data-[state=active]:text-white transition-all font-bold flex flex-col items-center gap-1"
            >
              <Shirt className="w-5 h-5" />
              <span className="text-xs">Wardrobe</span>
            </TabsTrigger>
            <TabsTrigger
              value="outfits"
              className="px-8 py-4 data-[state=active]:bg-black data-[state=active]:text-white transition-all font-bold flex flex-col items-center gap-1"
            >
              <Calendar className="w-5 h-5" />
              <span className="text-xs">Outfits</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="px-8 py-4 data-[state=active]:bg-black data-[state=active]:text-white transition-all font-bold flex flex-col items-center gap-1"
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="px-8 py-4 data-[state=active]:bg-black data-[state=active]:text-white transition-all font-bold flex flex-col items-center gap-1"
            >
              <Upload className="w-5 h-5" />
              <span className="text-xs">Upload</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;