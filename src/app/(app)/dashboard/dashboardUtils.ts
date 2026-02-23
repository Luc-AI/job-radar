import { JobWithEvaluation, TimeBucket, JobTier } from "@/types/database";

/** Convert a percentage threshold (70–100) to DB score scale (0–10). */
export function pctToScore(pct: number): number {
  return pct / 10;
}

/** Assign a job to a time bucket based on its created_at timestamp. */
export function getTimeBucket(createdAt: string | null): TimeBucket {
  if (!createdAt) return "older";

  const now = Date.now();
  const created = new Date(createdAt).getTime();
  const diffMs = now - created;
  const h24 = 24 * 60 * 60 * 1000;
  const d7 = 7 * h24;
  const d30 = 30 * h24;

  if (diffMs < h24) return "last24h";
  if (diffMs < d7) return "last7d";
  if (diffMs < d30) return "last30d";
  return "older";
}

export interface TieredJobs {
  top: JobWithEvaluation[];
  also: JobWithEvaluation[];
  below: JobWithEvaluation[];
}

/**
 * Split jobs into three tiers given a 0–10 threshold score T:
 *   top:   score ≥ T
 *   also:  score ≥ (T − 1.5) AND score < T
 *   below: score < (T − 1.5)
 */
export function splitByTier(jobs: JobWithEvaluation[], thresholdScore: number): TieredJobs {
  const alsoMin = thresholdScore - 1.5;
  const top: JobWithEvaluation[] = [];
  const also: JobWithEvaluation[] = [];
  const below: JobWithEvaluation[] = [];

  for (const job of jobs) {
    const s = job.score_total;
    if (s >= thresholdScore) {
      top.push(job);
    } else if (s >= alsoMin) {
      also.push(job);
    } else {
      below.push(job);
    }
  }

  return { top, also, below };
}

export interface BucketedTieredJobs {
  last24h: TieredJobs;
  last7d: TieredJobs;
  last30d: TieredJobs;
  older: TieredJobs;
}

/**
 * Given all jobs and a threshold (0–10 scale), assign each job to a time
 * bucket and split within each bucket by tier.
 */
export function bucketAndTier(
  jobs: JobWithEvaluation[],
  thresholdScore: number
): BucketedTieredJobs {
  const buckets: Record<TimeBucket, JobWithEvaluation[]> = {
    last24h: [],
    last7d: [],
    last30d: [],
    older: [],
  };

  for (const job of jobs) {
    const bucket = getTimeBucket(job.job?.created_at ?? null);
    buckets[bucket].push(job);
  }

  return {
    last24h: splitByTier(buckets.last24h, thresholdScore),
    last7d: splitByTier(buckets.last7d, thresholdScore),
    last30d: splitByTier(buckets.last30d, thresholdScore),
    older: splitByTier(buckets.older, thresholdScore),
  };
}

/** Return the tier a job belongs to given a threshold (0–10 scale). */
export function getJobTier(score: number, thresholdScore: number): JobTier {
  if (score >= thresholdScore) return "top";
  if (score >= thresholdScore - 1.5) return "also";
  return "below";
}

/** Profile completeness: fraction of key fields present (0–100). */
export function profileCompleteness(user: {
  cv_raw?: string | null;
  pref_roles?: string[] | null;
  pref_locations?: string[] | null;
  notify_enabled?: boolean | null;
  notify_frequency?: string | null;
}): number {
  const checks = [
    Boolean(user.cv_raw),
    Array.isArray(user.pref_roles) && user.pref_roles.length > 0,
    Array.isArray(user.pref_locations) && user.pref_locations.length > 0,
    user.notify_enabled != null,
    Boolean(user.notify_frequency),
  ];
  const filled = checks.filter(Boolean).length;
  return Math.round((filled / checks.length) * 100);
}

/** Derive a first name from an email address (e.g. "john.doe@..." → "John"). */
export function nameFromEmail(email: string): string {
  const local = email.split("@")[0];
  const first = local.split(/[._-]/)[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}
