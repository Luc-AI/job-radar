"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader } from "react-feather";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateEmail, AccountState } from "./actions";

interface Props {
  email: string;
}

const initialState: AccountState = {};

export function AccountSecurityForm({ email }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const [state, formAction, pending] = useActionState(updateEmail, initialState);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success(state.message || "E-Mail aktualisiert");
      setIsEditing(false);
      setNewEmail("");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>E-Mail-Adresse</CardTitle>
        <CardDescription>Deine Login-E-Mail und Adresse für Benachrichtigungen.</CardDescription>
      </CardHeader>
      <CardContent>
        {!isEditing ? (
          <div className="flex items-center gap-3">
            <div className="flex-1 px-3 py-2 rounded-md border bg-muted text-muted-foreground text-sm">
              {email}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Ändern
            </Button>
          </div>
        ) : (
          <form action={formAction} className="space-y-3">
            <p className="text-sm text-muted-foreground">Aktuelle E-Mail: {email}</p>
            <div className="space-y-2">
              <Label htmlFor="email">Neue E-Mail-Adresse</Label>
              <Input
                id="email"
                type="email"
                name="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="neue@email.com"
                aria-invalid={!!state.error}
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => { setIsEditing(false); setNewEmail(""); }}
              >
                Abbrechen
              </Button>
              <Button type="submit" size="sm" disabled={pending || !newEmail}>
                {pending ? (
                  <>
                    <Loader className="size-4 animate-spin" />
                    Aktualisieren...
                  </>
                ) : (
                  "E-Mail aktualisieren"
                )}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
