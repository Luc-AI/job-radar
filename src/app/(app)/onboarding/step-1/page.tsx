"use client";

import { useActionState, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TagInput } from "@/components/ui/TagInput";
import { LocationInput } from "@/components/ui/LocationInput";
import { Checkbox } from "@/components/ui/Checkbox";
import { saveJobPreferences, OnboardingState } from "../actions";

const initialState: OnboardingState = {};

export default function OnboardingStep1Page() {
  const [roles, setRoles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [remoteOk, setRemoteOk] = useState(false);

  const [state, formAction, pending] = useActionState(
    saveJobPreferences,
    initialState
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Step 1 of 3</span>
          <span>Job Preferences</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all"
            style={{ width: "33%" }}
          />
        </div>
      </div>

      <Card>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            What jobs are you looking for?
          </h1>
          <p className="mt-2 text-slate-600">
            Tell us about your ideal role so we can find the best matches.
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
          <input
            type="hidden"
            name="locations"
            value={JSON.stringify(locations)}
          />
          <input
            type="hidden"
            name="remoteOk"
            value={remoteOk ? "true" : "false"}
          />

          {/* Job titles/keywords */}
          <div>
            <TagInput
              label="Target job titles or keywords"
              placeholder="e.g., Product Manager, AI Engineer, Marketing Lead"
              value={roles}
              onChange={setRoles}
              error={state.fieldErrors?.roles}
              maxTags={10}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Add titles or keywords that describe the roles you&apos;re
              interested in. Press Enter after each one.
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
              Add the cities or countries where you&apos;d like to work. You can
              type custom locations or select from suggestions.
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
          <div className="flex justify-end pt-6 border-t border-slate-200">
            <Button type="submit" size="lg" isLoading={pending}>
              Next
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
