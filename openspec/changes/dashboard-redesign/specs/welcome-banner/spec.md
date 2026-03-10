## ADDED Requirements

### Requirement: Personalized greeting with today's stats
The dashboard SHALL display a welcome banner at the top of the page showing the user's first name, a contextual message summarising today's top matches, and compact stat counters for key numbers. All data SHALL be computed server-side at render time.

#### Scenario: User has top matches today
- **WHEN** the authenticated user loads the dashboard and there is at least one job scoring ≥ their threshold created in the last 24 hours
- **THEN** the banner displays "Hello, [first_name]", a message listing the count of new top matches and the top 1–2 industries represented, and stat counters showing "new today" (total scored jobs in last 24h) and "top picks" (jobs ≥ threshold in last 24h)

#### Scenario: User has no top matches today (zero-state)
- **WHEN** the authenticated user loads the dashboard and no jobs score ≥ their threshold in the last 24 hours
- **THEN** the banner displays the fallback message "No new top matches today — here's what trended this week" and the stat counters reference the last 7 days instead of the last 24 hours

#### Scenario: Weekly activity summary shown
- **WHEN** the authenticated user loads the dashboard
- **THEN** the banner displays how many jobs the user has applied to and saved in the current calendar week (Monday–Sunday)

### Requirement: Profile completeness indicator
The banner SHALL display the user's profile completeness as a percentage. Completeness is calculated from the presence of key profile fields.

#### Scenario: Partial profile
- **WHEN** the user has not completed all tracked profile fields
- **THEN** the banner shows the completeness percentage (e.g. "Profile 60% complete") alongside the weekly activity stats

#### Scenario: Complete profile
- **WHEN** the user has completed all tracked profile fields
- **THEN** the completeness indicator shows 100% or is omitted to reduce noise
