import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobPreferencesForm } from "./JobPreferencesForm";
import { CVForm } from "./CVForm";
import { CareerAspirationsForm } from "./CareerAspirationsForm";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current user preferences, CV, and career aspirations
  const { data: userData, error } = await supabase
    .from("users")
    .select("pref_roles, pref_locations, pref_remote, cv_raw, summary, updated_at")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
  }

  // Default to empty arrays if no data
  const prefRoles = userData?.pref_roles || [];
  const prefLocations = userData?.pref_locations || [];
  const prefRemote = userData?.pref_remote || false;
  const cvRaw = userData?.cv_raw || null;
  const summary = userData?.summary || null;
  const updatedAt = userData?.updated_at || null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-slate-600">
          Manage your job preferences and CV
        </p>
      </div>

      <div className="space-y-6">
        {/* Story 3.1: Job Preferences */}
        <JobPreferencesForm
          initialRoles={prefRoles}
          initialLocations={prefLocations}
          initialRemoteOk={prefRemote}
        />

        {/* Story 3.2: CV Section */}
        <CVForm initialCvRaw={cvRaw} lastUpdated={updatedAt} />

        {/* Story 3.3: Career Aspirations */}
        <CareerAspirationsForm initialSummary={summary} />
      </div>
    </div>
  );
}
