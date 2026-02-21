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

export type BrancheUnternehmenState = {
  error?: string;
  success?: boolean;
};

export type FinalDetailsState = {
  error?: string;
  success?: boolean;
};

const VALID_WORK_MODES = ["onsite", "hybrid", "remote_ok", "remote_solely"];
const VALID_SENIORITY_LEVELS = ["junior", "mid", "senior", "lead", "clevel"];
const VALID_COMPANY_SIZES = [
  "Kleinunternehmen (< 50 Mitarbeitende)",
  "KMU (50–250 Mitarbeitende)",
  "Mittelstand (250–5.000 Mitarbeitende)",
  "Konzern (5.000+ Mitarbeitende)",
];

export async function saveJobPreferences(
  prevState: OnboardingState,
  formData: FormData
): Promise<OnboardingState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const rolesJson = formData.get("roles") as string;
  const locationsJson = formData.get("locations") as string;
  const workModesJson = formData.get("workModes") as string;
  const seniorityJson = formData.get("seniorityLevels") as string;

  let roles: string[] = [];
  let locations: string[] = [];
  let workModes: string[] = [];
  let seniorityLevels: string[] = [];

  try {
    roles = rolesJson ? JSON.parse(rolesJson) : [];
    locations = locationsJson ? JSON.parse(locationsJson) : [];
    workModes = workModesJson ? JSON.parse(workModesJson) : [];
    seniorityLevels = seniorityJson ? JSON.parse(seniorityJson) : [];
  } catch {
    return { error: "Invalid form data" };
  }

  const fieldErrors: OnboardingState["fieldErrors"] = {};

  if (roles.length === 0) {
    fieldErrors.roles = "Bitte mindestens eine Rolle angeben";
  }

  if (locations.length === 0) {
    fieldErrors.locations = "Bitte mindestens einen Standort angeben";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  const validWorkModes = workModes.filter((m) => VALID_WORK_MODES.includes(m));
  const validSeniority = seniorityLevels.filter((s) => VALID_SENIORITY_LEVELS.includes(s));

  const { error: updateError } = await supabase
    .from("users")
    .update({
      pref_roles: roles,
      pref_locations: locations,
      pref_work_modes: validWorkModes,
      pref_seniority_levels: validSeniority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error saving preferences:", updateError);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/step-2");
}

export async function saveBrancheUnternehmen(
  prevState: BrancheUnternehmenState,
  formData: FormData
): Promise<BrancheUnternehmenState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const industriesJson = formData.get("industries") as string;
  const excludedIndustriesJson = formData.get("excludedIndustries") as string;
  const sizesJson = formData.get("companySizes") as string;
  const excludedJson = formData.get("excludedCompanies") as string;
  const watchlistJson = formData.get("watchlistCompanies") as string;

  let industries: string[] = [];
  let excludedIndustries: string[] = [];
  let companySizes: string[] = [];
  let excludedCompanies: string[] = [];
  let watchlistCompanies: string[] = [];

  try {
    industries = industriesJson ? JSON.parse(industriesJson) : [];
    excludedIndustries = excludedIndustriesJson ? JSON.parse(excludedIndustriesJson) : [];
    companySizes = sizesJson ? JSON.parse(sizesJson) : [];
    excludedCompanies = excludedJson ? JSON.parse(excludedJson) : [];
    watchlistCompanies = watchlistJson ? JSON.parse(watchlistJson) : [];
  } catch {
    return { error: "Invalid form data" };
  }

  const validSizes = companySizes.filter((s) => VALID_COMPANY_SIZES.includes(s));

  const { error: updateError } = await supabase
    .from("users")
    .update({
      pref_industries: industries,
      pref_excluded_industries: excludedIndustries,
      pref_company_sizes: validSizes,
      pref_excluded_companies: excludedCompanies,
      pref_watchlist_companies: watchlistCompanies,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error saving branche & unternehmen:", updateError);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/step-3");
}

export async function saveFinalDetails(
  prevState: FinalDetailsState,
  formData: FormData
): Promise<FinalDetailsState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const languagesJson = formData.get("languages") as string;
  const dealbreakersJson = formData.get("dealbreakers") as string;
  const focusJson = formData.get("focus") as string;
  const notifyTimeStr = formData.get("notifyTime") as string;
  const notifyTime = parseInt(notifyTimeStr, 10);

  let languages: string[] = [];
  let dealbreakers: string[] = [];
  let focus: string[] = [];

  try {
    languages = languagesJson ? JSON.parse(languagesJson) : [];
    dealbreakers = dealbreakersJson ? JSON.parse(dealbreakersJson) : [];
    focus = focusJson ? JSON.parse(focusJson) : [];
  } catch {
    return { error: "Invalid form data" };
  }

  if (isNaN(notifyTime) || notifyTime < 0 || notifyTime > 23) {
    return { error: "Bitte eine gültige Uhrzeit wählen" };
  }

  const { error: updateError } = await supabase
    .from("users")
    .update({
      pref_languages: languages,
      pref_dealbreakers: dealbreakers,
      pref_focus: focus,
      notify_time: notifyTime,
      is_active: true,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (updateError) {
    console.error("Error saving final details:", updateError);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/complete");
}
