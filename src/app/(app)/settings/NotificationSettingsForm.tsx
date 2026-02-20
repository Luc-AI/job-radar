"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  { value: "9.0", label: "Only the best matches (90% and better)" },
  { value: "8.0", label: "Great matches (80% and better)" },
  { value: "7.0", label: "Good matches (70% and better; recommended)" },
  { value: "6.0", label: "Decent matches (60% and better)" },
  { value: "5.0", label: "Any reasonable match (50% and better)" },
];

export function NotificationSettingsForm({
  email,
  initialNotifyEnabled,
  initialNotifyFrequency,
  initialNotifyThreshold,
}: NotificationSettingsFormProps) {
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
      toast.success("Settings saved successfully");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Notifications</CardTitle>
        <CardDescription>
          Configure when and how you receive job alerts.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Hidden fields for form data */}
          <input type="hidden" name="notifyEnabled" value={notifyEnabled ? "true" : "false"} />
          <input type="hidden" name="notifyFrequency" value={notifyFrequency} />
          <input type="hidden" name="notifyThreshold" value={notifyThreshold} />

          {/* Email display (read-only) */}
          <div>
            <Label className="mb-1 block">Email address</Label>
            <div className="px-3 py-2 rounded-lg border bg-muted text-muted-foreground">
              {email}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Notifications will be sent to this address. You can change your email in Account Settings below.
            </p>
          </div>

          {/* Enable/disable digest */}
          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="notify-enabled"
              checked={notifyEnabled}
              onCheckedChange={(checked) => setNotifyEnabled(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="notify-enabled" className="cursor-pointer">
                Send digest emails
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive a summary of new job matches
              </p>
            </div>
          </div>

          {/* Digest frequency */}
          {notifyEnabled && (
            <div className="space-y-2">
              <Label>Digest frequency</Label>
              <Select value={notifyFrequency} onValueChange={setNotifyFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Digest time (coming soon) */}
          {notifyEnabled && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-muted-foreground">Delivery time</Label>
                <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                  Coming soon
                </span>
              </div>
              <select
                disabled
                className="w-full px-3 py-2 rounded-lg border bg-muted text-muted-foreground cursor-not-allowed"
              >
                <option>9:00 AM</option>
              </select>
            </div>
          )}

          {/* Score threshold */}
          <div className="space-y-2">
            <Label>Minimum match score</Label>
            <Select
              value={notifyThreshold.toString()}
              onValueChange={(val) => setNotifyThreshold(parseFloat(val))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {thresholdOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              Only include jobs at or above this threshold in your notifications.
            </p>
          </div>

          {/* Reassuring message */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-muted-foreground"
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
                <p className="text-sm font-medium">
                  Your job search continues
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {notifyEnabled
                    ? "Even when notifications are paused, we'll keep scanning for great opportunities. You can always check your dashboard for new matches."
                    : "We're still scanning for jobs that match your profile. Toggle notifications back on anytime to start receiving daily digests."}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            {hasChanges && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={pending || !hasChanges}>
              {pending ? (
                <>
                  <Loader className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
