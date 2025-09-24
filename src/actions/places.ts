/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { v1 as placesV1 } from "@googlemaps/places";
import {
  Language,
  Client as MapsServiceClient,
} from "@googlemaps/google-maps-services-js";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY;
// Optionally defer the API key check to inside actions

import axios from "axios";
const placesClient = new placesV1.PlacesClient({ apiKey: API_KEY! });
const mapsClient = new MapsServiceClient();

type LatLng = { latitude: number; longitude: number };

export type AutocompleteSuggestion =
  | {
      kind: "place";
      text: string;
      secondaryText?: string;
      placeId?: string | null;
      place?: string | null;
      distanceMeters?: number | null;
      types?: string[];
    }
  | {
      kind: "query";
      text: string;
      types?: string[];
    };

export type AutocompleteOptions = {
  sessionToken?: string;
  includeQueryPredictions?: boolean;
  origin?: LatLng;
  locationBias?: {
    circle?: { center: LatLng; radius: number };
    rectangle?: { low: LatLng; high: LatLng };
  };
  locationRestriction?: {
    rectangle?: { low: LatLng; high: LatLng };
  };
  includedPrimaryTypes?: string[];
  includedRegionCodes?: string[];
  languageCode?: string;
  regionCode?: string;
  inputOffset?: number;
  signal?: AbortSignal;
};

export async function autocompletePlacesAction(
  input: string,
  opts: AutocompleteOptions = {}
): Promise<{ suggestions: AutocompleteSuggestion[] }> {
  if (!API_KEY) throw new Error("Missing GOOGLE_MAPS_API_KEY");

  const q = input?.trim();
  if (!q) return { suggestions: [] };

  const { locationBias, locationRestriction } = opts;

  const request = {
    input: q,
    sessionToken: opts.sessionToken,
    includeQueryPredictions:
      typeof opts.includeQueryPredictions === "boolean"
        ? opts.includeQueryPredictions
        : false, // preserve current behavior by default
    origin: opts.origin,
    locationBias:
      locationBias && !locationRestriction ? locationBias : undefined,
    locationRestriction:
      locationRestriction && !locationBias ? locationRestriction : undefined,

    // Keep this undefined to allow addresses + regions
    includedPrimaryTypes: opts.includedPrimaryTypes,

    includedRegionCodes: opts.includedRegionCodes,
    languageCode: opts.languageCode ?? "en",
    regionCode: opts.regionCode,
    inputOffset:
      typeof opts.inputOffset === "number" ? opts.inputOffset : undefined,
    signal: opts.signal,
  };

  try {
    const [resp] = await placesClient.autocompletePlaces(request as any);
    const raw = resp?.suggestions ?? [];

    const suggestions: AutocompleteSuggestion[] = raw
      .map((s): AutocompleteSuggestion | null => {
        const p = s.placePrediction;
        if (p) {
          const text = p.text?.text ?? p.structuredFormat?.mainText?.text ?? "";
          const secondary =
            p.structuredFormat?.secondaryText?.text ?? undefined;
          return {
            kind: "place",
            text,
            secondaryText: secondary,
            placeId: p.placeId ?? null,
            place: p.place ?? null,
            distanceMeters: p.distanceMeters ?? null,
            types: p.types ?? [],
          };
        }
        const qq = s.queryPrediction;
        if (qq) {
          return {
            kind: "query",
            text: qq.text?.text ?? "",
            types: [],
          };
        }
        return null;
      })
      .filter(Boolean) as AutocompleteSuggestion[];

    return { suggestions };
  } catch (err: any) {
    console.error("Places Autocomplete error", {
      code: err?.code,
      status: err?.status,
      details: err?.details,
      message: err?.message,
      metadata: err?.metadata,
    });
    throw new Error(err?.message || "Autocomplete failed");
  }
}

export async function getPlaceDetailsAction(
  placeResourceOrId: string,
  opts?: {
    languageCode?: string;
    regionCode?: string;
    sessionToken?: string;
    signal?: AbortSignal;
  }
): Promise<{
  id: string | null;
  displayName: string | null;
  formattedAddress: string | null;
  location: { lat: number; lng: number } | null;
  types: string[];
}> {
  if (!API_KEY) throw new Error("Missing GOOGLE_MAPS_API_KEY");

  const name = placeResourceOrId.startsWith("places/")
    ? placeResourceOrId
    : `places/${placeResourceOrId}`;

  const fieldMask = "id,displayName,formattedAddress,location,types";

  const request: any = {
    name,
    languageCode: opts?.languageCode,
    regionCode: opts?.regionCode,
    sessionToken: opts?.sessionToken,
    signal: opts?.signal,
  };

  const headers: Record<string, string> = { "X-Goog-FieldMask": fieldMask };
  if (opts?.sessionToken) headers["X-Goog-Session-Token"] = opts.sessionToken;

  const [place] = await placesClient.getPlace(request, {
    otherArgs: { headers },
  });

  const lat = (place as any)?.location?.latitude ?? null;
  const lng = (place as any)?.location?.longitude ?? null;

  return {
    id: (place as any)?.id ?? null,
    displayName: (place as any)?.displayName?.text ?? null,
    formattedAddress: (place as any)?.formattedAddress ?? null,
    location: lat != null && lng != null ? { lat, lng } : null,
    types: (place as any)?.types ?? [],
  };
}

export async function reverseGeocodeAction(
  lat: number,
  lng: number,
  opts: { language?: string } = {}
): Promise<{
  address: string | null;
  placeId: string | null;
  location: { lat: number; lng: number };
  formattedAddress?: string | null;
}> {
  if (!API_KEY) throw new Error("Missing GOOGLE_MAPS_API_KEY");

  try {
    const { data } = await mapsClient.reverseGeocode({
      params: {
        latlng: `${lat},${lng}`,
        key: API_KEY!,
        language: (opts.language ?? "en") as Language,
      },
      timeout: 8000,
    });

    if (data.status !== "OK") {
      throw new Error(
        `${data.status}: ${data.error_message || "Geocoding failed"}`
      );
    }

    const first = data.results?.[0];
    const address = first?.formatted_address ?? null;
    const placeId = first?.place_id ?? null;

    return {
      address,
      placeId,
      location: { lat, lng },
      formattedAddress: address,
    };
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const payload = err.response?.data;
      console.error("Geocoding AxiosError", status, payload);
      const msg =
        payload?.error_message ||
        payload?.message ||
        err.message ||
        "Reverse geocoding request failed";
      throw new Error(`Geocoding ${status ?? ""}: ${msg}`);
    }
    throw err;
  }
}
