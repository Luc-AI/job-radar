"use client";

import { useActionState, useState } from "react";
import { Loader } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/TagInput";
import Link from "next/link";
import { saveBrancheUnternehmen, BrancheUnternehmenState } from "../actions";

const COMPANY_SIZES = [
  { value: "kleinunternehmen", label: "Kleinunternehmen", description: "< 50 Mitarbeitende" },
  { value: "kmu", label: "KMU", description: "50–250 Mitarbeitende" },
  { value: "mittelstand", label: "Mittelstand", description: "250–5.000 Mitarbeitende" },
  { value: "konzern", label: "Konzern", description: "5.000+ Mitarbeitende" },
] as const;

const initialState: BrancheUnternehmenState = {};

export default function OnboardingStep2Page() {
  const [industries, setIndustries] = useState<string[]>([]);
  const [excludedIndustries, setExcludedIndustries] = useState<string[]>([]);
  const [companySizes, setCompanySizes] = useState<string[]>([]);
  const [excludedCompanies, setExcludedCompanies] = useState<string[]>([]);
  const [watchlistCompanies, setWatchlistCompanies] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setCompanySizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const [state, formAction, pending] = useActionState(
    saveBrancheUnternehmen,
    initialState
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Schritt 2 von 3</span>
          <span>Branche & Unternehmen</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: "66%" }}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Branche & Unternehmen</CardTitle>
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

            {/* Actions */}
            <div className="flex justify-between pt-6">
              <Link href="/onboarding/step-1">
                <Button type="button" variant="outline" size="lg">
                  Zurück
                </Button>
              </Link>
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
