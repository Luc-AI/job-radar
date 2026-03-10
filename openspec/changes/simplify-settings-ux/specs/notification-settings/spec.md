## MODIFIED Requirements

### Requirement: Each notification section saves independently
Notification settings SHALL be split into three independent cards, each with its own form, server action, and Save/Cancel buttons. Saving one card SHALL NOT affect the other sections' state.

#### Scenario: Search mode saves only notify_threshold
- **WHEN** a user selects a search mode preset or adjusts the threshold slider and clicks Save
- **THEN** only `users.notify_threshold` SHALL be updated in the DB
- **THEN** a success toast SHALL confirm the save

#### Scenario: Notification channels saves digest settings
- **WHEN** a user changes email enabled, frequency, delivery time, or weekdays and clicks Save
- **THEN** `users.notify_enabled`, `users.notify_frequency`, `users.notify_time`, and `users.notify_days` SHALL be updated
- **THEN** a success toast SHALL confirm the save

#### Scenario: Instant alerts saves independently
- **WHEN** a user changes instant_alerts_enabled, instant_alert_threshold, or channels and clicks Save
- **THEN** `users.instant_alerts_enabled`, `users.instant_alert_threshold`, and `users.instant_alert_channels` SHALL be updated
- **THEN** a success toast SHALL confirm the save

#### Scenario: Save is disabled when no changes
- **WHEN** no field in a card differs from its loaded initial value
- **THEN** the Save button for that card SHALL be disabled

#### Scenario: Cancel reverts unsaved card changes
- **WHEN** a user has made unsaved edits in a card and clicks Cancel
- **THEN** all fields in that card SHALL revert to their last saved values

---

### Requirement: Cross-card threshold validation
The instant alert threshold MUST be greater than or equal to the search mode threshold. This SHALL be validated server-side in the instant alerts action and shown as a client-side warning.

#### Scenario: Instant threshold below search threshold is rejected
- **WHEN** instant_alert_threshold < notify_threshold
- **THEN** the save action SHALL return an error
- **THEN** a warning banner SHALL be visible inside the instant alerts card

---

### Requirement: Coming-soon channels hidden
Channels not yet available (WhatsApp, ntfy.sh) SHALL NOT appear in the notification channels or instant alerts cards.

#### Scenario: Only email channel is shown
- **WHEN** a user views the notification channels or instant alerts card
- **THEN** only the "E-Mail" channel option SHALL be visible

---

### Requirement: Per-card Save/Cancel button placement
All settings cards SHALL follow the profile-page save button convention: Save and Cancel buttons are right-aligned in a `flex justify-end gap-3 pt-6` wrapper inside the card form. Cancel is only shown when `hasChanges === true`.

#### Scenario: Cancel button visibility
- **WHEN** the user has not changed any field in a card
- **THEN** the Cancel button SHALL NOT be rendered

#### Scenario: Cancel button shown when changes exist
- **WHEN** the user has changed at least one field in a card
- **THEN** the Cancel button SHALL be rendered next to the Save button
