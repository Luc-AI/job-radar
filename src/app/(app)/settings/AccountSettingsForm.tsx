"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateEmail, deleteAccount, AccountSettingsState } from "./actions";

interface AccountSettingsFormProps {
  email: string;
}

const initialState: AccountSettingsState = {};

function EmailEditForm({
  currentEmail,
  onCancel,
}: {
  currentEmail: string;
  onCancel: () => void;
}) {
  const [newEmail, setNewEmail] = useState("");
  const [emailState, emailAction, emailPending] = useActionState(
    updateEmail,
    initialState
  );

  const prevStateRef = useRef(emailState);

  useEffect(() => {
    if (emailState.success && !prevStateRef.current.success) {
      toast.success(emailState.message || "Email updated");
      onCancel();
    }
    if (emailState.error && emailState.error !== prevStateRef.current.error) {
      toast.error(emailState.error);
    }
    prevStateRef.current = emailState;
  }, [emailState, onCancel]);

  return (
    <form action={emailAction} className="space-y-3">
      <p className="text-sm text-muted-foreground mb-2">
        Aktuelle E-Mail: {currentEmail}
      </p>
      <div className="space-y-2">
        <Input
          type="email"
          name="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Neue E-Mail-Adresse"
          aria-invalid={!!emailState.error}
        />
        {emailState.error && (
          <p className="text-sm text-destructive">{emailState.error}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Abbrechen
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={emailPending || !newEmail}
        >
          {emailPending ? (
            <>
              <Loader className="animate-spin" />
              Aktualisieren...
            </>
          ) : (
            "E-Mail aktualisieren"
          )}
        </Button>
      </div>
    </form>
  );
}

export function AccountSettingsForm({ email }: AccountSettingsFormProps) {
  // Email change state
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Delete account action
  const [deleteState, deleteAction, deletePending] = useActionState(
    deleteAccount,
    initialState
  );

  const prevDeleteStateRef = useRef(deleteState);

  // Handle delete error (success redirects, so no success handling needed)
  useEffect(() => {
    if (deleteState.error && deleteState.error !== prevDeleteStateRef.current.error) {
      toast.error(deleteState.error);
    }
    prevDeleteStateRef.current = deleteState;
  }, [deleteState]);

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
    setDeleteConfirmation("");
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeleteConfirmation("");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Verwalte deine E-Mail-Adresse und deinen Account.</CardDescription>
        </CardHeader>

        <CardContent>
          {/* Email Section */}
          <div className="space-y-4">
            <div>
              <Label className="mb-1 block">E-Mail-Adresse</Label>
              {!isEditingEmail ? (
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-3 py-2 rounded-md border bg-muted text-muted-foreground text-sm">
                    {email}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingEmail(true)}
                  >
                    Ändern
                  </Button>
                </div>
              ) : (
                <EmailEditForm
                  currentEmail={email}
                  onCancel={() => setIsEditingEmail(false)}
                />
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Das Löschen deines Accounts kann nicht rückgängig gemacht werden. Alle deine Daten werden dauerhaft entfernt.
            </p>
            <Button
              type="button"
              variant="destructive"
              onClick={handleOpenDeleteModal}
            >
              Account löschen
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account löschen</DialogTitle>
            <DialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                Diese Aktion ist dauerhaft und kann nicht rückgängig gemacht werden. Alle deine Daten, einschliesslich Profil, Job-Bewertungen und Präferenzen, werden gelöscht.
              </p>
            </div>

            <form action={deleteAction} className="space-y-4">
              <div className="space-y-2">
                <Label>
                  Tippe <span className="font-mono font-bold">DELETE</span> zur Bestätigung
                </Label>
                <Input
                  type="text"
                  name="confirmation"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  autoComplete="off"
                />
              </div>

              {deleteState.error && (
                <p className="text-sm text-destructive">{deleteState.error}</p>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDeleteModal}
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deletePending || deleteConfirmation !== "DELETE"}
                >
                  {deletePending ? (
                    <>
                      <Loader className="animate-spin" />
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
