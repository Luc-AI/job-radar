"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/TagInput";
import { LocationInput } from "@/components/ui/LocationInput";
import { updateBasics, BasicsState } from "./actions";
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

interface BasicsFormProps {
  initialRoles: string[];
  initialLocations: string[];
  initialWorkModes: string[];
  initialSeniorityLevels: string[];
}

const initialState: BasicsState = {};

export function BasicsForm({
  initialRoles,
  initialLocations,
  initialWorkModes,
  initialSeniorityLevels,
}: BasicsFormProps) {
  const [roles, setRoles] = useState<string[]>(initialRoles);
  const [locations, setLocations] = useState<string[]>(initialLocations);
  const [workModes, setWorkModes] = useState<string[]>(initialWorkModes);
  const [seniorityLevels, setSeniorityLevels] = useState<string[]>(initialSeniorityLevels);

  const hasChanges =
    JSON.stringify(roles) !== JSON.stringify(initialRoles) ||
    JSON.stringify(locations) !== JSON.stringify(initialLocations) ||
    JSON.stringify(workModes) !== JSON.stringify(initialWorkModes) ||
    JSON.stringify(seniorityLevels) !== JSON.stringify(initialSeniorityLevels);

  const handleCancel = () => {
    setRoles(initialRoles);
    setLocations(initialLocations);
    setWorkModes(initialWorkModes);
    setSeniorityLevels(initialSeniorityLevels);
  };

  const toggleItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const [state, formAction, pending] = useActionState(updateBasics, initialState);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Gespeichert");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rolle & Standort</CardTitle>
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

          <div className="flex justify-end gap-3 pt-6">
            {hasChanges && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
            )}
            <Button type="submit" disabled={pending || !hasChanges}>
              {pending ? (
                <>
                  <Loader className="animate-spin" />
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
