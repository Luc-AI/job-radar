## ADDED Requirements

### Requirement: Top pick threshold slider on Settings page
The Settings page SHALL include a "Top pick threshold" slider control allowing the user to set an integer value between 70 and 100 (inclusive). The default value when no threshold is stored SHALL be 85. Below the slider, the page SHALL display the auto-calculated "Also Worth a Look" range (threshold − 15 to threshold − 1).

#### Scenario: Slider renders with stored threshold
- **WHEN** the user navigates to the Settings page and their profile has `threshold = 90`
- **THEN** the slider is initialised at 90 and the helper text reads "Also showing jobs scoring 75–89%"

#### Scenario: Slider renders with no stored threshold
- **WHEN** the user navigates to the Settings page and `profiles.threshold` is null
- **THEN** the slider is initialised at 85 and the helper text reads "Also showing jobs scoring 70–84%"

#### Scenario: Helper text updates as user moves slider
- **WHEN** the user drags the slider to a new value (e.g. 80)
- **THEN** the helper text below the slider immediately updates to reflect the new "Also Worth a Look" range (e.g. "Also showing jobs scoring 65–79%")

### Requirement: Threshold persisted to Supabase on save
When the user submits the settings form, the threshold value SHALL be written to `profiles.threshold` for the authenticated user via a server action.

#### Scenario: Successful save
- **WHEN** the user sets the slider to 80 and submits
- **THEN** `profiles.threshold` is updated to 80 for that user and a success confirmation is shown

#### Scenario: Save rejected for out-of-range value
- **WHEN** the form is submitted with a threshold value outside 70–100
- **THEN** the server action returns a validation error and the value is not persisted

### Requirement: Threshold applied globally across dashboard
The threshold stored in `profiles.threshold` SHALL be the single source of truth used by the dashboard to compute tier boundaries. No hardcoded default SHALL override a stored user value.

#### Scenario: Dashboard reads persisted threshold
- **WHEN** the user has saved a threshold of 90 and navigates to the dashboard
- **THEN** "Top Picks" shows jobs scoring ≥ 90 and "Also Worth a Look" spans 75–89
