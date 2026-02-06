"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingState = {
  error?: string;
  fieldErrors?: {
    roles?: string;
    locations?: string;
  };
  success?: boolean;
};

export type CVUploadState = {
  error?: string;
  success?: boolean;
};

export async function saveJobPreferences(
  prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Parse form data
  const rolesJson = formData.get("roles") as string;
  const locationsJson = formData.get("locations") as string;
  const remoteOk = formData.get("remoteOk") === "true";

  let roles: string[] = [];
  let locations: string[] = [];

  try {
    roles = rolesJson ? JSON.parse(rolesJson) : [];
    locations = locationsJson ? JSON.parse(locationsJson) : [];
  } catch {
    return { error: "Invalid form data" };
  }

  // Validate
  const fieldErrors: OnboardingState["fieldErrors"] = {};

  if (roles.length === 0) {
    fieldErrors.roles = "Please add at least one job title or keyword";
  }

  if (locations.length === 0) {
    fieldErrors.locations = "Please add at least one location";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // Save to database
  const { error: updateError } = await supabase
    .from("users")
    .update({
      pref_roles: roles,
      pref_locations: locations,
      pref_remote: remoteOk,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error saving preferences:", updateError);
    return { error: "Failed to save preferences. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/step-2");
}

export async function saveCV(
  prevState: CVUploadState,
  formData: FormData
): Promise<CVUploadState> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const cvRaw = formData.get("cvRaw") as string;

  if (!cvRaw || cvRaw.trim().length === 0) {
    return { error: "Please provide your CV content" };
  }

  if (cvRaw.trim().length < 50) {
    return { error: "CV content seems too short. Please provide more details about your experience." };
  }

  // Save to database
  const { error: updateError } = await supabase
    .from("users")
    .update({
      cv_raw: cvRaw.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error saving CV:", updateError);
    return { error: "Failed to save CV. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/step-3");
}

export type FinalDetailsState = {
  error?: string;
  success?: boolean;
};

export async function saveFinalDetails(
  prevState: FinalDetailsState,
  formData: FormData
): Promise<FinalDetailsState> {
  const supabase = await createClient();

  // Get authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const summary = formData.get("summary") as string;
  const notifyTimeStr = formData.get("notifyTime") as string;
  const notifyTime = parseInt(notifyTimeStr, 10);

  // Validate notify time
  if (isNaN(notifyTime) || notifyTime < 0 || notifyTime > 23) {
    return { error: "Please select a valid notification time" };
  }

  // Save to database
  const { error: updateError } = await supabase
    .from("users")
    .update({
      summary: summary?.trim() || null,
      notify_time: notifyTime,
      is_active: true,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error saving final details:", updateError);
    return { error: "Failed to save your details. Please try again." };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/complete");
}
