"use client";

import { useActionState, useState, useEffect, useRef, useMemo } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TagInput } from "@/components/ui/TagInput";
import { updateAdvanced, AdvancedState } from "./actions";
import { cn } from "@/lib/utils";

const PREDEFINED_LANGUAGES = [
  "Deutsch",
  "English",
  "Français",
  "Italiano",
  "Español",
] as const;

const predefinedSet = new Set<string>(PREDEFINED_LANGUAGES);

interface AdvancedFormProps {
  initialLanguages: string[];
  initialDealbreakers: string[];
  initialFocus: string[];
}

const initialState: AdvancedState = {};

export function AdvancedForm({
  initialLanguages,
  initialDealbreakers,
  initialFocus,
}: AdvancedFormProps) {
  const [languages, setLanguages] = useState<string[]>(initialLanguages);
  const [dealbreakers, setDealbreakers] = useState<string[]>(initialDealbreakers);
  const [focus, setFocus] = useState<string[]>(initialFocus);

  // Split languages into predefined chips and custom entries
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

  const hasChanges =
    JSON.stringify(languages) !== JSON.stringify(initialLanguages) ||
    JSON.stringify(dealbreakers) !== JSON.stringify(initialDealbreakers) ||
    JSON.stringify(focus) !== JSON.stringify(initialFocus);

  const handleCancel = () => {
    setLanguages(initialLanguages);
    setDealbreakers(initialDealbreakers);
    setFocus(initialFocus);
  };

  const [state, formAction, pending] = useActionState(updateAdvanced, initialState);
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
        <CardTitle>Erweitert</CardTitle>
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
