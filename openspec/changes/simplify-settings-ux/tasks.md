## 1. Database & Types

- [x] 1.1 Create `supabase/migrations/011_add_name_columns.sql` — **SKIP: columns already exist in live DB**
- [x] 1.2 Apply migration — **SKIP: already applied**
- [x] 1.3 Update `src/types/database.ts` — add `first_name: string | null` and `last_name: string | null` to `UserSettings`

## 2. Settings Page — Split Notification Cards

- [x] 2.1 Create `src/app/(app)/settings/SearchModeCard.tsx` — standalone card with `useActionState(saveSearchMode, {})`, threshold slider + presets, Save/Cancel buttons per profile pattern
- [x] 2.2 Create `src/app/(app)/settings/NotificationChannelsCard.tsx` — standalone card with `useActionState(saveNotificationChannels, {})`, email toggle/frequency/time/days (no WhatsApp/ntfy.sh rows), Save/Cancel
- [x] 2.3 Create `src/app/(app)/settings/InstantAlertsCard.tsx` — standalone card with `useActionState(saveInstantAlerts, {})`, enabled toggle + threshold slider + email-only channel, cross-threshold warning banner, Save/Cancel. Pass `notifyThreshold` as hidden field for server validation.
- [x] 2.4 Add `saveSearchMode` server action to `src/app/(app)/settings/actions.ts` — validates notify_threshold (40–95), updates only `notify_threshold`
- [x] 2.5 Add `saveNotificationChannels` server action to `src/app/(app)/settings/actions.ts` — validates and updates `notify_enabled`, `notify_frequency`, `notify_time`, `notify_days`
- [x] 2.6 Add `saveInstantAlerts` server action to `src/app/(app)/settings/actions.ts` — validates `instant_alerts_enabled`, `instant_alert_threshold`, `instant_alert_channels`, cross-validates `instantThreshold >= notifyThreshold`
- [x] 2.7 Update `src/app/(app)/settings/page.tsx` — replace `<NotificationSettingsPageForm …/>` with the three new card components; remove `<AccountSettingsForm …/>`; add `top_pick_threshold` to the DB select if missing; update imports
- [x] 2.8 Delete `src/app/(app)/settings/NotificationSettingsPageForm.tsx` (replaced by 3 separate cards)
- [x] 2.9 Delete `src/app/(app)/settings/AccountSettingsForm.tsx` (moved to `/account`)
- [x] 2.10 Remove unused `saveNotificationSettings`, `updateNotificationSettings`, `updateEmail`, `deleteAccount` exports from `src/app/(app)/settings/actions.ts`

## 3. Account Page — New Route

- [x] 3.1 Create `src/app/(app)/account/actions.ts` — export `updatePersonalInfo` (saves first_name, last_name), `updateEmail` (copy from settings/actions.ts), `deleteAccount` (copy from settings/actions.ts)
- [x] 3.2 Create `src/app/(app)/account/AccountPersonalForm.tsx` — card with first_name + last_name inputs, `useActionState(updatePersonalInfo, {})`, Save/Cancel with hasChanges guard
- [x] 3.3 Create `src/app/(app)/account/AccountSecurityForm.tsx` — card for email change (copy + adapt `EmailEditForm` logic from `AccountSettingsForm`)
- [x] 3.4 Create `src/app/(app)/account/AccountDangerZone.tsx` — card with delete account flow (copy + adapt from `AccountSettingsForm`)
- [x] 3.5 Create `src/app/(app)/account/page.tsx` — server component that fetches `first_name`, `last_name`, `email` from `users`; renders `AccountPersonalForm`, `AccountSecurityForm`, `AccountDangerZone`

## 4. Sidebar Navigation

- [x] 4.1 Update `src/components/AppSidebar.tsx` — add "Account" `SidebarMenuItem` in `NavMain` linking to `/account` with `User` icon; add `isActive` check for `/account` path
- [x] 4.2 Update the Settings `SidebarMenuItem` in `AppSidebar.tsx` to use the `Bell` icon with label "Benachrichtigungen" (or keep "Settings" — decide at implementation)

## 5. Documentation

- [x] 5.1 Update `CLAUDE.md` — add a "UX Patterns" section documenting the per-card save pattern: each card is a self-contained form with `useActionState`, Save (disabled when no changes) and Cancel (shown only when `hasChanges`), success/error via `toast`, `prevStateRef` guard

## 6. Verification

- [ ] 6.1 Navigate to `/settings` — confirm 3 separate cards render with individual Save buttons; saving one card does not reset another *(manual QA)*
- [ ] 6.2 Verify each save action updates only the correct DB columns (check Supabase directly) *(manual QA)*
- [ ] 6.3 Navigate to `/account` — confirm personal info, email, and danger zone cards render *(manual QA)*
- [ ] 6.4 Save first_name + last_name — confirm values persist in Supabase `users` table *(manual QA)*
- [ ] 6.5 Confirm sidebar shows "Account" link and highlights correctly on `/account` *(manual QA)*
- [ ] 6.6 Confirm `/settings` no longer shows email management or account deletion UI *(manual QA)*
