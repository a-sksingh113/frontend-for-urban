import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "@/redux/api/api";
import searchResultsReducer from "@/redux/slices/searchResultsSlice";

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,
  searchResults: searchResultsReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
