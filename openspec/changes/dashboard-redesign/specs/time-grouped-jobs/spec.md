## ADDED Requirements

### Requirement: Jobs partitioned into four time buckets
The dashboard job list SHALL be divided into four time groups based on each job's `created_at` timestamp relative to the current time: "Last 24 Hours", "Last 7 Days", "Last 30 Days", and "Older than 30 Days". A job SHALL appear in the earliest bucket it qualifies for (no duplicates across buckets).

#### Scenario: Jobs appear in the correct bucket
- **WHEN** a job was created 6 hours ago
- **THEN** it appears only under "Last 24 Hours" and not in any other bucket

#### Scenario: Bucket boundaries are non-overlapping
- **WHEN** the dashboard renders
- **THEN** each job appears in exactly one time bucket

### Requirement: Empty time buckets are hidden
If a time bucket contains zero jobs (across all score tiers, before any filter is applied), the entire section INCLUDING its heading SHALL be hidden from the page.

#### Scenario: Empty bucket hidden
- **WHEN** no jobs exist in the "Last 7 Days" range
- **THEN** the "Last 7 Days" section heading and its content are not rendered

#### Scenario: Next populated bucket shows
- **WHEN** "Last 24 Hours" is empty but "Last 7 Days" has jobs
- **THEN** "Last 7 Days" is the first visible section on the page

### Requirement: "Older than 30 Days" is collapsed by default
The "Older than 30 Days" section SHALL render in a collapsed state when the page first loads, showing only the section heading and a job count badge. The user can expand it by clicking the heading.

#### Scenario: Older section loads collapsed
- **WHEN** the dashboard page loads and there are jobs older than 30 days
- **THEN** the "Older than 30 Days" heading is visible with a count badge (e.g. "12 jobs") and the job cards are not visible

#### Scenario: User expands the older section
- **WHEN** the user clicks the "Older than 30 Days" heading
- **THEN** the job cards within that section become visible

#### Scenario: User collapses the older section
- **WHEN** the "Older than 30 Days" section is expanded and the user clicks the heading again
- **THEN** the job cards are hidden again
