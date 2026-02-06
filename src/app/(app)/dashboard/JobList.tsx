"use client";

import { useState, useTransition, useEffect } from "react";
import { JobCard } from "@/components/JobCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { JobWithEvaluation, JobFilters as JobFiltersType } from "@/types/database";
import { loadMoreJobs, getFilteredJobCount } from "./actions";
import { JobFilters } from "./JobFilters";

interface JobListProps {
  initialJobs: JobWithEvaluation[];
  totalCount: number;
  pageSize: number;
}

const EMPTY_FILTERS: JobFiltersType = {
  scoreRanges: [],
  datePosted: null,
  statuses: [],
};

export function JobList({ initialJobs, totalCount, pageSize }: JobListProps) {
  const [jobs, setJobs] = useState(initialJobs);
  const [filters, setFilters] = useState<JobFiltersType>(EMPTY_FILTERS);
  const [filteredCount, setFilteredCount] = useState(totalCount);
  const [isPending, startTransition] = useTransition();
  const [isFiltering, setIsFiltering] = useState(false);

  const hasActiveFilters =
    filters.scoreRanges.length > 0 ||
    filters.datePosted !== null ||
    filters.statuses.length > 0;

  // Refetch jobs when filters change
  useEffect(() => {
    if (!hasActiveFilters) {
      // Reset to initial state when filters cleared
      setJobs(initialJobs);
      setFilteredCount(totalCount);
      return;
    }

    setIsFiltering(true);
    const fetchFiltered = async () => {
      const [newJobs, counts] = await Promise.all([
        loadMoreJobs(0, pageSize, filters),
        getFilteredJobCount(filters),
      ]);
      setJobs(newJobs);
      setFilteredCount(counts.filteredCount);
      setIsFiltering(false);
    };
    fetchFiltered();
  }, [filters, initialJobs, totalCount, pageSize, hasActiveFilters]);

  const hasMore = jobs.length < filteredCount;

  const handleLoadMore = () => {
    startTransition(async () => {
      const newJobs = await loadMoreJobs(jobs.length, pageSize, filters);
      setJobs((prev) => [...prev, ...newJobs]);
    });
  };

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
  };

  // Empty state - shown when no jobs match filters
  const emptyState = (
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
          {hasActiveFilters ? "No matching jobs" : "No jobs yet"}
        </h2>
        <p className="mt-2 text-slate-600 max-w-sm mx-auto">
          {hasActiveFilters
            ? "Try adjusting your filters to see more opportunities."
            : "We're scanning for opportunities that match your profile. Check back soon or wait for your daily digest email."}
        </p>
        {hasActiveFilters && (
          <button
            onClick={() => setFilters(EMPTY_FILTERS)}
            className="mt-4 text-sm text-slate-600 hover:text-slate-900 underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </Card>
  );

  return (
    <div className="lg:flex lg:gap-6">
      {/* Filter sidebar on desktop */}
      <div className="lg:w-56 lg:flex-shrink-0">
        <JobFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          filteredCount={filteredCount}
          totalCount={totalCount}
        />
      </div>

      {/* Job list */}
      <div className="flex-1 min-w-0">
        {isFiltering ? (
          <div className="flex justify-center py-12">
            <svg
              className="animate-spin h-8 w-8 text-slate-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </div>
        ) : jobs.length === 0 ? (
          emptyState
        ) : (
          <div className="space-y-4">
            {/* Job cards */}
            {jobs.map((evaluation) => (
              <JobCard key={evaluation.id} evaluation={evaluation} />
            ))}

            {/* Load More button */}
            {hasMore && (
              <div className="pt-4 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={handleLoadMore}
                  isLoading={isPending}
                >
                  Load More
                </Button>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && jobs.length > 0 && (
              <p className="text-center text-sm text-slate-500 pt-4">
                You&apos;ve seen all {filteredCount} jobs
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
