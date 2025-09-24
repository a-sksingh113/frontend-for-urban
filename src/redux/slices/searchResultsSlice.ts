import { createSlice, PayloadAction, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import type { Pro } from "@/types/results";
import type { SubmitProblemResponse, Place } from "@/types/problem";

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

/* -------------------- selectors -------------------- */

export const selectSearchResponse = (s: RootState) => s.searchResults.response;

export const selectSuggestions = createSelector(
  selectSearchResponse,
  (res) => res?.places ?? []
);

export const selectPros = createSelector(selectSuggestions, (places): Pro[] =>
  places.map((p: Place) => ({
    id: p.id,
    name: p.name,
    rating: p.rating ?? 0,
    tel: p.phone || undefined,
    bookHref: p.website || undefined,
    imageUrl: p.photo || undefined,
    totalRating: p.reviews,
    address: p.address,
    mapsHref: p.maps,
    isOpen: p.availability === true || p.availability === "Open",
    distance: p.distance,
  }))
);

function formatCategory(category: string): string {
  return category
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

export const selectCategory = createSelector(
  selectSearchResponse,
  (res): string => {
    const rawCategory = res?.serviceType?.category ?? "General";
    return formatCategory(rawCategory);
  }
);

export const selectLocationLabel = createSelector(
  selectSearchResponse,
  (res) => res?.problem.location ?? "your area"
);

export const selectTokenBalance = createSelector(
  selectSearchResponse,
  (res) => res?.tokensRemaining ?? 0
);
