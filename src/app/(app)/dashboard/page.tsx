import { Card } from "@/components/ui/Card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if onboarding is completed
  const { data: userData } = await supabase
    .from("users")
    .select("onboarding_completed, email")
    .eq("id", user.id)
    .single();

  if (!userData?.onboarding_completed) {
    redirect("/onboarding/step-1");
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Your Jobs</h1>
        <p className="mt-1 text-slate-600">
          AI-matched opportunities based on your profile
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-slate-900">
            No jobs yet
          </h2>
          <p className="mt-2 text-slate-600 max-w-sm mx-auto">
            We&apos;re scanning for opportunities that match your profile. Check
            back soon or wait for your daily digest email.
          </p>
        </div>
      </Card>
    </div>
  );
}
