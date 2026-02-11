"use server";

import { createClient } from "@/lib/supabase/server";
import {
  JobWithEvaluation,
  JobFilters,
  ScoreRange,
  DatePosted,
  SortOption,
} from "@/types/database";

// Helper to get score range boundaries
function getScoreRangeBounds(range: ScoreRange): { min: number; max: number } {
  switch (range) {
    case "90+":
      return { min: 9, max: 10 };
    case "80-89":
      return { min: 8, max: 8.99 };
    case "70-79":
      return { min: 7, max: 7.99 };
    case "below70":
      return { min: 0, max: 6.99 };
  }
}

// Helper to get date filter
function getDateFilter(datePosted: DatePosted): Date {
  const now = new Date();
  switch (datePosted) {
    case "today":
      return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    case "7days":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30days":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }
}

export async function loadMoreJobs(
  offset: number,
  limit: number,
  filters?: JobFilters,
  sort: SortOption = "score_desc"
): Promise<JobWithEvaluation[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  let query = supabase
    .from("evaluations")
    .select("*")
    .eq("user_id", user.id);

  // Apply status filter
  if (filters?.statuses && filters.statuses.length > 0) {
    query = query.in("status", filters.statuses);
  } else {
    // Default: exclude hidden
    query = query.neq("status", "hidden");
  }

  // Apply score range filter
  if (filters?.scoreRanges && filters.scoreRanges.length > 0) {
    // Build OR conditions for multiple score ranges
    const scoreConditions = filters.scoreRanges.map((range) => {
      const { min, max } = getScoreRangeBounds(range);
      return `and(score_total.gte.${min},score_total.lte.${max})`;
    });
    query = query.or(scoreConditions.join(","));
  }

  // Apply sorting (only score sorting works directly on evaluations)
  if (sort === "score_desc") {
    query = query.order("score_total", { ascending: false });
  }

  const { data: evaluations, error } = await query.range(
    offset,
    offset + limit - 1
  );

  if (error) {
    console.error("Error loading more jobs:", error);
    return [];
  }

  // Fetch jobs by fingerprints
  const fingerprints = (evaluations || []).map((e) => e.fingerprint_job);
  const { data: jobsData } = fingerprints.length > 0
    ? await supabase.from("jobs").select("*").in("fingerprint_job", fingerprints)
    : { data: [] };

  // Combine evaluations with jobs
  const jobsMap = new Map((jobsData || []).map((j) => [j.fingerprint_job, j]));
  let results: JobWithEvaluation[] = (evaluations || []).map((e) => ({
    ...e,
    job: jobsMap.get(e.fingerprint_job) || null,
  })) as JobWithEvaluation[];

  // Apply date filter (client-side since it's on joined table)
  if (filters?.datePosted) {
    const dateThreshold = getDateFilter(filters.datePosted);
    results = results.filter((evaluation) => {
      if (!evaluation.job?.posted_at) return true;
      return new Date(evaluation.job.posted_at) >= dateThreshold;
    });
  }

  // Apply date sorting (client-side)
  if (sort === "date_desc" || sort === "date_asc") {
    results.sort((a, b) => {
      const dateA = a.job?.posted_at ? new Date(a.job.posted_at).getTime() : 0;
      const dateB = b.job?.posted_at ? new Date(b.job.posted_at).getTime() : 0;
      return sort === "date_asc" ? dateA - dateB : dateB - dateA;
    });
  }

  return results;
}

export async function getFilteredJobCount(
  filters?: JobFilters
): Promise<{ filteredCount: number; totalCount: number }> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { filteredCount: 0, totalCount: 0 };
  }

  // Get total count (excluding hidden)
  const { count: totalCount } = await supabase
    .from("evaluations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .neq("status", "hidden");

  // If no filters active, filtered = total
  const hasActiveFilters =
    (filters?.scoreRanges && filters.scoreRanges.length > 0) ||
    filters?.datePosted ||
    (filters?.statuses && filters.statuses.length > 0);

  if (!hasActiveFilters) {
    return { filteredCount: totalCount || 0, totalCount: totalCount || 0 };
  }

  // Build filtered query
  let query = supabase
    .from("evaluations")
    .select("uuid_evaluation, score_total, status, fingerprint_job")
    .eq("user_id", user.id);

  // Apply status filter
  if (filters?.statuses && filters.statuses.length > 0) {
    query = query.in("status", filters.statuses);
  } else {
    query = query.neq("status", "hidden");
  }

  // Apply score range filter
  if (filters?.scoreRanges && filters.scoreRanges.length > 0) {
    const scoreConditions = filters.scoreRanges.map((range) => {
      const { min, max } = getScoreRangeBounds(range);
      return `and(score_total.gte.${min},score_total.lte.${max})`;
    });
    query = query.or(scoreConditions.join(","));
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error getting filtered count:", error);
    return { filteredCount: 0, totalCount: totalCount || 0 };
  }

  let filteredResults = data || [];

  // Apply date filter (need to fetch jobs if date filter is active)
  if (filters?.datePosted && filteredResults.length > 0) {
    const fingerprints = filteredResults.map((e) => e.fingerprint_job);
    const { data: jobsData } = await supabase
      .from("jobs")
      .select("fingerprint_job, posted_at")
      .in("fingerprint_job", fingerprints);

    const jobsMap = new Map((jobsData || []).map((j) => [j.fingerprint_job, j.posted_at]));
    const dateThreshold = getDateFilter(filters.datePosted);

    filteredResults = filteredResults.filter((evaluation) => {
      const postedAt = jobsMap.get(evaluation.fingerprint_job);
      if (!postedAt) return true;
      return new Date(postedAt) >= dateThreshold;
    });
  }

  return {
    filteredCount: filteredResults.length,
    totalCount: totalCount || 0,
  };
}
