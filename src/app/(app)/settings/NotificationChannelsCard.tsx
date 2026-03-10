"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader } from "react-feather";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { saveNotificationChannels, CardState } from "./actions";
import { cn } from "@/lib/utils";

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

interface Props {
  initialEnabled: boolean;
  initialFrequency: string;
  initialTime: number;
  initialDays: string[];
}

const initialState: CardState = {};

export function NotificationChannelsCard({
  initialEnabled,
  initialFrequency,
  initialTime,
  initialDays,
}: Props) {
  const [emailEnabled, setEmailEnabled] = useState(initialEnabled);
  const [frequency, setFrequency] = useState<"daily" | "weekly">(
    initialFrequency === "weekly" ? "weekly" : "daily"
  );
  const [deliveryTime, setDeliveryTime] = useState(initialTime);
  const [days, setDays] = useState<string[]>(initialDays);

  const hasChanges =
    emailEnabled !== initialEnabled ||
    frequency !== (initialFrequency === "weekly" ? "weekly" : "daily") ||
    deliveryTime !== initialTime ||
    JSON.stringify([...days].sort()) !== JSON.stringify([...initialDays].sort());

  const handleCancel = () => {
    setEmailEnabled(initialEnabled);
    setFrequency(initialFrequency === "weekly" ? "weekly" : "daily");
    setDeliveryTime(initialTime);
    setDays(initialDays);
  };

  const toggleDay = (id: string) => {
    setDays((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const [state, formAction, pending] = useActionState(saveNotificationChannels, initialState);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Benachrichtigungskanäle gespeichert");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Benachrichtigungs-Kanäle</CardTitle>
        <CardDescription>Über welche Kanäle wirst du informiert?</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="notify_enabled" value={String(emailEnabled)} />
          <input type="hidden" name="notify_frequency" value={frequency} />
          <input type="hidden" name="notify_time" value={deliveryTime} />
          <input type="hidden" name="notify_days" value={JSON.stringify(days)} />

          {/* Email digest toggle */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <Label htmlFor="email-enabled" className="text-sm font-medium cursor-pointer">
                E-Mail Digest
              </Label>
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

              {/* Weekday picker — weekly only */}
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
                          className={cn(
                            "size-9 flex items-center justify-center text-xs font-medium rounded-md border transition-colors",
                            on
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-card text-muted-foreground border-border hover:bg-accent"
                          )}
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

          <div className="flex justify-end gap-3 pt-2">
            {hasChanges && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
            )}
            <Button type="submit" disabled={pending || !hasChanges}>
              {pending ? (
                <>
                  <Loader className="size-4 animate-spin" />
                  Speichern...
                </>
              ) : (
                "Speichern"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
