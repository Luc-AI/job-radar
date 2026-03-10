"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader } from "react-feather";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteAccount, AccountState } from "./actions";

const initialState: AccountState = {};

export function AccountDangerZone() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");

  const [state, formAction, pending] = useActionState(deleteAccount, initialState);
  const prevStateRef = useRef(state);

  useEffect(() => {
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  const handleOpen = () => { setIsOpen(true); setConfirmation(""); };
  const handleClose = () => { setIsOpen(false); setConfirmation(""); };

  return (
    <>
      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Das Löschen deines Accounts kann nicht rückgängig gemacht werden. Alle deine Daten werden dauerhaft entfernt.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="destructive" onClick={handleOpen}>
            Account löschen
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account löschen</DialogTitle>
            <DialogDescription>Diese Aktion kann nicht rückgängig gemacht werden.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                Diese Aktion ist dauerhaft und kann nicht rückgängig gemacht werden. Alle deine Daten, einschliesslich Profil, Job-Bewertungen und Präferenzen, werden gelöscht.
              </p>
            </div>

            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Tippe <span className="font-mono font-bold">DELETE</span> zur Bestätigung
                </Label>
                <Input
                  type="text"
                  name="confirmation"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="DELETE"
                  autoComplete="off"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={pending || confirmation !== "DELETE"}
                >
                  {pending ? (
                    <>
                      <Loader className="size-4 animate-spin" />
                      Löschen...
                    </>
                  ) : (
                    "Account löschen"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
