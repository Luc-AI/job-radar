import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Step1Form } from "./Step1Form";

export default async function OnboardingStep1Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("pref_roles, pref_locations, pref_work_modes, pref_seniority_levels")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <Step1Form
      initialRoles={userData?.pref_roles || []}
      initialLocations={userData?.pref_locations || []}
      initialWorkModes={userData?.pref_work_modes || []}
      initialSeniorityLevels={userData?.pref_seniority_levels || []}
    />
  );
}
