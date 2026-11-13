export interface LocationSuggestion {
  id: string;
  title: string;
  subtitle: string;
  latitude: number;
  longitude: number;
  provider: "google" | "photon";
}

export type LocationProvider = "google" | "photon";

export interface LocationSearchResult {
  suggestions: LocationSuggestion[];
  provider: LocationProvider;
}
