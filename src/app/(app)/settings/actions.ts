"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type NotificationSettingsState = {
  error?: string;
  success?: boolean;
};

export type AccountSettingsState = {
  error?: string;
  success?: boolean;
  message?: string;
};

export async function updateNotificationSettings(
  prevState: NotificationSettingsState,
  formData: FormData
): Promise<NotificationSettingsState> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  // Parse form data
  const notifyEnabled = formData.get("notifyEnabled") === "true";
  const notifyFrequency = formData.get("notifyFrequency") as string;
  const notifyThresholdStr = formData.get("notifyThreshold") as string;

  const notifyThreshold = parseFloat(notifyThresholdStr);

  // Validate notify_frequency
  if (!["daily", "weekly"].includes(notifyFrequency)) {
    return { error: "Invalid digest frequency selected" };
  }

  // Validate notify_threshold (1-10)
  if (isNaN(notifyThreshold) || notifyThreshold < 1 || notifyThreshold > 10) {
    return { error: "Invalid score threshold selected" };
  }

  // Save to database
  const { error: updateError } = await supabase
    .from("users")
    .update({
      notify_enabled: notifyEnabled,
      notify_frequency: notifyFrequency,
      notify_threshold: notifyThreshold,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error saving notification settings:", updateError);
    return { error: "Failed to save settings. Please try again." };
  }

  revalidatePath("/settings");

  return { success: true };
}

export async function updateEmail(
  prevState: AccountSettingsState,
  formData: FormData
): Promise<AccountSettingsState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  const newEmail = formData.get("email") as string;

  if (!newEmail || !newEmail.includes("@")) {
    return { error: "Please enter a valid email address" };
  }

  if (newEmail === user.email) {
    return { error: "New email must be different from your current email" };
  }

  // Update email in Supabase Auth (sends verification email)
  const { error: updateError } = await supabase.auth.updateUser({
    email: newEmail,
  });

  if (updateError) {
    console.error("Error updating email:", updateError);
    return { error: updateError.message || "Failed to update email" };
  }

  return {
    success: true,
    message: "Verification email sent. Please check your inbox to confirm the change.",
  };
}

export async function deleteAccount(
  prevState: AccountSettingsState,
  formData: FormData
): Promise<AccountSettingsState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  const confirmation = formData.get("confirmation") as string;

  if (confirmation !== "DELETE") {
    return { error: "Please type DELETE to confirm account deletion" };
  }

  // Delete user data from users table first
  const { error: deleteDataError } = await supabase
    .from("users")
    .delete()
    .eq("id", user.id);

  if (deleteDataError) {
    console.error("Error deleting user data:", deleteDataError);
    return { error: "Failed to delete account. Please try again." };
  }

  // Sign out the user
  await supabase.auth.signOut();

  // Redirect to landing page
  redirect("/");
}
