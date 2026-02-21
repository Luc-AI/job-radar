"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type BasicsState = {
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

export type AdvancedState = {
  error?: string;
  success?: boolean;
};

export type CVState = {
  error?: string;
  success?: boolean;
};

export type CareerAspirationsState = {
  error?: string;
  success?: boolean;
};

export type CompanySizeRangeState = {
  error?: string;
  success?: boolean;
};

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) return null;
  return { supabase, user };
}

const VALID_WORK_MODES = ["onsite", "hybrid", "remote_ok", "remote_solely"];
const VALID_SENIORITY_LEVELS = ["junior", "mid", "senior", "lead", "clevel"];

export async function updateBasics(
  prevState: BasicsState,
  formData: FormData
): Promise<BasicsState> {
  const auth = await getAuthenticatedUser();
  if (!auth) return { error: "Not authenticated" };

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

  const validWorkModes = workModes.filter((m) => VALID_WORK_MODES.includes(m));
  const validSeniority = seniorityLevels.filter((s) => VALID_SENIORITY_LEVELS.includes(s));

  const { error: updateError } = await auth.supabase
    .from("users")
    .update({
      pref_roles: roles,
      pref_locations: locations,
      pref_work_modes: validWorkModes,
      pref_seniority_levels: validSeniority,
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  if (updateError) {
    console.error("Error saving basics:", updateError);
    return { error: "Failed to save. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

const VALID_COMPANY_SIZES = ["kleinunternehmen", "kmu", "mittelstand", "konzern"];

export async function updateBrancheUnternehmen(
  prevState: BrancheUnternehmenState,
  formData: FormData
): Promise<BrancheUnternehmenState> {
  const auth = await getAuthenticatedUser();
  if (!auth) return { error: "Not authenticated" };

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

  const { error: updateError } = await auth.supabase
    .from("users")
    .update({
      pref_industries: industries,
      pref_excluded_industries: excludedIndustries,
      pref_company_sizes: validSizes,
      pref_excluded_companies: excludedCompanies,
      pref_watchlist_companies: watchlistCompanies,
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  if (updateError) {
    console.error("Error saving branche & unternehmen:", updateError);
    return { error: "Failed to save. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAdvanced(
  prevState: AdvancedState,
  formData: FormData
): Promise<AdvancedState> {
  const auth = await getAuthenticatedUser();
  if (!auth) return { error: "Not authenticated" };

  const languagesJson = formData.get("languages") as string;
  const dealbreakersJson = formData.get("dealbreakers") as string;
  const focusJson = formData.get("focus") as string;

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

  const { error: updateError } = await auth.supabase
    .from("users")
    .update({
      pref_languages: languages,
      pref_dealbreakers: dealbreakers,
      pref_focus: focus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  if (updateError) {
    console.error("Error saving advanced preferences:", updateError);
    return { error: "Failed to save. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCV(
  prevState: CVState,
  formData: FormData
): Promise<CVState> {
  const auth = await getAuthenticatedUser();
  if (!auth) return { error: "Not authenticated" };

  const cvRaw = formData.get("cvRaw") as string;

  if (!cvRaw || cvRaw.trim().length === 0) {
    return { error: "Please provide your CV content" };
  }

  if (cvRaw.trim().length < 50) {
    return { error: "CV content seems too short. Please provide more details about your experience." };
  }

  const { error: updateError } = await auth.supabase
    .from("users")
    .update({
      cv_raw: cvRaw.trim(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  if (updateError) {
    console.error("Error saving CV:", updateError);
    return { error: "Failed to save CV. Please try again." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function updateCareerAspirations(
  prevState: CareerAspirationsState,
  formData: FormData
): Promise<CareerAspirationsState> {
  const auth = await getAuthenticatedUser();
  if (!auth) return { error: "Not authenticated" };

  const summary = formData.get("summary") as string;

  const { error: updateError } = await auth.supabase
    .from("users")
    .update({
      summary: summary?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  if (updateError) {
    console.error("Error saving career aspirations:", updateError);
    return { error: "Failed to save career aspirations. Please try again." };
  }

  revalidatePath("/profile");
  return { success: true };
}

export async function updateCompanySizeRange(
  prevState: CompanySizeRangeState,
  formData: FormData
): Promise<CompanySizeRangeState> {
  const auth = await getAuthenticatedUser();
  if (!auth) return { error: "Not authenticated" };

  const sizeMin = parseInt(formData.get("sizeMin") as string, 10);
  const sizeMax = parseInt(formData.get("sizeMax") as string, 10);

  if (isNaN(sizeMin) || isNaN(sizeMax) || sizeMin < 1 || sizeMax > 10000 || sizeMin > sizeMax) {
    return { error: "Invalid range" };
  }

  const { error: updateError } = await auth.supabase
    .from("users")
    .update({
      pref_company_size_min: sizeMin,
      pref_company_size_max: sizeMax,
      updated_at: new Date().toISOString(),
    })
    .eq("id", auth.user.id);

  if (updateError) {
    console.error("Error saving company size range:", updateError);
    return { error: "Failed to save. Please try again." };
  }

  revalidatePath("/profile");
  revalidatePath("/profile/cv");
  return { success: true };
}
