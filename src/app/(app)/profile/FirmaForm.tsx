"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/TagInput";
import { updateBrancheUnternehmen, BrancheUnternehmenState } from "./actions";

const COMPANY_SIZES = [
  { value: "kleinunternehmen", label: "Kleinunternehmen", description: "< 50 Mitarbeitende" },
  { value: "kmu", label: "KMU", description: "50–250 Mitarbeitende" },
  { value: "mittelstand", label: "Mittelstand", description: "250–5.000 Mitarbeitende" },
  { value: "konzern", label: "Konzern", description: "5.000+ Mitarbeitende" },
] as const;

interface FirmaFormProps {
  initialIndustries: string[];
  initialExcludedIndustries: string[];
  initialCompanySizes: string[];
  initialExcludedCompanies: string[];
  initialWatchlistCompanies: string[];
}

const initialState: BrancheUnternehmenState = {};

export function FirmaForm({
  initialIndustries,
  initialExcludedIndustries,
  initialCompanySizes,
  initialExcludedCompanies,
  initialWatchlistCompanies,
}: FirmaFormProps) {
  const [industries, setIndustries] = useState<string[]>(initialIndustries);
  const [excludedIndustries, setExcludedIndustries] = useState<string[]>(initialExcludedIndustries);
  const [companySizes, setCompanySizes] = useState<string[]>(initialCompanySizes);
  const [excludedCompanies, setExcludedCompanies] = useState<string[]>(initialExcludedCompanies);
  const [watchlistCompanies, setWatchlistCompanies] = useState<string[]>(initialWatchlistCompanies);

  const hasChanges =
    JSON.stringify(industries) !== JSON.stringify(initialIndustries) ||
    JSON.stringify(excludedIndustries) !== JSON.stringify(initialExcludedIndustries) ||
    JSON.stringify(companySizes) !== JSON.stringify(initialCompanySizes) ||
    JSON.stringify(excludedCompanies) !== JSON.stringify(initialExcludedCompanies) ||
    JSON.stringify(watchlistCompanies) !== JSON.stringify(initialWatchlistCompanies);

  const handleCancel = () => {
    setIndustries(initialIndustries);
    setExcludedIndustries(initialExcludedIndustries);
    setCompanySizes(initialCompanySizes);
    setExcludedCompanies(initialExcludedCompanies);
    setWatchlistCompanies(initialWatchlistCompanies);
  };

  const toggleSize = (size: string) => {
    setCompanySizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const [state, formAction, pending] = useActionState(updateBrancheUnternehmen, initialState);
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
        <CardTitle>Branche & Unternehmen</CardTitle>
        <CardDescription>
          Branchen, Firmengrösse und spezifische Unternehmen für deine Jobsuche.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="industries" value={JSON.stringify(industries)} />
          <input type="hidden" name="excludedIndustries" value={JSON.stringify(excludedIndustries)} />
          <input type="hidden" name="companySizes" value={JSON.stringify(companySizes)} />
          <input type="hidden" name="excludedCompanies" value={JSON.stringify(excludedCompanies)} />
          <input type="hidden" name="watchlistCompanies" value={JSON.stringify(watchlistCompanies)} />

          <div>
            <TagInput
              label="Bevorzugte Branchen"
              placeholder="z.B. FinTech, HealthTech, SaaS"
              value={industries}
              onChange={setIndustries}
              maxTags={15}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Branchen die dich interessieren. Leer lassen = alle Branchen.
            </p>
          </div>

          <div>
            <TagInput
              label="Ausgeschlossene Branchen"
              placeholder="z.B. Tabak, Rüstung, Gambling"
              value={excludedIndustries}
              onChange={setExcludedIndustries}
              maxTags={10}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Branchen die du komplett ausschliessen willst (optional).
            </p>
          </div>

          <div>
            <Label className="mb-3 block">Bevorzugte Firmengrösse</Label>
            <div className="grid grid-cols-2 gap-3">
              {COMPANY_SIZES.map((size) => (
                <label
                  key={size.value}
                  className="flex items-start space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={companySizes.includes(size.value)}
                    onCheckedChange={() => toggleSize(size.value)}
                  />
                  <div className="grid gap-0.5 leading-none">
                    <span className="text-sm font-medium">{size.label}</span>
                    <span className="text-xs text-muted-foreground">{size.description}</span>
                  </div>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Mehrfachauswahl möglich. Leer lassen = keine Präferenz.
            </p>
          </div>

          <div>
            <TagInput
              label="Blacklist Unternehmen"
              placeholder="z.B. aktueller Arbeitgeber"
              value={excludedCompanies}
              onChange={setExcludedCompanies}
              maxTags={20}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Unternehmen die ausgeschlossen werden sollen (optional).
            </p>
          </div>

          <div>
            <TagInput
              label="Watchlist Unternehmen"
              placeholder="z.B. Stripe, Figma, N26"
              value={watchlistCompanies}
              onChange={setWatchlistCompanies}
              maxTags={20}
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Unternehmen die immer hoch scoren sollen (optional).
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t">
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
