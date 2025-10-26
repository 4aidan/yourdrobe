/**
 * API Configuration
 *
 * Central configuration for all API endpoints.
 * This file defines the base URL for the backend API.
 */

export const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * API endpoint paths
 */
export const API_ENDPOINTS = {
  // Clothing Items
  ITEMS: {
    BASE: `${API_BASE_URL}/items`,
    BY_ID: (id: string) => `${API_BASE_URL}/items/${id}`,
  },
  
  // Outfits
  OUTFITS: {
    BASE: `${API_BASE_URL}/outfits`,
    BY_ID: (id: string) => `${API_BASE_URL}/outfits/${id}`,
    WEAR: (id: string) => `${API_BASE_URL}/outfits/${id}/wear`,
  },
  
  // Analytics
  ANALYTICS: {
    SUMMARY: `${API_BASE_URL}/analytics/summary`,
  },
  
  // Upload
  UPLOAD: `${API_BASE_URL}/upload`,
};