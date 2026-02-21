"use client";

import { useActionState, useState, useMemo } from "react";
import { Loader } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/TagInput";
import Link from "next/link";
import { saveFinalDetails, FinalDetailsState } from "../actions";
import { cn } from "@/lib/utils";

const PREDEFINED_LANGUAGES = [
  "Deutsch",
  "English",
  "Français",
  "Italiano",
  "Español",
] as const;

const predefinedSet = new Set<string>(PREDEFINED_LANGUAGES);

// Generate time options for the dropdown (9 AM default)
const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: hour,
    label: `${displayHour}:00 ${ampm}`,
  };
});

const initialState: FinalDetailsState = {};

export default function OnboardingStep3Page() {
  const [languages, setLanguages] = useState<string[]>([]);
  const [dealbreakers, setDealbreakers] = useState<string[]>([]);
  const [focus, setFocus] = useState<string[]>([]);

  const customLanguages = useMemo(
    () => languages.filter((l) => !predefinedSet.has(l)),
    [languages]
  );

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const setCustomLanguages = (custom: string[]) => {
    const predefined = languages.filter((l) => predefinedSet.has(l));
    setLanguages([...predefined, ...custom]);
  };

  const [state, formAction, pending] = useActionState(
    saveFinalDetails,
    initialState
  );

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Schritt 3 von 3</span>
          <span>Erweitert</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Fast fertig!</CardTitle>
          <CardDescription>
            Sprachen, Dealbreaker und Schwerpunkte für deine Jobsuche.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{state.error}</p>
            </div>
          )}

          <form action={formAction} className="space-y-6">
            <input type="hidden" name="languages" value={JSON.stringify(languages)} />
            <input type="hidden" name="dealbreakers" value={JSON.stringify(dealbreakers)} />
            <input type="hidden" name="focus" value={JSON.stringify(focus)} />

            <div>
              <Label className="mb-3 block">Sprachen</Label>
              <div className="flex flex-wrap gap-2">
                {PREDEFINED_LANGUAGES.map((lang) => {
                  const isSelected = languages.includes(lang);
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => toggleLanguage(lang)}
                      className={cn(
                        "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:bg-accent"
                      )}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <TagInput
                label="Weitere Sprachen"
                placeholder="z.B. 日本語, 中文, العربية"
                value={customLanguages}
                onChange={setCustomLanguages}
                maxTags={10}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Sprachen die nicht in der Liste oben stehen.
              </p>
            </div>

            <div>
              <TagInput
                label="Dealbreaker / No-Gos"
                placeholder="z.B. kein Consulting, keine Reisetätigkeit >20%"
                value={dealbreakers}
                onChange={setDealbreakers}
                maxTags={15}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Dinge die ein Job auf keinen Fall haben darf.
              </p>
            </div>

            <div>
              <TagInput
                label="Schwerpunkt / Focus"
                placeholder="z.B. AI/ML, People Management, B2B SaaS"
                value={focus}
                onChange={setFocus}
                maxTags={15}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Themen und Bereiche auf die du dich fokussieren willst.
              </p>
            </div>

            {/* Notification time */}
            <div>
              <Label htmlFor="notifyTime" className="mb-2 block">
                Wann möchtest du deinen täglichen Digest erhalten?
              </Label>
              <select
                id="notifyTime"
                name="notifyTime"
                defaultValue={9}
                className="w-full px-3 py-2 border border-border rounded-lg text-foreground
                  focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent
                  bg-background"
              >
                {timeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Wir senden dir deine gematchten Jobs zu dieser Uhrzeit.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-6">
              <Link href="/onboarding/step-2">
                <Button type="button" variant="outline" size="lg">
                  Zurück
                </Button>
              </Link>
              <Button type="submit" size="lg" disabled={pending}>
                {pending ? (
                  <>
                    <Loader className="animate-spin" />
                    Starten...
                  </>
                ) : (
                  "Start Matching"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
