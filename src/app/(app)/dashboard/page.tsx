import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { JobWithEvaluation } from "@/types/database";
import { JobList } from "./JobList";
import { KpiStats } from "./KpiStats";

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

  // Fetch KPI counts
  const [
    { count: totalCount },
    { count: newCount },
    { count: topMatchCount },
    { count: savedCount },
  ] = await Promise.all([
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
    supabase
      .from("evaluations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "hidden")
      .gte("score_total", 9),
    supabase
      .from("evaluations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "saved"),
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
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900">Your Jobs</h1>
        <p className="mt-1 text-slate-600">
          AI-matched opportunities based on your profile
        </p>
      </div>

      {/* KPI Stats */}
      <KpiStats
        totalJobs={totalCount || 0}
        newToday={newCount || 0}
        topMatches={topMatchCount || 0}
        savedJobs={savedCount || 0}
      />

      <JobList
        initialJobs={jobs}
        totalCount={totalCount || 0}
        pageSize={PAGE_SIZE}
      />
    </div>
  );
}
