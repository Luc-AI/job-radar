"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader } from "react-feather";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { saveNotificationSettings } from "./actions";

const SEARCH_MODES = [
  {
    id: "active" as const,
    label: "Aktive Suche",
    threshold: 60,
    description: "Alles Relevante sehen – du bist aktiv auf Jobsuche",
  },
  {
    id: "quality" as const,
    label: "Qualitätsfokus",
    threshold: 75,
    description: "Nur gute Matches – offen für den richtigen Move",
  },
  {
    id: "top" as const,
    label: "Nur Top-Picks",
    threshold: 85,
    description: "Nur aussergewöhnliche Chancen – du bist zufrieden, aber offen",
  },
] as const;

const DELIVERY_TIMES = [6, 7, 8, 9, 10, 12, 18, 20];
const DAYS = [
  { id: "mon", label: "Mo" },
  { id: "tue", label: "Di" },
  { id: "wed", label: "Mi" },
  { id: "thu", label: "Do" },
  { id: "fri", label: "Fr" },
  { id: "sat", label: "Sa" },
  { id: "sun", label: "So" },
];

function formatHour(h: number) {
  return `${String(h).padStart(2, "0")}:00`;
}

const DEFAULT_THRESHOLD = 75; // Qualitätsfokus default

interface Props {
  initialNotifyEnabled: boolean;
  initialNotifyFrequency: string;
  initialNotifyThreshold: number;
  initialNotifyTime: number;
  initialNotifyDays: string[];
  initialInstantEnabled: boolean;
  initialInstantThreshold: number;
  initialInstantChannels: string[];
}

export function NotificationSettingsPageForm({
  initialNotifyEnabled,
  initialNotifyFrequency,
  initialNotifyThreshold,
  initialNotifyTime,
  initialNotifyDays,
  initialInstantEnabled,
  initialInstantThreshold,
  initialInstantChannels,
}: Props) {
  // Section 1 – Such-Modus
  const [threshold, setThreshold] = useState(initialNotifyThreshold);
  // Derive active mode by matching threshold to preset values
  const activeMode = SEARCH_MODES.find((m) => m.threshold === threshold);
  const isCustom = !activeMode;

  // Section 2 – Channels
  const [emailEnabled, setEmailEnabled] = useState(initialNotifyEnabled);
  const [frequency, setFrequency] = useState<"daily" | "weekly">(
    initialNotifyFrequency === "weekly" ? "weekly" : "daily"
  );
  const [deliveryTime, setDeliveryTime] = useState(initialNotifyTime);
  const [days, setDays] = useState<string[]>(initialNotifyDays);

  // Section 3 – Instant alerts
  const [instantEnabled, setInstantEnabled] = useState(initialInstantEnabled);
  const [instantThreshold, setInstantThreshold] = useState(initialInstantThreshold);
  const [instantChannels, setInstantChannels] = useState<string[]>(initialInstantChannels);

  // Submission
  const [state, formAction, pending] = useActionState(saveNotificationSettings, {});
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Einstellungen gespeichert");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  function toggleDay(id: string) {
    setDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  }

  function toggleInstantChannel(id: string) {
    setInstantChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* Hidden inputs */}
      <input type="hidden" name="notify_threshold" value={threshold} />
      <input type="hidden" name="notify_enabled" value={String(emailEnabled)} />
      <input type="hidden" name="notify_frequency" value={frequency} />
      <input type="hidden" name="notify_time" value={deliveryTime} />
      <input type="hidden" name="notify_days" value={JSON.stringify(days)} />
      <input type="hidden" name="instant_alerts_enabled" value={String(instantEnabled)} />
      <input type="hidden" name="instant_alert_threshold" value={instantThreshold} />
      <input type="hidden" name="instant_alert_channels" value={JSON.stringify(instantChannels)} />

      {/* ── Section 1: Such-Modus ── */}
      <Card>
        <CardHeader>
          <CardTitle>Such-Modus</CardTitle>
          <CardDescription>Wie intensiv suchst du gerade?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Mode presets */}
          <div className="space-y-2">
            {SEARCH_MODES.map((mode) => {
              const active = activeMode?.id === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setThreshold(mode.threshold)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    active
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:bg-accent/50"
                  }`}
                >
                  <span
                    className={`size-4 rounded-full border-2 flex-shrink-0 ${
                      active ? "border-primary bg-primary" : "border-muted-foreground"
                    }`}
                  />
                  <span className="flex-1 min-w-0">
                    <span className={`block text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                      {mode.label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {mode.description}
                    </span>
                  </span>
                  <span className={`text-sm font-mono font-semibold flex-shrink-0 ${active ? "text-foreground" : "text-muted-foreground"}`}>
                    {mode.threshold}%
                  </span>
                </button>
              );
            })}
          </div>

          <Separator className="border-dashed" />

          {/* Manual slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Schwellenwert manuell anpassen</span>
              <span className={`text-sm font-mono font-semibold px-2 py-0.5 rounded ${
                isCustom ? "bg-accent text-foreground" : "text-muted-foreground"
              }`}>
                {threshold}%
              </span>
            </div>
            <Slider
              min={40}
              max={95}
              step={1}
              value={[threshold]}
              onValueChange={([v]) => setThreshold(v)}
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>40</span><span>60</span><span>75</span><span>85</span><span>95</span>
            </div>
          </div>

          {isCustom && (
            <button
              type="button"
              onClick={() => setThreshold(DEFAULT_THRESHOLD)}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Zurück zum Modus-Standard ({DEFAULT_THRESHOLD}%)
            </button>
          )}
        </CardContent>
      </Card>

      {/* ── Section 2: Notification Channels ── */}
      <Card>
        <CardHeader>
          <CardTitle>Benachrichtigungs-Kanäle</CardTitle>
          <CardDescription>Über welche Kanäle wirst du informiert?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Email digest */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">E-Mail Digest</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">Zusammenfassung der besten Matches</p>
              </div>
              <Checkbox
                id="email-enabled"
                checked={emailEnabled}
                onCheckedChange={(v) => setEmailEnabled(Boolean(v))}
              />
            </div>

            {emailEnabled && (
              <div className="pl-4 border-l-2 border-border space-y-4">
                {/* Frequency */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Frequenz</p>
                  <div className="flex gap-2">
                    {(["daily", "weekly"] as const).map((f) => (
                      <Button
                        key={f}
                        type="button"
                        size="sm"
                        variant={frequency === f ? "default" : "outline"}
                        onClick={() => setFrequency(f)}
                      >
                        {f === "daily" ? "Täglich" : "Wöchentlich"}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Delivery time */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Zustellung um</p>
                  <div className="flex flex-wrap gap-1.5">
                    {DELIVERY_TIMES.map((h) => (
                      <Button
                        key={h}
                        type="button"
                        size="sm"
                        variant={deliveryTime === h ? "default" : "outline"}
                        onClick={() => setDeliveryTime(h)}
                        className="font-mono"
                      >
                        {formatHour(h)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Weekday picker (weekly only) */}
                {frequency === "weekly" && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">An diesen Tagen</p>
                    <div className="flex gap-1.5">
                      {DAYS.map((d) => {
                        const on = days.includes(d.id);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => toggleDay(d.id)}
                            className={`size-9 flex items-center justify-center text-xs font-medium rounded-md border transition-colors ${
                              on
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card text-muted-foreground border-border hover:bg-accent"
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* WhatsApp – coming soon */}
          <div className="flex items-center justify-between gap-3 opacity-60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">WhatsApp</span>
                <Badge variant="outline" className="text-xs">Coming soon</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Benachrichtigungen direkt aufs Handy</p>
            </div>
            <Checkbox disabled checked={false} />
          </div>

          <Separator />

          {/* ntfy.sh – coming soon */}
          <div className="flex items-center justify-between gap-3 opacity-60">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">ntfy.sh Push</span>
                <Badge variant="outline" className="text-xs">Coming soon</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Open-Source Push-Notifications</p>
            </div>
            <Checkbox disabled checked={false} />
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: Instant Alerts ── */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Sofort-Alarme</CardTitle>
              <CardDescription className="mt-1">
                Sofort benachrichtigt werden bei Top-Matches – unabhängig vom Digest.
              </CardDescription>
            </div>
            <Checkbox
              id="instant-enabled"
              checked={instantEnabled}
              onCheckedChange={(v) => setInstantEnabled(Boolean(v))}
              className="mt-0.5 flex-shrink-0"
            />
          </div>
        </CardHeader>

        {instantEnabled && (
          <CardContent className="space-y-4">
            {/* Threshold conflict error */}
            {instantThreshold < threshold && (
              <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-3">
                <AlertCircle className="size-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs text-destructive">
                  Sofort-Alarm-Schwellenwert muss grösser oder gleich dem Such-Modus-Schwellenwert ({threshold}%) sein.
                </p>
              </div>
            )}

            {/* Instant threshold slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ab Score</p>
                <span className="text-sm font-mono font-semibold px-2 py-0.5 rounded bg-accent text-foreground">
                  {instantThreshold}%
                </span>
              </div>
              <Slider
                min={70}
                max={98}
                step={1}
                value={[instantThreshold]}
                onValueChange={([v]) => setInstantThreshold(v)}
              />
            </div>

            {/* Channel pills */}
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kanal</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={instantChannels.includes("email") ? "default" : "outline"}
                  onClick={() => toggleInstantChannel("email")}
                >
                  E-Mail
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled
                  className="opacity-40"
                >
                  WhatsApp
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled
                  className="opacity-40"
                >
                  ntfy.sh
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                WhatsApp und ntfy.sh sind bald als Sofort-Kanal verfügbar.
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ── Info Banner ── */}
      <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 space-y-1">
        <p className="text-sm font-medium text-foreground">Deine Jobsuche läuft immer weiter</p>
        <p className="text-xs text-muted-foreground">
          Auch wenn Benachrichtigungen pausiert sind – wir scannen weiter nach passenden Stellen. Neue Matches findest du jederzeit im Dashboard.
        </p>
      </div>

      {/* ── Save Button ── */}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? (
          <Loader className="size-4 animate-spin" />
        ) : (
          "Einstellungen speichern"
        )}
      </Button>
    </form>
  );
}
