import { Photo } from "../types";
import { floors } from "./data";
import { retryFetch } from "./retryFetch";

// Stores preloaded photo data
let preloadedPhotos: Photo[] | null = null;
let isLoading = false;

/**
 * Start preloading images after data is loaded to speed up rendering
 */
const preloadImages = (photos: Photo[]): void => {
  // Limit to first 10 images to avoid too many requests
  const imagesToPreload = photos.slice(0, 10);

  // Create a hidden container for preloaded images
  const preloadContainer = document.createElement("div");
  preloadContainer.style.position = "absolute";
  preloadContainer.style.width = "0";
  preloadContainer.style.height = "0";
  preloadContainer.style.overflow = "hidden";
  preloadContainer.style.visibility = "hidden";

  // Add image elements to preload them
  imagesToPreload.forEach((photo) => {
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
    const apiUrl =
      process.env.REACT_APP_API_URL || "https://santacruzservice.fly.dev/api";

    // Add a timeout to the fetch to avoid waiting too long
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout (increased to allow for retries)

    try {
      // Use retryFetch instead of fetch for automatic retry with exponential backoff
      const response = await retryFetch(
        `${apiUrl}/photos/approved`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
          signal: controller.signal,
        },
        3
      ); // 3 retries (4 total attempts) with default backoff

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Failed to preload photos: Status ${response.status}`);
      }

      const photos: Photo[] = await response.json();
      preloadedPhotos = photos;

      console.log(`Preloaded ${photos.length} photos before app render`);

      // Start preloading images after a short delay to not block initial render
      setTimeout(() => preloadImages(photos), 500);

      return photos;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (err: any) {
    const errorMessage =
      err.name === "AbortError"
        ? "Preloading timed out"
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
        roomId: photo.roomId || undefined,
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
