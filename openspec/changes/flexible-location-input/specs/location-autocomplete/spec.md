## ADDED Requirements

### Requirement: Dynamic city suggestions via geocoding API
The system SHALL fetch city/location suggestions from a geocoding API when the user types 2 or more characters into the location input field. Suggestions SHALL be returned in consistent `"City, Country"` format.

#### Scenario: User types 2+ characters
- **WHEN** a user types 2 or more characters into the location input
- **THEN** the system sends a debounced (300ms) request to the geocoding API
- **AND** displays up to 8 matching city suggestions in `"City, Country"` format

#### Scenario: User types fewer than 2 characters
- **WHEN** a user types fewer than 2 characters
- **THEN** the system does NOT send an API request
- **AND** displays the static fallback suggestions instead

#### Scenario: API returns results
- **WHEN** the geocoding API responds successfully
- **THEN** suggestions are shown as a dropdown list beneath the input
- **AND** each entry is displayed as `"City, Country"` (e.g., "Berlin, Germany")

### Requirement: Loading state during API fetch
The system SHALL display a loading indicator while an API request is in progress, preventing duplicate requests during the same query.

#### Scenario: API request in flight
- **WHEN** an API request has been sent and not yet resolved
- **THEN** a loading spinner or skeleton is shown in place of the suggestions dropdown
- **AND** no additional request is sent for the same input value

### Requirement: Static fallback suggestions when input is empty
The system SHALL show a curated static list of globally relevant locations (including "Remote" and major international tech hubs in `"City, Country"` format) when the location input is focused but empty.

#### Scenario: Input is focused and empty
- **WHEN** the user focuses the location input field with no text typed
- **THEN** the static fallback list is displayed as suggestions

#### Scenario: API request fails or times out
- **WHEN** the geocoding API request fails or returns an error
- **THEN** the system silently falls back to showing the static list filtered by the current input text
- **AND** no error is shown to the user (graceful degradation)

### Requirement: Consistent "City, Country" format for all suggestions
All location suggestions presented in the dropdown SHALL use the format `"City, Country"` regardless of source (API or static fallback). The "Remote" option is the only exception and SHALL appear as-is.

#### Scenario: API suggestion format normalization
- **WHEN** the geocoding API returns a result
- **THEN** the suggestion is displayed as `"<city name>, <country name>"` in English
- **AND** abbreviated state codes (e.g., "CA", "NY") are NOT used in suggestions

#### Scenario: Free-text entry accepted as-is
- **WHEN** a user types a custom location and presses Enter
- **THEN** the value is accepted as entered (no server-side normalization)
