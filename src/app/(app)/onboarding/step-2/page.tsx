import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Step2Form } from "./Step2Form";

export default async function OnboardingStep2Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("pref_industries, pref_excluded_industries, pref_company_sizes, pref_excluded_companies, pref_watchlist_companies")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <Step2Form
      initialIndustries={userData?.pref_industries || []}
      initialExcludedIndustries={userData?.pref_excluded_industries || []}
      initialCompanySizes={userData?.pref_company_sizes || []}
      initialExcludedCompanies={userData?.pref_excluded_companies || []}
      initialWatchlistCompanies={userData?.pref_watchlist_companies || []}
    />
  );
}
