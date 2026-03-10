"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader } from "react-feather";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { saveSearchMode, CardState } from "./actions";
import { cn } from "@/lib/utils";

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

const DEFAULT_THRESHOLD = 75;

interface Props {
  initialThreshold: number;
}

const initialState: CardState = {};

export function SearchModeCard({ initialThreshold }: Props) {
  const [threshold, setThreshold] = useState(initialThreshold);
  const activeMode = SEARCH_MODES.find((m) => m.threshold === threshold);
  const isCustom = !activeMode;
  const hasChanges = threshold !== initialThreshold;

  const handleCancel = () => setThreshold(initialThreshold);

  const [state, formAction, pending] = useActionState(saveSearchMode, initialState);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Such-Modus gespeichert");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Such-Modus</CardTitle>
        <CardDescription>Wie intensiv suchst du gerade?</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="notify_threshold" value={threshold} />

          {/* Mode presets */}
          <div className="space-y-2">
            {SEARCH_MODES.map((mode) => {
              const active = activeMode?.id === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setThreshold(mode.threshold)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors",
                    active
                      ? "border-primary bg-accent"
                      : "border-border bg-card hover:bg-accent/50"
                  )}
                >
                  <span
                    className={cn(
                      "size-4 rounded-full border-2 flex-shrink-0",
                      active ? "border-primary bg-primary" : "border-muted-foreground"
                    )}
                  />
                  <span className="flex-1 min-w-0">
                    <span className={cn("block text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}>
                      {mode.label}
                    </span>
                    <span className="block text-xs text-muted-foreground mt-0.5">
                      {mode.description}
                    </span>
                  </span>
                  <span className={cn("text-sm font-mono font-semibold flex-shrink-0", active ? "text-foreground" : "text-muted-foreground")}>
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
              <span className="text-sm text-muted-foreground">oder Schwellenwert manuell anpassen</span>
              <span className={cn(
                "text-sm font-mono font-semibold px-2 py-0.5 rounded",
                isCustom ? "bg-accent text-foreground" : "text-muted-foreground"
              )}>
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
