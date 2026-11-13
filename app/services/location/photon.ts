import { LocationSuggestion } from "@/app/types/location";

interface PhotonFeature {
  geometry: {
    coordinates: [number, number]; // [lng, lat]
  };
  properties: {
    osm_id?: number;
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
    street?: string;
    housenumber?: string;
  };
}

interface PhotonResponse {
  features: PhotonFeature[];
}

/**
 * Searches for location suggestions using the Photon API.
 */
export async function searchPhotonLocations(
  query: string,
  signal?: AbortSignal
): Promise<LocationSuggestion[]> {
  const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`;

  try {
    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Photon API returned status: ${response.status}`);
    }

    const data: PhotonResponse = await response.json();

    if (!data || !Array.isArray(data.features)) {
      return [];
    }

    return data.features.map((feature, index) => {
      const { properties, geometry } = feature;
      const [longitude, latitude] = geometry.coordinates;

      // Extract title and subtitle
      const title = properties.name || properties.city || "Unknown Location";
      
      const subtitleParts: string[] = [];
      if (properties.street) {
        subtitleParts.push(
          properties.housenumber 
            ? `${properties.street} ${properties.housenumber}` 
            : properties.street
        );
      }
      if (properties.city && properties.city !== title) {
        subtitleParts.push(properties.city);
      }
      if (properties.state) {
        subtitleParts.push(properties.state);
      }
      if (properties.country) {
        subtitleParts.push(properties.country);
      }

      const subtitle = subtitleParts.join(", ");
      const id = properties.osm_id 
        ? `photon-${properties.osm_id}` 
        : `photon-${index}-${latitude}-${longitude}`;

      return {
        id,
        title,
        subtitle,
        latitude,
        longitude,
        provider: "photon" as const,
      };
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    throw new Error(`Photon service failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}
