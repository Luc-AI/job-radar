"use client";

import { useActionState, useState } from "react";
import { Loader } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/TagInput";
import { LocationInput } from "@/components/ui/LocationInput";
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
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Step 1 of 3</span>
          <span>Job Preferences</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: "33%" }}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">What jobs are you looking for?</CardTitle>
          <CardDescription>
            Tell us about your ideal role so we can find the best matches.
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
            <p className="mt-1.5 text-xs text-muted-foreground">
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
            <p className="mt-1.5 text-xs text-muted-foreground">
              Add the cities or countries where you&apos;d like to work. You can
              type custom locations or select from suggestions.
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
          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? (
                <>
                  <Loader className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
