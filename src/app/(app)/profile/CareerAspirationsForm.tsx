"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateCareerAspirations, CareerAspirationsState } from "./actions";

interface CareerAspirationsFormProps {
  initialSummary: string | null;
}

const initialState: CareerAspirationsState = {};

export function CareerAspirationsForm({
  initialSummary,
}: CareerAspirationsFormProps) {
  // Form state
  const [summary, setSummary] = useState(initialSummary || "");

  // Track if form has changes
  const hasChanges = summary !== (initialSummary || "");

  const handleCancel = () => {
    setSummary(initialSummary || "");
  };

  // Action state
  const [state, formAction, pending] = useActionState(
    updateCareerAspirations,
    initialState
  );

  // Track previous state for detecting successful submissions
  const prevStateRef = useRef(state);

  // Handle success/error toasts
  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Career aspirations saved successfully");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Aspirations</CardTitle>
        <CardDescription>
          Describe what you&apos;re looking for in your next role. This helps
          the AI better understand your goals.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="summary" value={summary} />

          <div>
            <Label htmlFor="career-aspirations" className="mb-2 block">
              What are you looking for?
            </Label>
            <Textarea
              id="career-aspirations"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g., I'm looking for a senior product role at a growth-stage startup where I can lead a team and have significant impact on strategy. I value work-life balance and a collaborative culture..."
              rows={5}
              className="resize-none"
            />
            {summary.length > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                {summary.length.toLocaleString()} characters
              </p>
            )}
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
                "Save"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
