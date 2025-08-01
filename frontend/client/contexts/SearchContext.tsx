import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  SearchFilters,
  SearchResult,
  AutocompleteResult,
} from "../services/searchApi";

interface SearchState {
  filters: SearchFilters;
  results: SearchResult | null;
  loading: boolean;
  error: string | null;
  autocomplete: AutocompleteResult | null;
  autocompleteLoading: boolean;
}

type SearchAction =
  | { type: "SET_FILTERS"; payload: Partial<SearchFilters> }
  | { type: "SET_RESULTS"; payload: SearchResult }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_AUTOCOMPLETE"; payload: AutocompleteResult }
  | { type: "SET_AUTOCOMPLETE_LOADING"; payload: boolean }
  | { type: "CLEAR_FILTERS" }
  | { type: "RESET_SEARCH" };

const initialState: SearchState = {
  filters: {
    query: "",
    page: 1,
    limit: 20,
    sortBy: "relevance",
    sortOrder: "desc",
  },
  results: null,
  loading: false,
  error: null,
  autocomplete: null,
  autocompleteLoading: false,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload, page: 1 }, // Reset page when filters change
      };
    case "SET_RESULTS":
      return {
        ...state,
        results: action.payload,
        loading: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
        error: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    case "SET_AUTOCOMPLETE":
      return {
        ...state,
        autocomplete: action.payload,
        autocompleteLoading: false,
      };
    case "SET_AUTOCOMPLETE_LOADING":
      return {
        ...state,
        autocompleteLoading: action.payload,
      };
    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {
          ...initialState.filters,
          page: 1,
        },
      };
    case "RESET_SEARCH":
      return initialState;
    default:
      return state;
  }
}

interface SearchContextType {
  state: SearchState;
  dispatch: React.Dispatch<SearchAction>;
  updateFilters: (filters: Partial<SearchFilters>) => void;
  clearFilters: () => void;
  resetSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const updateFilters = (filters: Partial<SearchFilters>) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const resetSearch = () => {
    dispatch({ type: "RESET_SEARCH" });
  };

  return (
    <SearchContext.Provider
      value={{
        state,
        dispatch,
        updateFilters,
        clearFilters,
        resetSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
}
