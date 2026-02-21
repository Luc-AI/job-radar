import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProfileNav } from "../ProfileNav";
import { CVForm } from "../CVForm";
import { CareerAspirationsForm } from "../CareerAspirationsForm";
import { CompanySizeRangeForm } from "../CompanySizeRangeForm";

export default async function CVPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("cv_raw, summary, updated_at, pref_company_size_min, pref_company_size_max")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold">Profil</h1>
        <p className="mt-1 text-muted-foreground">
          CV und Karriereziele für besseres Matching.
        </p>
      </div>

      <ProfileNav />

      <div className="space-y-6">
        <CVForm
          initialCvRaw={userData?.cv_raw || null}
          lastUpdated={userData?.updated_at || null}
        />

        <CareerAspirationsForm
          initialSummary={userData?.summary || null}
        />

        <CompanySizeRangeForm
          initialMin={userData?.pref_company_size_min ?? 1}
          initialMax={userData?.pref_company_size_max ?? 10000}
        />
      </div>
    </div>
  );
}
