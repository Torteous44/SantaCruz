/**
 * Utility function to retry a fetch operation with exponential backoff
 * Particularly useful for handling temporary server errors like 503 Service Unavailable
 */
export const retryFetch = async (
  url: string, 
  options: RequestInit = {},
  retries = 3, 
  backoff = 300, // Start with 300ms delay
  statusesToRetry = [408, 429, 500, 502, 503, 504, 507, 521, 522, 524]
): Promise<Response> => {
  // Add cache-busting query parameter
  const cacheBustUrl = new URL(url, window.location.origin);
  cacheBustUrl.searchParams.append('_nocache', Date.now().toString());
  
  // Ensure headers contain cache-prevention directives
  const headers = {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    ...(options.headers || {})
  };
  
  // Update options with the enhanced headers
  const enhancedOptions = {
    ...options,
    headers
  };
  
  try {
    const response = await fetch(cacheBustUrl.toString(), enhancedOptions);
    
    // If the response is ok or we're out of retries, or it's not a status we want to retry
    if (
      response.ok || 
      retries <= 0 || 
      !statusesToRetry.includes(response.status)
    ) {
      return response;
    }
    
    // For status codes we want to retry
    console.log(`Retrying fetch for ${url}. Status: ${response.status}. Retries left: ${retries}`);
    
    // Wait before retrying with exponential backoff (300ms, 600ms, 1200ms, etc.)
    await new Promise(resolve => setTimeout(resolve, backoff));
    
    // Retry with one less retry and double the backoff
    return retryFetch(url, options, retries - 1, backoff * 2, statusesToRetry);
  } catch (error) {
    // For network errors (not HTTP errors), retry if we have retries left
    if (retries > 0) {
      console.log(`Fetch failed with error: ${error}. Retrying... Retries left: ${retries}`);
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      // Retry with one less retry and double the backoff
      return retryFetch(url, options, retries - 1, backoff * 2, statusesToRetry);
    }
    
    // If we're out of retries, rethrow the error
    throw error;
  }
}; 