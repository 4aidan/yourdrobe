import { ClothingItem } from "@/types/wardrobe";

/**
 * Generates an AI outfit by selecting items that work well together
 * Prioritizes matching categories and complementary colors
 */
export function generateAIOutfit(clothes: ClothingItem[]): ClothingItem[] {
  if (clothes.length === 0) return [];

  const outfit: ClothingItem[] = [];
  const types: ClothingItem["type"][] = ["tops", "bottoms", "outerwear", "shoes", "accessories"];

  // Group clothes by type
  const clothesByType = types.reduce((acc, type) => {
    acc[type] = clothes.filter((item) => item.type === type);
    return acc;
  }, {} as Record<ClothingItem["type"], ClothingItem[]>);

  // Try to pick items from the same category for cohesion
  const categories: ClothingItem["category"][] = ["casual", "sports", "formal", "loungewear"];
  let selectedCategory: ClothingItem["category"] | null = null;

  // Find the category with the most items
  const categoryCounts = categories.map((cat) => ({
    category: cat,
    count: clothes.filter((item) => item.category === cat).length,
  }));
  categoryCounts.sort((a, b) => b.count - a.count);
  
  if (categoryCounts[0].count >= 2) {
    selectedCategory = categoryCounts[0].category;
  }

  // Select one item from each type
  for (const type of types) {
    const availableItems = clothesByType[type];
    if (availableItems.length === 0) continue;

    let selectedItem: ClothingItem | null = null;

    // Try to match the selected category first
    if (selectedCategory) {
      const matchingItems = availableItems.filter((item) => item.category === selectedCategory);
      if (matchingItems.length > 0) {
        selectedItem = matchingItems[Math.floor(Math.random() * matchingItems.length)];
      }
    }

    // If no matching category item, pick randomly
    if (!selectedItem) {
      selectedItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    }

    outfit.push(selectedItem);
  }

  return outfit;
}

/**
 * Generates a name for an outfit based on its items and optional date
 */
export function generateOutfitName(items: ClothingItem[], date?: Date): string {
  if (date) {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  // Determine outfit style based on categories
  const categories = items.map((item) => item.category);
  
  if (categories.includes("formal")) {
    return "Formal Look";
  }
  
  if (categories.includes("sports")) {
    return "Active Wear";
  }
  
  if (categories.includes("loungewear")) {
    return "Casual Day";
  }

  // Default based on dominant colors
  const colors = items.map((item) => item.color.toLowerCase());
  const colorCounts = colors.reduce((acc, color) => {
    acc[color] = (acc[color] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantColor = Object.entries(colorCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0];

  if (dominantColor) {
    return `${dominantColor.charAt(0).toUpperCase() + dominantColor.slice(1)} Outfit`;
  }

  return "Daily Outfit";
}