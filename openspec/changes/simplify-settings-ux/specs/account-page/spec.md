## ADDED Requirements

### Requirement: Account page is accessible via sidebar
The app SHALL expose a dedicated `/account` route linked from the sidebar main navigation.

#### Scenario: Account nav item appears in sidebar
- **WHEN** an authenticated user views any page
- **THEN** the sidebar SHALL show an "Account" nav item linking to `/account`

#### Scenario: Account page is active-highlighted when on /account
- **WHEN** the current path is `/account`
- **THEN** the "Account" sidebar item SHALL have `isActive` styling

---

### Requirement: Personal info card saves first_name and last_name
The `/account` page SHALL include a card for first name and last name with its own Save/Cancel buttons following the per-card save pattern.

#### Scenario: User updates first and last name
- **WHEN** a user edits first_name or last_name and clicks Save
- **THEN** the values SHALL be persisted to `users.first_name` and `users.last_name`
- **THEN** a success toast SHALL be shown

#### Scenario: Save is disabled when no changes
- **WHEN** the user has not changed first_name or last_name from their loaded values
- **THEN** the Save button SHALL be disabled

#### Scenario: Cancel restores original values
- **WHEN** the user has unsaved changes and clicks Cancel
- **THEN** the fields SHALL revert to the last saved values

---

### Requirement: Email change card
The `/account` page SHALL include a card for changing the account email address with its own save action.

#### Scenario: User requests email change
- **WHEN** a user enters a new valid email and submits
- **THEN** Supabase Auth SHALL send a verification email
- **THEN** a success toast SHALL notify the user to check their inbox

#### Scenario: Duplicate email is rejected
- **WHEN** a user submits the same email as their current address
- **THEN** an error SHALL be shown: "New email must be different from your current email"

---

### Requirement: Danger zone card with account deletion
The `/account` page SHALL include a danger zone card for permanent account deletion, requiring typed confirmation.

#### Scenario: Account deletion requires "DELETE" confirmation
- **WHEN** a user submits the deletion form without typing exactly "DELETE"
- **THEN** the submit button SHALL remain disabled

#### Scenario: Confirmed account deletion removes user data and signs out
- **WHEN** a user types "DELETE" and submits
- **THEN** the user's row in `users` SHALL be deleted
- **THEN** the user SHALL be signed out and redirected to `/`

---

### Requirement: Account settings removed from /settings
The `/settings` page SHALL NOT contain the Account card (email, danger zone). Those concerns MUST live exclusively at `/account`.

#### Scenario: Settings page does not render AccountSettingsForm
- **WHEN** a user navigates to `/settings`
- **THEN** no email management or account deletion UI SHALL be visible
