## 1. Environment Setup

- [x] 1.1 Add `GEOAPIFY_API_KEY=` to `.env.example` (and `.env.local` with real key)
- [x] 1.2 Document the variable in `CLAUDE.md` under "Required environment variables"

## 2. Geocode API Route

- [x] 2.1 Create `src/app/api/geocode/route.ts` — `GET` handler that accepts `?q=<query>` param
- [x] 2.2 Call Geoapify autocomplete endpoint with `type=city&limit=8&format=json` and the server-side API key
- [x] 2.3 Normalize each result to `"City, Country"` string (handle missing city/country gracefully)
- [x] 2.4 Return `string[]` as JSON; return empty array on API error (no 500s)

## 3. LocationInput Component Refactor

- [x] 3.1 Replace `POPULAR_LOCATIONS` static array with an expanded `FALLBACK_LOCATIONS` array (~20 entries, all in `"City, Country"` format, "Remote" first)
- [x] 3.2 Add debounced fetch logic: fire `GET /api/geocode?q=<input>` after 300ms, only when input length ≥ 2
- [x] 3.3 When input is empty or < 2 chars, show `FALLBACK_LOCATIONS` filtered by input (existing behavior)
- [x] 3.4 When input ≥ 2 chars, replace suggestion list with API results; fall back to filtered `FALLBACK_LOCATIONS` on fetch error
- [x] 3.5 Add loading state: show a spinner/loading indicator in the suggestions dropdown while fetch is in progress
- [x] 3.6 Cancel in-flight fetch when a new keystroke arrives (use `AbortController` or check query staleness)

## 4. Verify

- [ ] 4.1 Test in browser: empty focus shows fallback list with "Remote" first
- [ ] 4.2 Test: typing "Ber" shows Berlin, Bern, etc. from API in "City, Country" format
- [ ] 4.3 Test: typing a US city shows "New York City, United States" style (not "NY" abbreviation)
- [ ] 4.4 Test: disconnect network — component falls back gracefully, no error shown
- [ ] 4.5 Verify onboarding step 1 and profile page both work without code changes
<!-- Tasks 4.1–4.5 require manual browser verification after adding GEOAPIFY_API_KEY to .env.local -->
