"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { updateCareerAspirations, CareerAspirationsState } from "./actions";

interface CareerAspirationsFormProps {
  initialSummary: string | null;
}

const initialState: CareerAspirationsState = {};

export function CareerAspirationsForm({
  initialSummary,
}: CareerAspirationsFormProps) {
  const { showToast } = useToast();

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
      showToast("Career aspirations saved successfully", "success");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      showToast(state.error, "error");
    }
    prevStateRef.current = state;
  }, [state, showToast]);

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Career Aspirations
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Describe what you&apos;re looking for in your next role. This helps
          the AI better understand your goals.
        </p>
      </div>

      {state.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="summary" value={summary} />

        <div>
          <label
            htmlFor="career-aspirations"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            What are you looking for?
          </label>
          <textarea
            id="career-aspirations"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="e.g., I'm looking for a senior product role at a growth-stage startup where I can lead a team and have significant impact on strategy. I value work-life balance and a collaborative culture..."
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
              resize-none text-sm"
          />
          {summary.length > 0 && (
            <p className="mt-1 text-xs text-slate-500">
              {summary.length.toLocaleString()} characters
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          {hasChanges && (
            <Button type="button" variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={pending} disabled={!hasChanges}>
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
}
