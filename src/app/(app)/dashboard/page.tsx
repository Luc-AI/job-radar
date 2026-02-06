import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobWithEvaluation } from "@/types/database";
import { JobList } from "./JobList";

const PAGE_SIZE = 20;

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
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (!userData?.onboarding_completed) {
    redirect("/onboarding/step-1");
  }

  // Fetch total count and new count
  const [{ count: totalCount }, { count: newCount }] = await Promise.all([
    supabase
      .from("evaluations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "hidden"),
    supabase
      .from("evaluations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "new"),
  ]);

  // Fetch first page of evaluations with job data
  const { data: evaluations, error } = await supabase
    .from("evaluations")
    .select(
      `
      *,
      job:jobs(*)
    `
    )
    .eq("user_id", user.id)
    .neq("status", "hidden")
    .order("score_total", { ascending: false })
    .range(0, PAGE_SIZE - 1);

  if (error) {
    console.error("Error fetching evaluations:", error);
  }

  const jobs = (evaluations as JobWithEvaluation[]) || [];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Your Jobs</h1>
        <p className="mt-1 text-slate-600">
          AI-matched opportunities based on your profile
        </p>
      </div>

      {/* Stats */}
      <div className="mb-6 flex items-center gap-4 text-sm">
        <span className="text-slate-600">
          <span className="font-semibold text-slate-900">{totalCount || 0}</span>{" "}
          jobs matched
        </span>
        {(newCount || 0) > 0 && (
          <span className="text-emerald-600 font-medium">
            {newCount} new today
          </span>
        )}
      </div>

      <JobList
        initialJobs={jobs}
        totalCount={totalCount || 0}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
