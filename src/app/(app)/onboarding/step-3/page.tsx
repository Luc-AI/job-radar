import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Step3Form } from "./Step3Form";

export default async function OnboardingStep3Page() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("pref_languages, pref_dealbreakers, pref_focus, notify_time")
    .eq("id", user.id)
    .maybeSingle();

  // Dealbreakers and focus were TEXT, now TEXT[] — handle both formats
  const toPrefArray = (val: unknown): string[] => {
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.trim()) return [val];
    return [];
  };

  return (
    <Step3Form
      initialLanguages={userData?.pref_languages || []}
      initialDealbreakers={toPrefArray(userData?.pref_dealbreakers)}
      initialFocus={toPrefArray(userData?.pref_focus)}
      initialNotifyTime={userData?.notify_time ?? 9}
    />
  );
}
