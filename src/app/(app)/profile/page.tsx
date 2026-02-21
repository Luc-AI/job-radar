import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileNav } from "./ProfileNav";
import { BasicsForm } from "./BasicsForm";
import { FirmaForm } from "./FirmaForm";
import { AdvancedForm } from "./AdvancedForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select(
      "pref_roles, pref_locations, pref_work_modes, pref_seniority_levels, pref_industries, pref_excluded_industries, pref_dealbreakers, pref_focus, pref_company_sizes, pref_excluded_companies, pref_watchlist_companies, pref_languages"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
  }

  // Dealbreakers and focus were TEXT, now TEXT[] — handle both formats
  const toPrefArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.trim()) return [val];
    return [];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold">Profil</h1>
        <p className="mt-1 text-muted-foreground">
          Dein Suchprofil für den perfekten Job.
        </p>
      </div>

      <ProfileNav />

      <div className="space-y-6">
        <BasicsForm
          initialRoles={userData?.pref_roles || []}
          initialLocations={userData?.pref_locations || []}
          initialWorkModes={userData?.pref_work_modes || []}
          initialSeniorityLevels={userData?.pref_seniority_levels || []}
        />

        <FirmaForm
          initialIndustries={userData?.pref_industries || []}
          initialExcludedIndustries={userData?.pref_excluded_industries || []}
          initialCompanySizes={userData?.pref_company_sizes || []}
          initialExcludedCompanies={userData?.pref_excluded_companies || []}
          initialWatchlistCompanies={userData?.pref_watchlist_companies || []}
        />

        <AdvancedForm
          initialLanguages={userData?.pref_languages || []}
          initialDealbreakers={toPrefArray(userData?.pref_dealbreakers)}
          initialFocus={toPrefArray(userData?.pref_focus)}
        />
      </div>
    </div>
  );
}
