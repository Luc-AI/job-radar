"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TagInput } from "@/components/ui/TagInput";
import { LocationInput } from "@/components/ui/LocationInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/components/ui/Toast";
import { updateJobPreferences, JobPreferencesState } from "./actions";

interface JobPreferencesFormProps {
  initialRoles: string[];
  initialLocations: string[];
  initialRemoteOk: boolean;
}

const initialState: JobPreferencesState = {};

export function JobPreferencesForm({
  initialRoles,
  initialLocations,
  initialRemoteOk,
}: JobPreferencesFormProps) {
  const { showToast } = useToast();

  // Form state
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [locations, setLocations] = useState<string[]>(initialLocations);
  const [remoteOk, setRemoteOk] = useState(initialRemoteOk);

  // Track if form has changes
  const hasChanges =
    JSON.stringify(roles) !== JSON.stringify(initialRoles) ||
    JSON.stringify(locations) !== JSON.stringify(initialLocations) ||
    remoteOk !== initialRemoteOk;

  const handleCancel = () => {
    setRoles(initialRoles);
    setLocations(initialLocations);
    setRemoteOk(initialRemoteOk);
  };

  // Action state
  const [state, formAction, pending] = useActionState(
    updateJobPreferences,
    initialState
  );

  // Track previous state for detecting successful submissions
  const prevStateRef = useRef(state);

  // Handle success/error toasts
  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      showToast("Preferences saved successfully", "success");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      showToast(state.error, "error");
    }
    prevStateRef.current = state;
  }, [state, showToast]);

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Job Preferences</h2>
        <p className="mt-1 text-sm text-slate-600">
          Update your target roles, locations, and remote work preferences.
        </p>
      </div>

      {state.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        {/* Hidden fields for form data */}
        <input type="hidden" name="roles" value={JSON.stringify(roles)} />
        <input type="hidden" name="locations" value={JSON.stringify(locations)} />
        <input type="hidden" name="remoteOk" value={remoteOk ? "true" : "false"} />

        {/* Job titles/keywords */}
        <div>
          <TagInput
            label="Target job titles or keywords"
            placeholder="e.g., Product Manager, AI Engineer"
            value={roles}
            onChange={setRoles}
            error={state.fieldErrors?.roles}
            maxTags={10}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Add titles or keywords that describe the roles you&apos;re interested in.
          </p>
        </div>

        {/* Locations */}
        <div>
          <LocationInput
            label="Preferred locations"
            placeholder="Search or type a city/country"
            value={locations}
            onChange={setLocations}
            error={state.fieldErrors?.locations}
            maxLocations={5}
          />
          <p className="mt-1.5 text-xs text-slate-500">
            Add the cities or countries where you&apos;d like to work.
          </p>
        </div>

        {/* Remote preference */}
        <div className="pt-2">
          <Checkbox
            label="Open to remote work"
            description="Include fully remote positions in my matches"
            checked={remoteOk}
            onChange={(e) => setRemoteOk(e.target.checked)}
          />
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
