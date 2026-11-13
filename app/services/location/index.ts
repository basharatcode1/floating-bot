import { LocationSuggestion } from "@/app/types/location";
import { searchGoogleLocations, resolveGoogleCoordinates } from "./google";
import { searchPhotonLocations } from "./photon";

// Cache for recent searches to avoid duplicate requests
const searchCache = new Map<string, LocationSuggestion[]>();

// Track failure state of Google
let isGoogleAvailable = true;
let searchCountSinceFailure = 0;

/**
 * Checks in-memory cache for existing queries (case-insensitive, trimmed)
 */
function getCachedResults(query: string): LocationSuggestion[] | null {
  const normalizedKey = query.trim().toLowerCase();
  return searchCache.get(normalizedKey) || null;
}

/**
 * Stores results in in-memory cache
 */
function cacheResults(query: string, suggestions: LocationSuggestion[]) {
  const normalizedKey = query.trim().toLowerCase();
  searchCache.set(normalizedKey, suggestions);
  
  // Keep cache size bounded (e.g. max 100 entries)
  if (searchCache.size > 100) {
    const firstKey = searchCache.keys().next().value;
    if (firstKey) {
      searchCache.delete(firstKey);
    }
  }
}

/**
 * Combined service layer that tries Google first, falling back to Photon silently.
 * Also handles in-memory caching and auto-recovery for Google.
 */
export async function searchLocations(
  query: string,
  signal?: AbortSignal
): Promise<LocationSuggestion[]> {
  const trimmed = query.trim();
  if (trimmed.length < 3) {
    return [];
  }

  // Check cache first
  const cached = getCachedResults(trimmed);
  if (cached) {
    return cached;
  }

  // Determine whether to attempt Google
  let shouldTryGoogle = isGoogleAvailable;
  if (!isGoogleAvailable) {
    searchCountSinceFailure++;
    // Retry Google every 5 searches to check if it's recovered
    if (searchCountSinceFailure >= 5) {
      shouldTryGoogle = true;
      searchCountSinceFailure = 0;
    }
  }

  if (shouldTryGoogle) {
    try {
      // Implement a timeout for Google Places API (e.g. 5 seconds)
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), 5000);

      // Listen for main abort signal to abort the timeout signal
      if (signal) {
        signal.addEventListener("abort", () => timeoutController.abort());
      }

      try {
        const results = await searchGoogleLocations(trimmed, timeoutController.signal);
        clearTimeout(timeoutId);
        
        // If successful, reset state and mark Google as available
        isGoogleAvailable = true;
        searchCountSinceFailure = 0;
        cacheResults(trimmed, results);
        return results;
      } catch (err) {
        clearTimeout(timeoutId);
        throw err;
      }
    } catch (error) {
      // Catch Google failures silently and mark Google as unavailable
      if (error instanceof DOMException && error.name === "AbortError") {
        // If aborted by client, propagate the abort error instead of falling back
        if (signal?.aborted) {
          throw error;
        }
      }
      
      console.warn("Google Places API failed, falling back to Photon:", error);
      isGoogleAvailable = false;
      searchCountSinceFailure = 0; // Reset counter for the retry interval
    }
  }

  // Fallback to Photon
  try {
    const results = await searchPhotonLocations(trimmed, signal);
    cacheResults(trimmed, results);
    return results;
  } catch (photonError) {
    if (photonError instanceof DOMException && photonError.name === "AbortError") {
      throw photonError;
    }
    console.error("Photon API failed as well:", photonError);
    return [];
  }
}

/**
 * Resolves the coordinates for a suggestion.
 * If the suggestion is from Photon, it already has coordinates.
 * If it is from Google, we fetch the coordinates via Geocoding.
 */
export async function resolveCoordinates(
  suggestion: LocationSuggestion
): Promise<LocationSuggestion> {
  if (suggestion.provider === "photon" || (suggestion.latitude !== 0 && suggestion.longitude !== 0)) {
    return suggestion;
  }

  try {
    const coords = await resolveGoogleCoordinates(suggestion.id);
    return {
      ...suggestion,
      latitude: coords.latitude,
      longitude: coords.longitude,
    };
  } catch (error) {
    console.error("Failed to resolve Google coordinates, returning suggestion as-is:", error);
    return suggestion;
  }
}
