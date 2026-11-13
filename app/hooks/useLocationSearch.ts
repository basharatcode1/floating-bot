import { useState, useEffect, useRef } from "react";
import { LocationSuggestion, LocationProvider } from "@/app/types/location";
import { searchLocations } from "@/app/services/location";

export function useLocationSearch(initialValue = "") {
  const [search, setSearch] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<LocationProvider>("google");

  // Keep a reference to the active AbortController to cancel previous requests
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // If search query is less than 3 characters, reset suggestions and state
    if (search.trim().length < 3) {
      const timer = setTimeout(() => {
        setSuggestions([]);
        setIsLoading(false);
      }, 0);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      return () => clearTimeout(timer);
    }

    const loadTimer = setTimeout(() => {
      setIsLoading(true);
    }, 0);

    // Setup 300ms debounce
    const delayDebounceId = setTimeout(async () => {
      // Abort any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const results = await searchLocations(search, controller.signal);
        
        // Since searchLocations returns normalized suggestions, we can inspect provider from any suggestion
        if (results.length > 0) {
          setActiveProvider(results[0].provider);
        }
        
        setSuggestions(results);
      } catch (error) {
        // Only set error/empty states if not aborted
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Location search failed:", error);
        setSuggestions([]);
      } finally {
        // Only turn off loading if this is the current active request
        if (abortControllerRef.current === controller) {
          setIsLoading(false);
        }
      }
    }, 300);

    return () => {
      clearTimeout(loadTimer);
      clearTimeout(delayDebounceId);
    };
  }, [search]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearSuggestions = () => {
    setSuggestions([]);
    setIsLoading(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  return {
    search,
    setSearch,
    suggestions,
    isLoading,
    activeProvider,
    clearSuggestions,
  };
}
