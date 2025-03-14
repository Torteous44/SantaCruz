import { Photo } from '../types';
import { floors } from './data';

// Stores preloaded photo data
let preloadedPhotos: Photo[] | null = null;
let isLoading = false;
const CACHE_KEY = 'santa_cruz_photos_cache';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes in milliseconds

/**
 * Checks if the cached data is still valid (not expired)
 */
const isCacheValid = (timestamp: number): boolean => {
  const now = Date.now();
  return now - timestamp < CACHE_EXPIRY;
};

/**
 * Try to load photos from localStorage cache first
 */
const loadFromCache = (): Photo[] | null => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (cachedData) {
      const { photos, timestamp } = JSON.parse(cachedData);
      
      // Validate cache freshness
      if (isCacheValid(timestamp)) {
        console.log(`Using ${photos.length} photos from cache`);
        return photos;
      } else {
        console.log('Cache expired, fetching fresh data');
        localStorage.removeItem(CACHE_KEY);
      }
    }
  } catch (error) {
    console.warn('Error reading from cache:', error);
    // Clear potentially corrupted cache
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {
      // Ignore errors when clearing cache
    }
  }
  return null;
};

/**
 * Save photos to localStorage cache
 */
const saveToCache = (photos: Photo[]): void => {
  try {
    const cacheData = {
      photos,
      timestamp: Date.now()
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    console.log(`Saved ${photos.length} photos to cache`);
  } catch (error) {
    console.warn('Error saving to cache:', error);
    // Possible localStorage full - try to clear it
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch (e) {
      // Ignore errors when clearing cache
    }
  }
};

/**
 * Start preloading images after data is loaded to speed up rendering
 */
const preloadImages = (photos: Photo[]): void => {
  // Limit to first 10 images to avoid too many requests
  const imagesToPreload = photos.slice(0, 10);
  
  // Create a hidden container for preloaded images
  const preloadContainer = document.createElement('div');
  preloadContainer.style.position = 'absolute';
  preloadContainer.style.width = '0';
  preloadContainer.style.height = '0';
  preloadContainer.style.overflow = 'hidden';
  preloadContainer.style.visibility = 'hidden';
  
  // Add image elements to preload them
  imagesToPreload.forEach(photo => {
    if (photo.imageUrl) {
      const img = new Image();
      img.src = photo.imageUrl;
      preloadContainer.appendChild(img);
    }
  });
  
  // Add to DOM temporarily and remove after a short delay
  document.body.appendChild(preloadContainer);
  setTimeout(() => {
    document.body.removeChild(preloadContainer);
  }, 10000);
  
  console.log(`Preloading ${imagesToPreload.length} images`);
};

/**
 * Preloads photos from the API before the app renders
 * Returns a promise that resolves when photos are loaded
 */
export const preloadPhotos = async (): Promise<Photo[]> => {
  // If we already have preloaded photos, return them immediately
  if (preloadedPhotos) {
    return Promise.resolve(preloadedPhotos);
  }
  
  // Try to load from cache first
  const cachedPhotos = loadFromCache();
  if (cachedPhotos) {
    preloadedPhotos = cachedPhotos;
    
    // Start preloading images even when using cached data
    setTimeout(() => preloadImages(cachedPhotos), 500);
    
    return Promise.resolve(cachedPhotos);
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

    // Add a timeout to the fetch to avoid waiting too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(`${apiUrl}/photos/approved`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to preload photos: Status ${response.status}`);
      }

      const photos: Photo[] = await response.json();
      preloadedPhotos = photos;
      
      // Save to cache for future visits
      saveToCache(photos);
      
      console.log(`Preloaded ${photos.length} photos before app render`);
      
      // Start preloading images after a short delay to not block initial render
      setTimeout(() => preloadImages(photos), 500);
      
      return photos;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (err: any) {
    const errorMessage = err.name === 'AbortError' 
      ? 'Preloading timed out' 
      : `Error preloading photos: ${err.message || err}`;
    
    console.error(errorMessage);
    
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
        id: photo._id || photo.id || `photo-${Date.now()}`,
        imageUrl: photo.imageUrl || "",
        roomId: photo.roomId || undefined
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