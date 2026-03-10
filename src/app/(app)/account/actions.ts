"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AccountState = {
  error?: string;
  success?: boolean;
  message?: string;
};

// ── Personal Info ─────────────────────────────────────────────────────────────

export async function updatePersonalInfo(
  prevState: AccountState,
  formData: FormData
): Promise<AccountState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const firstName = (formData.get("first_name") as string).trim();
  const lastName = (formData.get("last_name") as string).trim();

  const { error } = await supabase
    .from("users")
    .update({
      first_name: firstName || null,
      last_name: lastName || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") console.error("updatePersonalInfo:", error);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/account");
  return { success: true };
}

// ── Email ─────────────────────────────────────────────────────────────────────

export async function updateEmail(
  prevState: AccountState,
  formData: FormData
): Promise<AccountState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const newEmail = formData.get("email") as string;

  if (!newEmail || !newEmail.includes("@")) {
    return { error: "Bitte gib eine gültige E-Mail-Adresse ein" };
  }
  if (newEmail === user.email) {
    return { error: "Die neue E-Mail muss sich von der aktuellen unterscheiden" };
  }

  const { error } = await supabase.auth.updateUser({ email: newEmail });

  if (error) {
    if (process.env.NODE_ENV === "development") console.error("updateEmail:", error);
    return { error: error.message || "E-Mail-Aktualisierung fehlgeschlagen" };
  }

  return {
    success: true,
    message: "Bestätigungs-E-Mail gesendet. Bitte prüfe deinen Posteingang.",
  };
}

// ── Delete Account ────────────────────────────────────────────────────────────

export async function deleteAccount(
  prevState: AccountState,
  formData: FormData
): Promise<AccountState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const confirmation = formData.get("confirmation") as string;
  if (confirmation !== "DELETE") {
    return { error: "Bitte tippe DELETE zur Bestätigung" };
  }

  // Delete evaluations first (GDPR compliance — no ON DELETE CASCADE in migrations)
  const { error: evaluationsError } = await supabase
    .from("evaluations")
    .delete()
    .eq("user_id", user.id);

  if (evaluationsError) {
    if (process.env.NODE_ENV === "development") console.error("deleteAccount evaluations:", evaluationsError);
    return { error: "Löschen fehlgeschlagen. Bitte erneut versuchen." };
  }

  const { error: deleteError } = await supabase
    .from("users")
    .delete()
    .eq("id", user.id);

  if (deleteError) {
    if (process.env.NODE_ENV === "development") console.error("deleteAccount:", deleteError);
    return { error: "Löschen fehlgeschlagen. Bitte erneut versuchen." };
  }

  // Note: the Supabase Auth identity is NOT deleted here (requires service-role client).
  // TODO: call supabase.auth.admin.deleteUser(user.id) via a server-side admin client
  // to fully erase the auth record for GDPR compliance.
  try {
    await supabase.auth.signOut();
  } catch {
    // signOut failure should not block the redirect — session expires naturally
  }
  redirect("/");
}
