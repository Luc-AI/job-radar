## Why

The `LocationInput` component currently displays a hardcoded list of 18 suggestions biased toward US cities (e.g., "San Francisco, CA", "New York, NY") using an inconsistent format that doesn't match most users' actual locations. This creates friction during onboarding and profile setup, where users must ignore all suggestions and type freely—defeating the purpose of autocomplete.

## What Changes

- Remove the hardcoded `POPULAR_LOCATIONS` array from `LocationInput.tsx`
- Integrate a geocoding autocomplete API (e.g., Geoapify Places API — free tier sufficient) to provide dynamic, worldwide city suggestions as the user types
- Normalize all location display to consistent `"City, Country"` format
- Add a small set of smart static fallback suggestions shown before the user starts typing (e.g., "Remote", top European + global tech hubs)
- No changes to how locations are stored (`pref_locations TEXT[]`) or validated

## Capabilities

### New Capabilities

- `location-autocomplete`: Dynamic city/location search with geocoding API, consistent "City, Country" format, and smart defaults before typing begins

### Modified Capabilities

<!-- None — storage, validation, and form wiring are unchanged -->

## Impact

- `src/components/ui/LocationInput.tsx`: Replace static array + filtering with API-backed autocomplete; add loading state; keep existing tag/multi-select UX
- `src/app/(app)/onboarding/step-1/Step1Form.tsx`: No changes needed (uses `LocationInput` as-is)
- `src/app/(app)/profile/BasicsForm.tsx`: No changes needed (uses `LocationInput` as-is)
- New environment variable: geocoding API key (e.g., `GEOAPIFY_API_KEY` or similar)
- No DB schema changes
