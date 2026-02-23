"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase } from "react-feather";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  JobWithEvaluation,
  JobFilters as JobFiltersType,
  SortOption,
  EvaluationStatus,
  ScoreRange,
  DatePosted,
} from "@/types/database";
import { getTimeBucket, bucketAndTier, BucketedTieredJobs } from "./dashboardUtils";
import { useDashboardNav } from "@/contexts/DashboardNavContext";
import { TimeGroup } from "./TimeGroup";
import { JobFilters } from "./JobFilters";
import { JobSort } from "./JobSort";

interface TimeGroupedJobListProps {
  allJobs: JobWithEvaluation[];
  thresholdScore: number;
  initialStatuses?: EvaluationStatus[];
}

const EMPTY_FILTERS: JobFiltersType = {
  scoreRanges: [],
  datePosted: null,
  statuses: [],
};

const SCORE_RANGE_BOUNDS: Record<ScoreRange, [number, number]> = {
  "90+": [9, 10],
  "80-89": [8, 8.9],
  "70-79": [7, 7.9],
  below70: [0, 6.9],
};

const DATE_FILTER_BUCKETS: Record<NonNullable<DatePosted>, Set<string>> = {
  today: new Set(["last24h"]),
  "7days": new Set(["last24h", "last7d"]),
  "30days": new Set(["last24h", "last7d", "last30d"]),
};

function matchesFilters(job: JobWithEvaluation, filters: JobFiltersType): boolean {
  // Score range filter
  if (filters.scoreRanges.length > 0) {
    const score = job.score_total;
    const inRange = filters.scoreRanges.some((range) => {
      const [min, max] = SCORE_RANGE_BOUNDS[range];
      return score >= min && score <= max;
    });
    if (!inRange) return false;
  }

  // Date posted filter — uses same time bucket logic
  if (filters.datePosted) {
    const bucket = getTimeBucket(job.job?.created_at ?? null);
    const allowed = DATE_FILTER_BUCKETS[filters.datePosted];
    if (!allowed.has(bucket)) return false;
  }

  // Status filter
  if (filters.statuses.length > 0) {
    const status = (job.status ?? "new") as EvaluationStatus;
    if (!filters.statuses.includes(status)) return false;
  }

  return true;
}

function sortJobs(jobs: JobWithEvaluation[], sort: SortOption): JobWithEvaluation[] {
  const copy = [...jobs];
  switch (sort) {
    case "score_desc":
      return copy.sort((a, b) => b.score_total - a.score_total);
    case "date_desc":
      return copy.sort((a, b) => {
        const aMs = a.job?.created_at ? new Date(a.job.created_at).getTime() : 0;
        const bMs = b.job?.created_at ? new Date(b.job.created_at).getTime() : 0;
        return bMs - aMs;
      });
    case "date_asc":
      return copy.sort((a, b) => {
        const aMs = a.job?.created_at ? new Date(a.job.created_at).getTime() : 0;
        const bMs = b.job?.created_at ? new Date(b.job.created_at).getTime() : 0;
        return aMs - bMs;
      });
  }
}

function hasSomeJob(tiered: BucketedTieredJobs[keyof BucketedTieredJobs]): boolean {
  return tiered.top.length + tiered.also.length + tiered.below.length > 0;
}

const BUCKET_LABELS: Record<keyof BucketedTieredJobs, string> = {
  last24h: "Last 24 Hours",
  last7d: "Last 7 Days",
  last30d: "Last 30 Days",
  older: "Older than 30 Days",
};

const BUCKET_IDS: Record<keyof BucketedTieredJobs, string> = {
  last24h: "last-24h",
  last7d: "last-7d",
  last30d: "last-30d",
  older: "older",
};

export function TimeGroupedJobList({ allJobs, thresholdScore, initialStatuses }: TimeGroupedJobListProps) {
  const [filters, setFilters] = useState<JobFiltersType>(() =>
    initialStatuses && initialStatuses.length > 0
      ? { ...EMPTY_FILTERS, statuses: initialStatuses }
      : EMPTY_FILTERS
  );
  const [sort, setSort] = useState<SortOption>("score_desc");
  const { setSections } = useDashboardNav();

  const hasActiveFilters =
    filters.scoreRanges.length > 0 ||
    filters.datePosted !== null ||
    filters.statuses.length > 0;

  // Compute section availability from unfiltered jobs and publish to sidebar
  const sectionAvailability = useMemo(() => {
    const allBuckets = bucketAndTier(allJobs, thresholdScore);
    return {
      "last-24h": hasSomeJob(allBuckets.last24h),
      "last-7d": hasSomeJob(allBuckets.last7d),
      "last-30d": hasSomeJob(allBuckets.last30d),
      older: hasSomeJob(allBuckets.older),
    };
  }, [allJobs, thresholdScore]);

  useEffect(() => {
    setSections(sectionAvailability);
  }, [sectionAvailability, setSections]);

  // Apply filters, then sort, then bucket+tier
  const buckets: BucketedTieredJobs = useMemo(() => {
    const filtered = allJobs.filter((j) => matchesFilters(j, filters));
    const sorted = sortJobs(filtered, sort);
    return bucketAndTier(sorted, thresholdScore);
  }, [allJobs, filters, sort, thresholdScore]);

  const totalFiltered = Object.values(buckets).reduce(
    (sum, t) => sum + t.top.length + t.also.length + t.below.length,
    0
  );

  const emptyState = (
    <Card className="p-0">
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <Briefcase className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-medium text-foreground">
          {hasActiveFilters ? "No matching jobs" : "No jobs yet"}
        </h2>
        <p className="mt-2 text-muted-foreground max-w-sm mx-auto">
          {hasActiveFilters
            ? "Try adjusting your filters to see more opportunities."
            : "We're scanning for opportunities that match your profile. Check back soon or wait for your daily digest email."}
        </p>
        {hasActiveFilters && (
          <Button
            variant="link"
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-4 text-muted-foreground"
          >
            Clear all filters
          </Button>
        )}
      </div>
    </Card>
  );

  return (
    <div>
      {/* Filters and Sort row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <JobFilters filters={filters} onFiltersChange={setFilters} />
        <JobSort value={sort} onChange={setSort} />
      </div>

      {/* Time-grouped job sections */}
      {totalFiltered === 0 ? (
        emptyState
      ) : (
        <div>
          {(["last24h", "last7d", "last30d", "older"] as const).map((bucket) => {
            const tiered = buckets[bucket];
            if (!hasSomeJob(tiered)) return null;
            return (
              <TimeGroup
                key={bucket}
                id={BUCKET_IDS[bucket]}
                period={BUCKET_LABELS[bucket]}
                tiered={tiered}
                defaultCollapsed={bucket === "older"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

