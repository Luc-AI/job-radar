"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { updateTopPickThreshold, ThresholdSettingsState } from "./actions";

interface ThresholdSettingsFormProps {
  initialThreshold: number;
}

const initialState: ThresholdSettingsState = {};

export function ThresholdSettingsForm({ initialThreshold }: ThresholdSettingsFormProps) {
  const [threshold, setThreshold] = useState(initialThreshold);

  const hasChanges = threshold !== initialThreshold;

  const handleCancel = () => {
    setThreshold(initialThreshold);
  };

  const [state, formAction, pending] = useActionState(
    updateTopPickThreshold,
    initialState
  );

  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Threshold saved");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  const alsoMin = threshold - 15;
  const alsoMax = threshold - 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Pick Threshold</CardTitle>
        <CardDescription>
          Set the minimum score for a job to appear as a "Top Pick" on your dashboard.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="top_pick_threshold" value={threshold} />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="threshold-slider">Threshold</Label>
              <span className="text-sm font-semibold tabular-nums">{threshold}%</span>
            </div>
            <input
              id="threshold-slider"
              type="range"
              min={70}
              max={100}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>70%</span>
              <span>100%</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Also showing jobs scoring {alsoMin}–{alsoMax}% under "Also Worth a Look".
            </p>
          </div>

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
                "Save Threshold"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
