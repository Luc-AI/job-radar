"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader } from "react-feather";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePersonalInfo, AccountState } from "./actions";

interface Props {
  initialFirstName: string;
  initialLastName: string;
}

const initialState: AccountState = {};

export function AccountPersonalForm({ initialFirstName, initialLastName }: Props) {
  const [firstName, setFirstName] = useState(initialFirstName);
  const [lastName, setLastName] = useState(initialLastName);

  const hasChanges =
    firstName !== initialFirstName || lastName !== initialLastName;

  const handleCancel = () => {
    setFirstName(initialFirstName);
    setLastName(initialLastName);
  };

  const [state, formAction, pending] = useActionState(updatePersonalInfo, initialState);
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
        <CardTitle>Persönliche Angaben</CardTitle>
        <CardDescription>Dein Name wie er im Account hinterlegt ist.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Vorname</Label>
              <Input
                id="first_name"
                name="first_name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Max"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nachname</Label>
              <Input
                id="last_name"
                name="last_name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Mustermann"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {hasChanges && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Abbrechen
              </Button>
            )}
            <Button type="submit" disabled={pending || !hasChanges}>
              {pending ? (
                <>
                  <Loader className="size-4 animate-spin" />
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
