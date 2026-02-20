"use client";

import { useState, useTransition, useEffect } from "react";
import { Loader2, Briefcase } from "lucide-react";
import { JobCard } from "@/components/JobCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  JobWithEvaluation,
  JobFilters as JobFiltersType,
  SortOption,
} from "@/types/database";
import { loadMoreJobs, getFilteredJobCount } from "./actions";
import { JobFilters } from "./JobFilters";
import { JobSort } from "./JobSort";

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
  const [sort, setSort] = useState<SortOption>("score_desc");
  const [filteredCount, setFilteredCount] = useState(totalCount);
  const [isPending, startTransition] = useTransition();
  const [isFiltering, setIsFiltering] = useState(false);

  const hasActiveFilters =
    filters.scoreRanges.length > 0 ||
    filters.datePosted !== null ||
    filters.statuses.length > 0;

  // Refetch jobs when filters or sort change
  useEffect(() => {
    // If no filters and default sort, use initial data
    if (!hasActiveFilters && sort === "score_desc") {
      setJobs(initialJobs);
      setFilteredCount(totalCount);
      return;
    }

    setIsFiltering(true);
    const fetchFiltered = async () => {
      const [newJobs, counts] = await Promise.all([
        loadMoreJobs(0, pageSize, filters, sort),
        getFilteredJobCount(filters),
      ]);
      setJobs(newJobs);
      setFilteredCount(counts.filteredCount);
      setIsFiltering(false);
    };
    fetchFiltered();
  }, [filters, sort, initialJobs, totalCount, pageSize, hasActiveFilters]);

  const hasMore = jobs.length < filteredCount;

  const handleLoadMore = () => {
    startTransition(async () => {
      const newJobs = await loadMoreJobs(jobs.length, pageSize, filters, sort);
      setJobs((prev) => [...prev, ...newJobs]);
    });
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
  };

  const handleFiltersChange = (newFilters: JobFiltersType) => {
    setFilters(newFilters);
  };

  // Empty state - shown when no jobs match filters
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
        <JobFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />
        <JobSort value={sort} onChange={handleSortChange} />
      </div>

      {/* Job list */}
      <div>
        {isFiltering ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
          </div>
        ) : jobs.length === 0 ? (
          emptyState
        ) : (
          <div className="flex flex-col gap-4">
            {/* Job cards */}
            {jobs.map((evaluation) => (
              <JobCard key={evaluation.uuid_evaluation} evaluation={evaluation} />
            ))}

            {/* Load More button */}
            {hasMore && (
              <div className="pt-4 flex justify-center">
                <Button
                  variant="secondary"
                  onClick={handleLoadMore}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}

            {/* End of list indicator */}
            {!hasMore && jobs.length > 0 && (
              <p className="text-center text-sm text-muted-foreground pt-4">
                You&apos;ve seen all {filteredCount} jobs
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
