export interface ClothingItem {
  id: string;
  name: string;
  type: "tops" | "bottoms" | "outerwear" | "shoes" | "accessories";
  color: string;
  category: "casual" | "sports" | "formal" | "loungewear";
  imageUrl: string;
  timesWorn: number;
  lastWorn?: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  occasion?: string;
  timesWorn: number;
  lastWorn?: string;
  createdAt: string;
}