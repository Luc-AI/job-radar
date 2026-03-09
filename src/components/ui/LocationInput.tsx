"use client";

import { useState, KeyboardEvent, forwardRef, useRef, useEffect } from "react";

// Curated international fallback list — shown when input is empty or API is unavailable.
// All entries use "City, Country" format; "Remote" is the only exception.
const FALLBACK_LOCATIONS = [
  "Remote",
  "Berlin, Germany",
  "Munich, Germany",
  "Vienna, Austria",
  "Zurich, Switzerland",
  "Amsterdam, Netherlands",
  "London, United Kingdom",
  "Paris, France",
  "Stockholm, Sweden",
  "Barcelona, Spain",
  "Dublin, Ireland",
  "Copenhagen, Denmark",
  "Helsinki, Finland",
  "Toronto, Canada",
  "New York City, United States",
  "San Francisco, United States",
  "Singapore, Singapore",
  "Sydney, Australia",
  "Tokyo, Japan",
  "Dubai, United Arab Emirates",
];

interface LocationInputProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value: string[];
  onChange: (locations: string[]) => void;
  maxLocations?: number;
}

const LocationInput = forwardRef<HTMLInputElement, LocationInputProps>(
  (
    {
      label,
      error,
      placeholder = "Search or type a location",
      value,
      onChange,
      maxLocations = 5,
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [apiSuggestions, setApiSuggestions] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    const filteredFallback = FALLBACK_LOCATIONS.filter(
      (loc) =>
        loc.toLowerCase().includes(inputValue.toLowerCase()) &&
        !value.includes(loc)
    );

    // API-backed suggestions when input ≥ 2 chars; fall back to filteredFallback on error
    const displayedSuggestions =
      inputValue.length >= 2 && !isLoading && apiSuggestions.length > 0
        ? apiSuggestions.filter((loc) => !value.includes(loc))
        : filteredFallback;

    // Debounced geocode fetch
    useEffect(() => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();

      if (inputValue.length < 2) {
        setApiSuggestions([]);
        setIsLoading(false);
        return;
      }

      debounceTimerRef.current = setTimeout(async () => {
        const controller = new AbortController();
        abortControllerRef.current = controller;
        setIsLoading(true);

        try {
          const res = await fetch(
            `/api/geocode?q=${encodeURIComponent(inputValue)}`,
            { signal: controller.signal }
          );
          if (res.ok) {
            const data: string[] = await res.json();
            setApiSuggestions(data);
          } else {
            setApiSuggestions([]);
          }
        } catch {
          // AbortError or network failure — silently fall back to static list
          setApiSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);

      return () => {
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      };
    }, [inputValue]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setShowSuggestions(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        addLocation(inputValue);
      } else if (
        e.key === "Backspace" &&
        inputValue === "" &&
        value.length > 0
      ) {
        removeLocation(value.length - 1);
      }
    };

    const addLocation = (location: string) => {
      const trimmed = location.trim();
      if (trimmed && !value.includes(trimmed) && value.length < maxLocations) {
        onChange([...value, trimmed]);
        setInputValue("");
        setShowSuggestions(false);
        setApiSuggestions([]);
      }
    };

    const removeLocation = (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    };

    const showDropdown =
      showSuggestions && (isLoading || displayedSuggestions.length > 0);

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          <div
            className={`
              w-full min-h-[42px] px-3 py-2 rounded-lg border bg-white
              focus-within:ring-2 focus-within:ring-slate-500 focus-within:border-transparent
              ${error ? "border-red-500" : "border-slate-300"}
            `}
          >
            <div className="flex flex-wrap gap-2">
              {value.map((location, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded-md"
                >
                  <svg
                    className="w-3.5 h-3.5 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {location}
                  <button
                    type="button"
                    onClick={() => removeLocation(index)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    aria-label={`Remove ${location}`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                ref={ref}
                type="text"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setShowSuggestions(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(true)}
                placeholder={value.length === 0 ? placeholder : ""}
                className="flex-1 min-w-[150px] outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
                disabled={value.length >= maxLocations}
              />
            </div>
          </div>

          {/* Suggestions dropdown */}
          {showDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-auto">
              {isLoading ? (
                <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-400">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Searching…
                </div>
              ) : (
                displayedSuggestions.slice(0, 8).map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => addLocation(suggestion)}
                    className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4 text-slate-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {suggestion}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {value.length > 0 && (
          <p className="mt-1 text-xs text-slate-500">
            {value.length} of {maxLocations} locations added
          </p>
        )}
      </div>
    );
  }
);

LocationInput.displayName = "LocationInput";

export { LocationInput };
