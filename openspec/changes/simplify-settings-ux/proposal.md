## Why

The Settings page bundles all notification configuration into a single monolithic form with one Save button — violating the per-card save pattern used on the Profile page, and making it hard for users to update one concern without accidentally changing others. The Account card (email + delete) is embedded on the settings page, while account management (name, email) has no dedicated place. `first_name` and `last_name` are also missing from the DB entirely despite being useful for personalisation.

## What Changes

- **Split `NotificationSettingsPageForm` into 3 independent card components**, each with its own Save/Cancel buttons and server action:
  - `SearchModeCard` — manages `notify_threshold`
  - `NotificationChannelsCard` — manages `notify_enabled`, `notify_frequency`, `notify_time`, `notify_days`
  - `InstantAlertsCard` — manages `instant_alerts_enabled`, `instant_alert_threshold`, `instant_alert_channels`
- **Remove "Coming soon" channel rows** (WhatsApp, ntfy.sh) from visible UI to reduce clutter
- **Create `/account` page** with 3 focused cards:
  - Personal info (first_name, last_name)
  - Email change
  - Danger zone (delete account)
- **Add "Account" nav item to sidebar** linking to `/account`
- **Add DB migration** (`011_add_name_columns.sql`) adding `first_name TEXT` and `last_name TEXT` to `users`
- **Update `src/types/database.ts`** to include `first_name` and `last_name`
- **Remove `AccountSettingsForm` from settings page**; move `updateEmail` and `deleteAccount` actions to `/account/actions.ts`
- **Document the per-card Save button pattern** in `CLAUDE.md` as the project standard

## Capabilities

### New Capabilities
- `account-page`: Dedicated `/account` page with personal info (first_name, last_name), email management, and danger zone — split into separate save-able cards following the per-card Save pattern

### Modified Capabilities
- `notification-settings`: Notification settings are now split into 3 independent save-able cards (search mode, channels, instant alerts) instead of one monolithic form

## Impact

- **Settings**: `src/app/(app)/settings/page.tsx`, `NotificationSettingsPageForm.tsx` (replaced), `AccountSettingsForm.tsx` (removed), `actions.ts` (split into focused actions)
- **New account section**: `src/app/(app)/account/` (new directory with page, actions, components)
- **Sidebar**: `src/components/AppSidebar.tsx` (add Account nav item)
- **DB**: `supabase/migrations/011_add_name_columns.sql` (add first_name, last_name)
- **Types**: `src/types/database.ts` (add first_name, last_name)
- **Docs**: `CLAUDE.md` (document per-card Save UX pattern)

## DB Fields Inventory

| User Input | DB Column | Status |
|---|---|---|
| notify_threshold (40–95%) | `users.notify_threshold` | ✅ EXISTS |
| notify_enabled | `users.notify_enabled` | ✅ EXISTS |
| notify_frequency (daily\|weekly) | `users.notify_frequency` | ✅ EXISTS |
| notify_time (0–23 hour) | `users.notify_time` | ✅ EXISTS |
| notify_days (TEXT[]) | `users.notify_days` | ✅ EXISTS |
| instant_alerts_enabled | `users.instant_alerts_enabled` | ✅ EXISTS |
| instant_alert_threshold (70–98) | `users.instant_alert_threshold` | ✅ EXISTS |
| instant_alert_channels (TEXT[]) | `users.instant_alert_channels` | ✅ EXISTS |
| Email | `auth.users.email` (+ `users.email`) | ✅ EXISTS |
| First Name | `users.first_name` | ✅ EXISTS (confirmed in Supabase) |
| Last Name | `users.last_name` | ✅ EXISTS (confirmed in Supabase) |
