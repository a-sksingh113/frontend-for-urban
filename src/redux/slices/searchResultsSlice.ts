import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { SubmitProblemResponse, PlaceSuggestion } from "@/types/problem";
import type { RootState } from "@/redux/store";
import type { Pro } from "@/types/results";

type SearchState = {
  response: SubmitProblemResponse | null;
  isLoading: boolean;
  isError: boolean;
};

const initialState: SearchState = {
  response: null,
  isLoading: false,
  isError: false,
};

export const searchResultsSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<boolean>) => {
      state.isError = action.payload;
    },
    // payload is EXACT backend response
    setResults: (state, action: PayloadAction<SubmitProblemResponse>) => {
      state.response = action.payload;
      state.isError = false;
    },
    resetResults: () => initialState,
  },
});

export const { setLoading, setError, setResults, resetResults } =
  searchResultsSlice.actions;

export default searchResultsSlice.reducer;

/* -------------------- Selectors (UI adapters) -------------------- */

// 1) raw suggestions (prefer topSuggestions if present)
export const selectSearchResponse = (s: RootState) => s.searchResults.response;

export const selectSuggestions = createSelector(
  selectSearchResponse,
  (res): PlaceSuggestion[] =>
    res?.topSuggestions?.length ? res.topSuggestions : res?.suggestions ?? []
);

// 2) map raw suggestions -> your card's Pro type (at render time only)
export const selectPros = createSelector(selectSuggestions, (sugs): Pro[] =>
  sugs.map((s) => {
    const openingHours = s.details?.currentOpeningHours;
    return {
      id: s.place_id,
      name: s.name,
      rating: s.rating ?? 0,
      isOpen: openingHours?.openNow ?? null,
      tel: s.details?.internationalPhoneNumber || undefined,
      bookHref: s.details?.websiteUri || undefined,
      imageUrl: s.photoUrl || undefined,
      distanceKm:
        typeof s.distanceMeters === "number" ? s.distanceMeters : undefined,
      totalRating: s.user_ratings_total,
    };
  })
);

export const selectCategory = createSelector(
  selectSearchResponse,
  (res) => res?.problem.detectedIssue ?? "General"
);

export const selectLocationLabel = createSelector(
  selectSearchResponse,
  (res) => res?.problem.location ?? "your area"
);

export const selectTokenBalance = createSelector(
  selectSearchResponse,
  (res) => res?.tokensRemaining ?? 0
);
