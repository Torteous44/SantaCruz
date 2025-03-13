import { Photo } from '../types';
import { floors } from './data';

// Stores preloaded photo data
let preloadedPhotos: Photo[] | null = null;
let isLoading = false;

/**
 * Preloads photos from the API before the app renders
 * Returns a promise that resolves when photos are loaded
 */
export const preloadPhotos = async (): Promise<Photo[]> => {
  // If we already have preloaded photos, return them immediately
  if (preloadedPhotos) {
    return Promise.resolve(preloadedPhotos);
  }
  
  // If already loading, return a promise that will resolve when loading completes
  if (isLoading) {
    return new Promise((resolve) => {
      // Check every 100ms if photos are loaded
      const checkInterval = setInterval(() => {
        if (preloadedPhotos) {
          clearInterval(checkInterval);
          resolve(preloadedPhotos);
        }
      }, 100);
    });
  }
  
  isLoading = true;
  
  try {
    // Check if we're in development mode with no server
    if (process.env.REACT_APP_USE_MOCK_DATA === "true") {
      console.log("Using mock data instead of server for preloading");
      isLoading = false;
      return Promise.resolve([]);
    }

    // Use environment variable for API URL with fallback
    const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

    const response = await fetch(`${apiUrl}/photos?status=approved`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to preload photos: Status ${response.status}`);
    }

    const photos: Photo[] = await response.json();
    preloadedPhotos = photos;
    
    console.log(`Preloaded ${photos.length} photos before app render`);
    
    return photos;
  } catch (err: any) {
    console.error("Error preloading photos:", err);
    
    // In case of error, don't block the app - just return empty array
    return [];
  } finally {
    isLoading = false;
  }
};

/**
 * Returns the current preloaded photos without fetching
 * Use this to access photos that were already loaded
 */
export const getPreloadedPhotos = (): Photo[] | null => {
  return preloadedPhotos;
};

/**
 * Groups preloaded photos by floor and maps them to the floor structure
 */
export const getUpdatedFloorsWithPhotos = (): typeof floors => {
  if (!preloadedPhotos) {
    return floors;
  }
  
  return floors.map((floor) => {
    const floorPhotos = preloadedPhotos!
      .filter((photo: Photo) => photo.floorId === floor.id)
      .map((photo: Photo) => ({
        ...photo,
        imageUrl: photo.imageUrl || "",
      }));

    if (floorPhotos.length > 0) {
      return {
        ...floor,
        images: floorPhotos,
      };
    }

    return floor;
  });
}; 