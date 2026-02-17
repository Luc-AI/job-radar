"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/TagInput";
import { LocationInput } from "@/components/ui/LocationInput";
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
      toast.success("Preferences saved successfully");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Preferences</CardTitle>
        <CardDescription>
          Update your target roles, locations, and remote work preferences.
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
            <p className="mt-1.5 text-xs text-muted-foreground">
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
            <p className="mt-1.5 text-xs text-muted-foreground">
              Add the cities or countries where you&apos;d like to work.
            </p>
          </div>

          {/* Remote preference */}
          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="remote-ok"
              checked={remoteOk}
              onCheckedChange={(checked) => setRemoteOk(checked === true)}
            />
            <div className="grid gap-1.5 leading-none">
              <Label htmlFor="remote-ok" className="cursor-pointer">
                Open to remote work
              </Label>
              <p className="text-sm text-muted-foreground">
                Include fully remote positions in my matches
              </p>
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
                  <Loader2 className="animate-spin" />
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
