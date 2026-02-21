"use client";

import { useActionState, useState } from "react";
import { Loader } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/TagInput";
import { LocationInput } from "@/components/ui/LocationInput";
import { saveJobPreferences, OnboardingState } from "../actions";
import { cn } from "@/lib/utils";

const WORK_MODES = [
  { value: "onsite", label: "On-site" },
  { value: "hybrid", label: "Hybrid" },
  { value: "remote_ok", label: "Remote OK" },
  { value: "remote_solely", label: "Remote Solely" },
] as const;

const SENIORITY_LEVELS = [
  { value: "junior", label: "Junior" },
  { value: "mid", label: "Mid-Level" },
  { value: "senior", label: "Senior" },
  { value: "lead", label: "Lead" },
  { value: "clevel", label: "C-Level" },
] as const;

const initialState: OnboardingState = {};

export default function OnboardingStep1Page() {
  const [roles, setRoles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [workModes, setWorkModes] = useState<string[]>([]);
  const [seniorityLevels, setSeniorityLevels] = useState<string[]>([]);

  const toggleItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const [state, formAction, pending] = useActionState(
    saveJobPreferences,
    initialState
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Schritt 1 von 3</span>
          <span>Rolle & Standort</span>
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
          <CardTitle className="text-2xl">Rolle & Standort</CardTitle>
          <CardDescription>
            Was suchst du und wo willst du arbeiten?
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="roles" value={JSON.stringify(roles)} />
            <input type="hidden" name="locations" value={JSON.stringify(locations)} />
            <input type="hidden" name="workModes" value={JSON.stringify(workModes)} />
            <input type="hidden" name="seniorityLevels" value={JSON.stringify(seniorityLevels)} />

            <div>
              <TagInput
                label="Rollen"
                placeholder="z.B. Product Manager, AI Engineer"
                value={roles}
                onChange={setRoles}
                error={state.fieldErrors?.roles}
                maxTags={10}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Job-Titel oder Keywords die deine Wunschrollen beschreiben.
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Senioritätslevel</Label>
              <div className="flex flex-wrap gap-2">
                {SENIORITY_LEVELS.map((level) => {
                  const isSelected = seniorityLevels.includes(level.value);
                  return (
                    <button
                      key={level.value}
                      type="button"
                      onClick={() => toggleItem(level.value, setSeniorityLevels)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:bg-accent"
                      )}
                    >
                      {level.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Mehrfachauswahl möglich. Leer lassen = keine Präferenz.
              </p>
            </div>

            <div>
              <LocationInput
                label="Standorte"
                placeholder="Stadt oder Land suchen"
                value={locations}
                onChange={setLocations}
                error={state.fieldErrors?.locations}
                maxLocations={5}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Städte oder Länder in denen du arbeiten möchtest.
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Arbeitsmodell</Label>
              <div className="flex flex-wrap gap-2">
                {WORK_MODES.map((mode) => {
                  const isSelected = workModes.includes(mode.value);
                  return (
                    <button
                      key={mode.value}
                      type="button"
                      onClick={() => toggleItem(mode.value, setWorkModes)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:bg-accent"
                      )}
                    >
                      {mode.label}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Mehrfachauswahl möglich. Leer lassen = keine Präferenz.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-6">
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? (
                  <>
                    <Loader className="animate-spin" />
                    Speichern...
                  </>
                ) : (
                  "Weiter"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
