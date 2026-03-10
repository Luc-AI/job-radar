## ADDED Requirements

### Requirement: Jobs split into tiers within each time bucket
Within every visible time bucket, jobs SHALL be split into three tiers based on the user's threshold (`T`, default 85):
- **Top Picks**: score ≥ T
- **Also Worth a Look**: score ≥ (T − 15) AND score < T
- **Below threshold**: score < (T − 15) — hidden by default

The threshold value SHALL be read from the authenticated user's `profiles.threshold`; if null, default to 85.

#### Scenario: Jobs distributed across tiers at default threshold
- **WHEN** the user's threshold is 85 and the bucket contains jobs scoring 92, 78, and 55
- **THEN** the 92-score job appears under "Top Picks", the 78-score job under "Also Worth a Look", and the 55-score job is hidden behind the "Show all" toggle

#### Scenario: Tier boundaries shift with custom threshold
- **WHEN** the user's threshold is set to 90
- **THEN** "Top Picks" requires score ≥ 90, "Also Worth a Look" spans 75–89, and scores < 75 are hidden

### Requirement: Empty tiers within a bucket are hidden
If a tier contains zero jobs within a given time bucket, the tier label and any associated UI chrome SHALL not be rendered for that bucket.

#### Scenario: No top picks in a bucket
- **WHEN** a time bucket has only "Also Worth a Look" jobs and no jobs scoring ≥ threshold
- **THEN** the "Top Picks" label is not rendered in that bucket, only "Also Worth a Look" shows

### Requirement: Below-threshold jobs revealed by a toggle
Jobs below the lower boundary (score < T − 15) SHALL be hidden by default behind a per-bucket "Show all" toggle. When revealed, these cards SHALL be displayed with visually de-emphasised styling (reduced opacity or muted colour). The toggle state is local to each time bucket and does not persist across page loads.

#### Scenario: Toggle hidden by default when no below-threshold jobs
- **WHEN** a bucket has no jobs below the lower boundary
- **THEN** the "Show all" toggle is not rendered in that bucket

#### Scenario: User reveals below-threshold jobs
- **WHEN** the user clicks "Show all" within a time bucket
- **THEN** the hidden jobs in that bucket become visible with de-emphasised styling

#### Scenario: User hides below-threshold jobs
- **WHEN** the "Show all" toggle is active and the user clicks "Hide lower matches"
- **THEN** the below-threshold jobs are hidden again in that bucket

### Requirement: Score badge colour-codes match tier
Each job card's circular score badge SHALL use colour to indicate its tier: green for Top Picks, amber for Also Worth a Look, and muted/grey for below-threshold jobs.

#### Scenario: Badge colour reflects tier
- **WHEN** a card is in the "Top Picks" tier
- **THEN** its score badge uses a green accent colour

#### Scenario: Below-threshold badge is muted
- **WHEN** a card is in the below-threshold tier (revealed via toggle)
- **THEN** its score badge uses a grey/muted colour
