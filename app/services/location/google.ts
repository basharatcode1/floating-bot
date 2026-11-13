import { LocationSuggestion } from "@/app/types/location";

declare global {
  interface Window {
    google?: any;
  }
}

let googleScriptLoadingPromise: Promise<void> | null = null;

function loadGoogleMapsScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google Maps SDK can only be loaded in the browser"));
  }

  if (window.google?.maps?.places) {
    return Promise.resolve();
  }

  if (googleScriptLoadingPromise) {
    return googleScriptLoadingPromise;
  }

  googleScriptLoadingPromise = new Promise((resolve, reject) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      reject(new Error("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is not defined"));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.addEventListener("load", () => {
      if (window.google?.maps?.places) {
        resolve();
      } else {
        reject(new Error("Google Maps Places library failed to load"));
      }
    });

    script.addEventListener("error", (_) => {
      reject(new Error("Failed to load Google Maps SDK script"));
    });

    document.head.appendChild(script);
  });

  return googleScriptLoadingPromise;
}

let autocompleteService: any = null;
let geocoderService: any = null;

function getAutocompleteService() {
  if (!autocompleteService && window.google?.maps?.places) {
    autocompleteService = new window.google.maps.places.AutocompleteService();
  }
  return autocompleteService;
}

function getGeocoderService() {
  if (!geocoderService && window.google?.maps) {
    geocoderService = new window.google.maps.Geocoder();
  }
  return geocoderService;
}

/**
 * Searches for location suggestions using Google Places Autocomplete API.
 * Since Google autocomplete predictions do not contain coordinates, they are defaulted to 0.
 * Coordinates are resolved on selection.
 */
export async function searchGoogleLocations(
  query: string,
  signal?: AbortSignal
): Promise<LocationSuggestion[]> {
  await loadGoogleMapsScript();

  if (signal?.aborted) {
    throw new DOMException("Aborted", "AbortError");
  }

  const service = getAutocompleteService();
  if (!service) {
    throw new Error("Google Places Autocomplete Service is not available");
  }

  return new Promise<LocationSuggestion[]>((resolve, reject) => {
    const onAbort = () => {
      reject(new DOMException("Aborted", "AbortError"));
    };

    if (signal) {
      if (signal.aborted) {
        return onAbort();
      }
      signal.addEventListener("abort", onAbort);
    }

    service.getPlacePredictions(
      {
        input: query,
        types: ["(regions)"], // Restrict to regions/cities for headquarters/locations
      },
      (predictions: any, status: any) => {
        if (signal) {
          signal.removeEventListener("abort", onAbort);
        }

        if (signal?.aborted) {
          reject(new DOMException("Aborted", "AbortError"));
          return;
        }

        if (status === "OVER_QUERY_LIMIT") {
          reject(new Error("Google API quota exceeded"));
          return;
        }

        if (status === "REQUEST_DENIED") {
          reject(new Error("Google API request denied (invalid key or config)"));
          return;
        }

        if (status !== "OK" && status !== "ZERO_RESULTS") {
          reject(new Error(`Google Places API returned status: ${status}`));
          return;
        }

        if (!predictions || predictions.length === 0) {
          resolve([]);
          return;
        }

        const suggestions: LocationSuggestion[] = predictions.map((pred: any) => {
          return {
            id: pred.place_id,
            title: pred.structured_formatting?.main_text || pred.description,
            subtitle: pred.structured_formatting?.secondary_text || "",
            latitude: 0, // Geocoded on demand upon selection
            longitude: 0,
            provider: "google" as const,
          };
        });

        resolve(suggestions);
      }
    );
  });
}

/**
 * Resolves the coordinates (latitude and longitude) for a Google Place ID.
 */
export async function resolveGoogleCoordinates(
  placeId: string
): Promise<{ latitude: number; longitude: number }> {
  await loadGoogleMapsScript();
  const geocoder = getGeocoderService();
  if (!geocoder) {
    throw new Error("Google Geocoder Service is not available");
  }

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId }, (results: any, status: any) => {
      if (status !== "OK" || !results || results.length === 0) {
        reject(new Error(`Geocoding failed with status: ${status}`));
        return;
      }

      const location = results[0].geometry.location;
      resolve({
        latitude: location.lat(),
        longitude: location.lng(),
      });
    });
  });
}
