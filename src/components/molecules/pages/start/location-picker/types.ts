export type SuggestionItem = {
  kind: "place" | "query";
  text: string;
  secondaryText?: string;
  placeId?: string | null;
};

export type PlaceDetails = {
  id: string | null;
  displayName: string | null;
  formattedAddress: string | null;
  location: { lat: number; lng: number } | null;
  types: string[];
};

export type OnPlaceSelected = (payload: {
  inputText: string;
  suggestion: SuggestionItem;
  details: PlaceDetails | null;
  sessionToken?: string;
}) => void;
