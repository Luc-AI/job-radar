"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader } from "react-feather";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { saveInstantAlerts, CardState } from "./actions";

interface Props {
  initialEnabled: boolean;
  initialThreshold: number;
  initialChannels: string[];
  notifyThreshold: number;
}

const initialState: CardState = {};

export function InstantAlertsCard({
  initialEnabled,
  initialThreshold,
  initialChannels,
  notifyThreshold,
}: Props) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [threshold, setThreshold] = useState(initialThreshold);
  const [channels, setChannels] = useState<string[]>(initialChannels);

  const hasChanges =
    enabled !== initialEnabled ||
    threshold !== initialThreshold ||
    JSON.stringify([...channels].sort()) !== JSON.stringify([...initialChannels].sort());

  const hasThresholdConflict = enabled && threshold < notifyThreshold;

  const handleCancel = () => {
    setEnabled(initialEnabled);
    setThreshold(initialThreshold);
    setChannels(initialChannels);
  };

  const toggleChannel = (id: string) => {
    setChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const [state, formAction, pending] = useActionState(saveInstantAlerts, initialState);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Sofort-Alarme gespeichert");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
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
            checked={enabled}
            onCheckedChange={(v) => setEnabled(Boolean(v))}
            className="mt-0.5 flex-shrink-0"
          />
        </div>
      </CardHeader>

      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="instant_alerts_enabled" value={String(enabled)} />
          <input type="hidden" name="instant_alert_threshold" value={threshold} />
          <input type="hidden" name="instant_alert_channels" value={JSON.stringify(channels)} />
          {/* Pass current search-mode threshold for server-side cross-validation */}
          <input type="hidden" name="notify_threshold" value={notifyThreshold} />

          {enabled && (
            <>
              {/* Threshold conflict warning */}
              {hasThresholdConflict && (
                <div className="flex items-start gap-2 rounded-md bg-destructive/10 border border-destructive/20 p-3">
                  <AlertCircle className="size-4 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-destructive">
                    Sofort-Alarm-Schwellenwert muss grösser oder gleich dem Such-Modus-Schwellenwert ({notifyThreshold}%) sein.
                  </p>
                </div>
              )}

              {/* Threshold slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ab Score</Label>
                  <span className="text-sm font-mono font-semibold px-2 py-0.5 rounded bg-accent text-foreground">
                    {threshold}%
                  </span>
                </div>
                <Slider
                  min={70}
                  max={98}
                  step={1}
                  value={[threshold]}
                  onValueChange={([v]) => setThreshold(v)}
                />
              </div>

              {/* Channel pills */}
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Kanal</p>
                <Button
                  type="button"
                  size="sm"
                  variant={channels.includes("email") ? "default" : "outline"}
                  onClick={() => toggleChannel("email")}
                >
                  E-Mail
                </Button>
              </div>
            </>
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
