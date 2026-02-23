import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Job, JobWithEvaluation, EvaluationStatus } from "@/types/database";
import { WelcomeBanner, BannerStats } from "./WelcomeBanner";
import { TimeGroupedJobList } from "./TimeGroupedJobList";
import {
  pctToScore,
  getTimeBucket,
  profileCompleteness,
  nameFromEmail,
} from "./dashboardUtils";

const VALID_STATUSES: EvaluationStatus[] = ["new", "viewed", "saved", "applied", "hidden"];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const initialStatuses = VALID_STATUSES.filter((s) => s === statusParam);
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user settings: onboarding status, threshold, profile completeness fields
  const { data: userData } = await supabase
    .from("users")
    .select(
      "onboarding_completed, top_pick_threshold, first_name, cv_raw, pref_roles, pref_locations, notify_enabled, notify_frequency"
    )
    .eq("id", user.id)
    .single();

  if (!userData?.onboarding_completed) {
    redirect("/onboarding/step-1");
  }

  const thresholdPct: number = userData?.top_pick_threshold ?? 85;
  const thresholdScore = pctToScore(thresholdPct);

  // Fetch ALL non-hidden evaluations (no pagination — time-grouping replaces load-more)
  const { data: evaluations, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("user_id", user.id)
    .neq("status", "hidden")
    .order("score_total", { ascending: false });

  if (error) {
    console.error("Error fetching evaluations:", error.message, error.code, error.details);
  }

  // Fetch jobs by fingerprints
  const fingerprints = (evaluations || []).map((e) => e.fingerprint_job);
  const { data: jobsData } =
    fingerprints.length > 0
      ? await supabase.from("jobs").select("*").in("fingerprint_job", fingerprints)
      : { data: [] };

  // Combine evaluations with jobs
  const jobsMap = new Map((jobsData || []).map((j) => [j.fingerprint_job, j]));
  const allJobs: JobWithEvaluation[] = (evaluations || []).map((e) => ({
    ...e,
    job: (jobsMap.get(e.fingerprint_job) as Job) || null,
  })) as JobWithEvaluation[];

  // --- Banner stats (server-side) ---
  const now = Date.now();
  const d7ms = 7 * 24 * 60 * 60 * 1000;

  const todayJobs = allJobs.filter(
    (j) => getTimeBucket(j.job?.created_at ?? null) === "last24h"
  );
  const newToday = todayJobs.length;
  const topPicksToday = todayJobs.filter((j) => j.score_total >= thresholdScore).length;

  // Top 1–2 industries from today's jobs
  const industryCounts: Record<string, number> = {};
  for (const j of todayJobs) {
    const ind = j.job?.company_industry;
    if (ind) industryCounts[ind] = (industryCounts[ind] ?? 0) + 1;
  }
  const topIndustriesToday = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([ind]) => ind);

  // Zero-state fallback (last 7 days) when no top picks today
  const last7dJobs =
    topPicksToday === 0
      ? allJobs.filter(
          (j) =>
            j.job?.created_at != null &&
            now - new Date(j.job.created_at).getTime() < d7ms
        )
      : [];
  const newLast7d = last7dJobs.length;
  const topPicksLast7d = last7dJobs.filter((j) => j.score_total >= thresholdScore).length;

  // Weekly activity: count applied/saved updated since Monday
  const nowDate = new Date();
  const dayOfWeek = nowDate.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(nowDate);
  weekStart.setDate(nowDate.getDate() - daysToMonday);
  weekStart.setHours(0, 0, 0, 0);
  const weekStartMs = weekStart.getTime();

  const appliedThisWeek = allJobs.filter(
    (j) =>
      j.status === "applied" &&
      j.updated_at != null &&
      new Date(j.updated_at).getTime() >= weekStartMs
  ).length;
  const savedThisWeek = allJobs.filter(
    (j) =>
      j.status === "saved" &&
      j.updated_at != null &&
      new Date(j.updated_at).getTime() >= weekStartMs
  ).length;

  const completeness = profileCompleteness({
    cv_raw: userData?.cv_raw,
    pref_roles: userData?.pref_roles,
    pref_locations: userData?.pref_locations,
    notify_enabled: userData?.notify_enabled,
    notify_frequency: userData?.notify_frequency,
  });

  const bannerStats: BannerStats = {
    displayName: userData?.first_name ?? nameFromEmail(user.email ?? ""),
    newToday,
    topPicksToday,
    topIndustriesToday,
    newLast7d,
    topPicksLast7d,
    appliedThisWeek,
    savedThisWeek,
    profileCompleteness: completeness,
    thresholdPct,
  };

  return (
    <div className="max-w-3xl mx-auto">
      <WelcomeBanner stats={bannerStats} />
      <TimeGroupedJobList allJobs={allJobs} thresholdScore={thresholdScore} initialStatuses={initialStatuses} />
    </div>
  );
}
