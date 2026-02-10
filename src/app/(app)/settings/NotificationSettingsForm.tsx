"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/components/ui/Toast";
import { updateNotificationSettings, NotificationSettingsState } from "./actions";

interface NotificationSettingsFormProps {
  email: string;
  initialNotifyEnabled: boolean;
  initialNotifyFrequency: string;
  initialNotifyThreshold: number;
}

const initialState: NotificationSettingsState = {};

// Frequency options
const frequencyOptions = [
  { value: "daily", label: "Daily digest" },
  { value: "weekly", label: "Weekly digest" },
];

// Score threshold options (displayed as percentages, stored as 1-10)
const thresholdOptions = [
  { value: 9.0, label: "Only the best matches (90% and better)" },
  { value: 8.0, label: "Great matches (80% and better)" },
  { value: 7.0, label: "Good matches (70% and better; recommended)" },
  { value: 6.0, label: "Decent matches (60% and better)" },
  { value: 5.0, label: "Any reasonable match (50% and better)" },
];

export function NotificationSettingsForm({
  email,
  initialNotifyEnabled,
  initialNotifyFrequency,
  initialNotifyThreshold,
}: NotificationSettingsFormProps) {
  const { showToast } = useToast();

  // Form state
  const [notifyEnabled, setNotifyEnabled] = useState(initialNotifyEnabled);
  const [notifyFrequency, setNotifyFrequency] = useState(initialNotifyFrequency);
  const [notifyThreshold, setNotifyThreshold] = useState(initialNotifyThreshold);

  // Track if form has changes
  const hasChanges =
    notifyEnabled !== initialNotifyEnabled ||
    notifyFrequency !== initialNotifyFrequency ||
    notifyThreshold !== initialNotifyThreshold;

  const handleCancel = () => {
    setNotifyEnabled(initialNotifyEnabled);
    setNotifyFrequency(initialNotifyFrequency);
    setNotifyThreshold(initialNotifyThreshold);
  };

  // Action state
  const [state, formAction, pending] = useActionState(
    updateNotificationSettings,
    initialState
  );

  // Track previous state for detecting successful submissions
  const prevStateRef = useRef(state);

  // Handle success/error toasts
  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      showToast("Settings saved successfully", "success");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      showToast(state.error, "error");
    }
    prevStateRef.current = state;
  }, [state, showToast]);

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Email Notifications</h2>
        <p className="mt-1 text-sm text-slate-600">
          Configure when and how you receive job alerts.
        </p>
      </div>

      {state.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Hidden fields for form data */}
        <input type="hidden" name="notifyEnabled" value={notifyEnabled ? "true" : "false"} />
        <input type="hidden" name="notifyFrequency" value={notifyFrequency} />
        <input type="hidden" name="notifyThreshold" value={notifyThreshold} />

        {/* Email display (read-only) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Email address
          </label>
          <div className="px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
            {email}
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Notifications will be sent to this address. You can change your email in Account Settings below.
          </p>
        </div>

        {/* Enable/disable digest */}
        <div className="pt-2">
          <Checkbox
            label="Send digest emails"
            description="Receive a summary of new job matches"
            checked={notifyEnabled}
            onChange={(e) => setNotifyEnabled(e.target.checked)}
          />
        </div>

        {/* Digest frequency */}
        {notifyEnabled && (
          <Select
            label="Digest frequency"
            value={notifyFrequency}
            onChange={(e) => setNotifyFrequency(e.target.value)}
          >
            {frequencyOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}

        {/* Digest time (coming soon) */}
        {notifyEnabled && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <label className="block text-sm font-medium text-slate-400">
                Delivery time
              </label>
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 text-slate-500 rounded-full">
                Coming soon
              </span>
            </div>
            <select
              disabled
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
            >
              <option>9:00 AM</option>
            </select>
          </div>
        )}

        {/* Score threshold */}
        <Select
          label="Minimum match score"
          value={notifyThreshold}
          onChange={(e) => setNotifyThreshold(parseFloat(e.target.value))}
          helperText="Only include jobs at or above this threshold in your notifications."
        >
          {thresholdOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>

        {/* Reassuring message */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-700 font-medium">
                Your job search continues
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {notifyEnabled
                  ? "Even when notifications are paused, we'll keep scanning for great opportunities. You can always check your dashboard for new matches."
                  : "We're still scanning for jobs that match your profile. Toggle notifications back on anytime to start receiving daily digests."}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          {hasChanges && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={pending} disabled={!hasChanges}>
            Save Settings
          </Button>
        </div>
      </form>
    </Card>
  );
}
