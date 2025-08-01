import React, { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp } from "lucide-react";
import { useSearch } from "../contexts/SearchContext";
import searchApi from "../services/searchApi";
import { AutocompleteSuggestion } from "../services/searchApi";

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({
  className = "",
  placeholder = "Search products, categories, or tags...",
  onSearch,
}: SearchBarProps) {
  const { state, updateFilters } = useSearch();
  const [query, setQuery] = useState(state.filters.query || "");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search for autocomplete
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setLoading(true);
        try {
          const result = await searchApi.getAutocompleteSuggestions(query, 8);
          setSuggestions(result.suggestions);
          setShowAutocomplete(true);
        } catch (error) {
          console.error("Autocomplete error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowAutocomplete(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    updateFilters({ query: searchQuery, page: 1 });
    setShowAutocomplete(false);
    onSearch?.(searchQuery);
  };

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    setQuery(suggestion.suggestion);
    handleSearch(suggestion.suggestion);
  };

  const handleClear = () => {
    setQuery("");
    updateFilters({ query: "", page: 1 });
    setShowAutocomplete(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    } else if (e.key === "Escape") {
      setShowAutocomplete(false);
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Search className="w-4 h-4" />;
      case "category":
        return <TrendingUp className="w-4 h-4" />;
      case "tag":
        return (
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
            #
          </span>
        );
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case "product":
        return "text-gray-900";
      case "category":
        return "text-blue-600";
      case "tag":
        return "text-green-600";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setShowAutocomplete(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={`${suggestion.type}-${index}`}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <div className="flex-shrink-0">
                    {getSuggestionIcon(suggestion.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div
                      className={`font-medium ${getSuggestionColor(suggestion.type)}`}
                    >
                      {suggestion.suggestion}
                    </div>
                    <div className="text-sm text-gray-500 capitalize">
                      {suggestion.type} • {suggestion.count} items
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>No suggestions found</p>
              <p className="text-sm">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
