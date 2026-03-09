## Context

`LocationInput` is a shared client component used in both onboarding step 1 and the profile page. Currently it filters a static array of 18 US-biased cities. The component already supports free-text entry and multi-select tags — only the autocomplete suggestions need to change.

The geocoding request must not expose a secret API key to the browser. A lightweight Next.js API route will act as a proxy.

## Goals / Non-Goals

**Goals:**
- Replace static `POPULAR_LOCATIONS` with dynamic geocoding API suggestions
- All suggestions in consistent `"City, Country"` format (English country names)
- Show a curated static fallback list when input is empty or API fails
- API key never exposed to client code

**Non-Goals:**
- Changing how locations are stored or validated (`pref_locations TEXT[]` unchanged)
- Validating that saved locations match real places (users can still free-type anything)
- Internationalized city names or non-English country names
- Offline support beyond the static fallback list

## Decisions

### Decision 1: Geocoding API — Geoapify Places (free tier)

**Chosen:** Geoapify Geocoding API (`https://api.geoapify.com/v1/geocode/autocomplete`)

**Why Geoapify over alternatives:**
- Free tier: 3,000 requests/day — sufficient for MVP user counts
- No credit card required for free tier sign-up
- Returns city + country in structured JSON; easy to normalize to `"City, Country"`
- Filters by `type=city` to avoid streets/POIs in suggestions

**Alternatives considered:**
- **Nominatim (OpenStreetMap)**: Free, no key, but hard rate limit (1 req/s) and explicitly disallows production use
- **Mapbox Geocoding**: Better quality but requires credit card for any tier
- **Google Places Autocomplete**: Industry standard but expensive at scale and requires billing

### Decision 2: Proxy via Next.js API Route

**Chosen:** `GET /api/geocode?q=<query>` — a thin server-side proxy that calls Geoapify and returns normalized `string[]`

**Why proxy over direct client call:**
- API key (`GEOAPIFY_API_KEY`) stays server-side, never in browser bundle
- Route can add caching headers, rate limiting, or swap providers without client changes
- Keeps `LocationInput` a generic component with no vendor coupling

### Decision 3: Static fallback list (expanded + reformatted)

Replace the current `POPULAR_LOCATIONS` with ~20 globally relevant entries, all in `"City, Country"` format:
- `"Remote"` first (always relevant)
- European tech hubs: Berlin, Munich, Amsterdam, Zurich, London, Stockholm, Paris, Vienna, Barcelona, Dublin
- Global hubs: San Francisco, New York City, Toronto, Singapore, Sydney, Tokyo, Dubai, São Paulo
- Serves as initial suggestions and fallback when API is unavailable

### Decision 4: Debounce + minimum query length

- Debounce: 300ms after last keystroke before firing API request
- Minimum 2 characters before any API call
- Below threshold: show filtered static fallback list

## Risks / Trade-offs

- **API quota exceeded** → User silently gets static fallback; acceptable degradation since free text still works
- **Geoapify availability** → Same fallback applies; no UX breakage
- **API key rotation** → Single env var, no client-side exposure
- **Result quality** → Geoapify returns strong city-level results for major cities; obscure places may not appear but can be free-typed

## Migration Plan

1. Add `GEOAPIFY_API_KEY` to `.env.local` and document in `.env.example`
2. Create `src/app/api/geocode/route.ts`
3. Update `LocationInput.tsx` (static list → API fetch with debounce + fallback)
4. No DB migrations or form wiring changes needed
5. No rollback risk — changes are isolated to the UI component and one new API route

## Open Questions

- Should `maxLocations` default stay at 5 or increase? (Current default seems reasonable — no change planned)
