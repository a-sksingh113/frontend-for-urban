export interface ProblemDTO {
  id: string;
  userId: string;
  imageUrl: string;
  description: string | null;
  location: string | null;
  latitude: number;
  longitude: number;
  detectedIssue: string | null;
}

export type Availability = "yes" | "no";

export interface Details {
  internationalPhoneNumber: string;
  websiteUri: string;
  currentOpeningHours: {
    openNow: boolean;
  };
}

export interface PlaceSuggestion {
  place_id: string;
  name: string;
  formatted_address: string;
  rating: number;
  distance: number;
  availability: Availability;
  user_ratings_total: number;
  details: Details;
  website: string;
  photoUrl: string;
  distanceMeters: number;
}

export interface SubmitProblemResponse {
  success: boolean;
  message: string;
  problem: ProblemDTO;
  detectedLabels: string[];
  suggestions: PlaceSuggestion[];
  topSuggestions: PlaceSuggestion[];
  tokensRemaining: number;
  tokenUsed: number;
  requestCount: number;
}
