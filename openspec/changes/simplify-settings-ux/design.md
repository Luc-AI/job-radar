## Context

The current settings page has a single `NotificationSettingsPageForm` wrapping all three notification sections (search mode, channels, instant alerts) in one `<form>` with one save button. This creates UX friction: any change requires re-submitting the entire state. It also diverges from the per-card save pattern established on the Profile page (`BasicsForm`, `FirmaForm`, `AdvancedForm`, `CvForm`), each of which is a self-contained card with its own `useActionState` + save button.

The Account card (email change + delete account) is currently embedded at the bottom of the settings page with no natural home. First/last name are missing from the DB entirely.

## Goals / Non-Goals

**Goals:**
- Each notification card has its own form, own save/cancel buttons, own action (immediate save on submit)
- New `/account` page with personal info (first_name, last_name), email, and danger zone
- Sidebar gains an "Account" nav item; "Settings" becomes notifications-only
- DB gains `first_name` + `last_name` columns
- Design polish: follow profile-page card conventions (right-aligned save/cancel, disabled when no changes)
- Remove "Coming soon" channel rows to reduce visual noise
- Document the per-card save pattern in CLAUDE.md

**Non-Goals:**
- Adding real WhatsApp/ntfy.sh notification support (channels remain email-only)
- Changing notification logic or thresholds validation rules
- Internationalisation or language changes

## Decisions

### 1. Three separate card components for notifications, each with own action

**Decision:** Replace `NotificationSettingsPageForm` with `SearchModeCard`, `NotificationChannelsCard`, and `InstantAlertsCard`. Each is a standalone client component with `useActionState` bound to a dedicated server action.

**Alternatives considered:**
- Keep one form but add per-section save buttons via JavaScript partition: rejected — more complex client state and doesn't match existing patterns
- Keep single action, just visually split: rejected — doesn't achieve "immediate save per card"

**Rationale:** Matches the established Profile page pattern. Each action validates only its fields and updates only its DB columns via `.update({ ... }).eq("id", user.id)`.

### 2. Cross-card threshold validation handled server-side in `saveInstantAlerts`

The instant alert threshold must be ≥ the notify threshold. Since the cards are now independent, `InstantAlertsCard` passes `notifyThreshold` as a hidden field (read from `initialNotifyThreshold` prop). The server action re-validates this constraint. Client-side warning banner remains as before.

### 3. New `/account` route with its own `actions.ts`

**Decision:** Create `src/app/(app)/account/` as a new App Router route group. Move `updateEmail` and `deleteAccount` from `settings/actions.ts` to `account/actions.ts`. Add `updatePersonalInfo` action for first_name/last_name.

**Alternatives considered:**
- Keep account on settings page under a dedicated section: rejected — user explicitly asked to move it to sidebar
- Combine personal info + email into one card: rejected — email change triggers async verification flow, different UX than a simple save

### 4. Sidebar Account entry as a direct `SidebarMenuItem` (not dropdown)

**Decision:** Add `Account` as a plain nav item in `NavMain` linking to `/account`, using the `User` icon (already used in `NavUser` footer). Keep the footer `NavUser` for sign-out but simplify it (or add "Account" as a link there too).

**Alternatives considered:**
- Expand the NavUser footer dropdown with an "Account settings" link: rejected — the footer is tiny and the user asked for sidebar placement
- Replace the footer entirely: rejected — sign-out still belongs in the footer

### 5. DB migration: `011_add_name_columns.sql`

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name TEXT;
```

No NOT NULL constraint or default — the columns can be empty until the user fills them in. Update `src/types/database.ts` to add `first_name: string | null` and `last_name: string | null` to `UserSettings`.

### 6. Per-card save/cancel button pattern (Profile convention)

- Save button: `disabled={pending || !hasChanges}`, right-aligned
- Cancel button: shown only `when hasChanges`, resets state to initial values
- Loading state: `<Loader className="animate-spin" />` + text inside button
- Success/error: `toast.success` / `toast.error` via `useEffect` + `prevStateRef` guard

### 7. Remove "Coming soon" channels

WhatsApp and ntfy.sh rows in `NotificationChannelsCard` and `InstantAlertsCard` are removed entirely. They can be re-added when the features ship.

## Risks / Trade-offs

- **Cross-card validation gap:** If a user sets `notify_threshold=90` then separately sets `instant_alert_threshold=80`, the second card's save will reject with a server error. The client-side warning still shows this visually, but the error message must be clear. Mitigation: `InstantAlertsCard` always reads current `notify_threshold` from its prop and shows the conflict warning before the user attempts save.
- **`settings/actions.ts` cleanup:** `updateNotificationSettings` (legacy, unused) can be removed. `saveNotificationSettings` (current monolithic) can be removed once the 3 split actions are wired. Mitigation: delete both after testing.
- **Migration ordering:** Migration 011 must be applied to the live DB before deploying code that reads/writes `first_name`/`last_name`. The page gracefully handles null values so there's no hard failure if migration lags.
- **NavUser footer display:** The footer currently shows "Account" as a static label. If we show `first_name` there, it requires passing user data to the client component. Mitigation: pass first_name as a prop from the server layout.

## Migration Plan

1. Apply `supabase/migrations/011_add_name_columns.sql` to Supabase manually
2. Deploy code changes (new `/account` page reads columns as nullable — safe before migration too)
3. Verify settings page shows 3 separate save buttons and each saves independently
4. Verify `/account` shows first_name/last_name fields and they persist
5. Verify sidebar shows "Account" link and navigates correctly
6. Remove old `NotificationSettingsPageForm.tsx` and `AccountSettingsForm.tsx` files after verifying no remaining imports

## Open Questions

- Should the sidebar `NavUser` footer be updated to show `first_name` (requires server data in layout)? Currently shows "Account" static text. Can be a follow-up.
- Should `notify_frequency` support `"realtime"` (currently in DB CHECK constraint)? Left out of scope — the UI only shows daily/weekly.
