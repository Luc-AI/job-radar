"use client";

import { useMemo, useState } from "react";
import { Job, JobStatus, WorkMode } from "@/lib/types";
import { JobCard } from "./job-card";
import { JobFilters } from "./job-filters";

export function JobDashboard({ jobs }: { jobs: Job[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [workModeFilter, setWorkModeFilter] = useState<WorkMode | "all">("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return jobs.filter((job) => {
      if (statusFilter !== "all" && job.status !== statusFilter) return false;
      if (workModeFilter !== "all" && job.workMode !== workModeFilter) return false;
      if (
        q &&
        !job.title.toLowerCase().includes(q) &&
        !job.company.toLowerCase().includes(q) &&
        !job.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      return true;
    });
  }, [jobs, search, statusFilter, workModeFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: jobs.length };
    for (const job of jobs) {
      map[job.status] = (map[job.status] || 0) + 1;
    }
    return map;
  }, [jobs]);

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {(
          [
            ["all", "Total"],
            ["saved", "Saved"],
            ["applied", "Applied"],
            ["interviewing", "Interviewing"],
            ["offered", "Offered"],
            ["rejected", "Rejected"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setStatusFilter(key === "all" ? "all" : key)}
            className={`rounded-lg border p-3 text-center transition-colors ${
              statusFilter === key
                ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
                : "border-zinc-200 bg-white hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-500"
            }`}
          >
            <p className="text-2xl font-bold">{counts[key] ?? 0}</p>
            <p className="text-xs">{label}</p>
          </button>
        ))}
      </div>

      <JobFilters
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        workModeFilter={workModeFilter}
        onWorkModeChange={setWorkModeFilter}
      />

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-zinc-400">
          No jobs match your filters.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
