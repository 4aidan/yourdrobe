import { ClothingItem, Outfit } from "@/types/wardrobe";

/**
 * Storage utilities for YourDrobe
 * 
 * Note: These functions are placeholders for Sprint 0.
 * In future sprints, these will be replaced with API calls to the backend.
 * For now, they maintain localStorage compatibility for the existing frontend.
 */

const CLOTHES_KEY = "wardrobe_clothes";
const OUTFITS_KEY = "wardrobe_outfits";

export const loadClothes = (): ClothingItem[] => {
  const stored = localStorage.getItem(CLOTHES_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Return empty array - no initial mock data
  return [];
};

export const saveClothes = (clothes: ClothingItem[]): void => {
  localStorage.setItem(CLOTHES_KEY, JSON.stringify(clothes));
};

export const loadOutfits = (): Outfit[] => {
  const stored = localStorage.getItem(OUTFITS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveOutfits = (outfits: Outfit[]): void => {
  localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
};