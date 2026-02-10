"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
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
  const { showToast } = useToast();
  const [newEmail, setNewEmail] = useState("");
  const [emailState, emailAction, emailPending] = useActionState(
    updateEmail,
    initialState
  );

  const prevStateRef = useRef(emailState);

  useEffect(() => {
    if (emailState.success && !prevStateRef.current.success) {
      showToast(emailState.message || "Email updated", "success");
      onCancel();
    }
    if (emailState.error && emailState.error !== prevStateRef.current.error) {
      showToast(emailState.error, "error");
    }
    prevStateRef.current = emailState;
  }, [emailState, showToast, onCancel]);

  return (
    <form action={emailAction} className="space-y-3">
      <p className="text-sm text-slate-500 mb-2">
        Current email: {currentEmail}
      </p>
      <Input
        type="email"
        name="email"
        value={newEmail}
        onChange={(e) => setNewEmail(e.target.value)}
        placeholder="Enter new email address"
        error={emailState.error}
      />
      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          isLoading={emailPending}
          disabled={!newEmail}
        >
          Update Email
        </Button>
      </div>
    </form>
  );
}

export function AccountSettingsForm({ email }: AccountSettingsFormProps) {
  const { showToast } = useToast();

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
      showToast(deleteState.error, "error");
    }
    prevDeleteStateRef.current = deleteState;
  }, [deleteState, showToast]);

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
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Account Settings</h2>
          <p className="mt-1 text-sm text-slate-600">
            Manage your email and account.
          </p>
        </div>

        {/* Email Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email address
            </label>
            {!isEditingEmail ? (
              <div className="flex items-center gap-3">
                <div className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-600">
                  {email}
                </div>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditingEmail(true)}
                >
                  Change
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
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-sm font-medium text-red-600 mb-2">Danger Zone</h3>
          <p className="text-sm text-slate-600 mb-4">
            Once you delete your account, there is no going back. All your data will be permanently removed.
          </p>
          <Button
            type="button"
            variant="danger"
            onClick={handleOpenDeleteModal}
          >
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        title="Delete Account"
      >
        <div className="space-y-4">
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">
              This action is permanent and cannot be undone. All your data, including your profile, job evaluations, and preferences will be deleted.
            </p>
          </div>

          <form action={deleteAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </label>
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
              <p className="text-sm text-red-600">{deleteState.error}</p>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseDeleteModal}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                isLoading={deletePending}
                disabled={deleteConfirmation !== "DELETE"}
              >
                Delete My Account
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
