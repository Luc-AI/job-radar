import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CvStepForm } from "./CvStepForm";

export default async function OnboardingCvPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData } = await supabase
    .from("users")
    .select("cv_raw")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <CvStepForm initialCvText={userData?.cv_raw ?? ""} />
  );
}
