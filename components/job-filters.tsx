"use client";

import { JobStatus, WorkMode } from "@/lib/types";

interface JobFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: JobStatus | "all";
  onStatusChange: (value: JobStatus | "all") => void;
  workModeFilter: WorkMode | "all";
  onWorkModeChange: (value: WorkMode | "all") => void;
}

const statusOptions: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offered", label: "Offered" },
  { value: "rejected", label: "Rejected" },
];

const workModeOptions: { value: WorkMode | "all"; label: string }[] = [
  { value: "all", label: "All Modes" },
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export function JobFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusChange,
  workModeFilter,
  onWorkModeChange,
}: JobFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="text"
        placeholder="Search jobs, companies, tags..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="h-10 flex-1 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:ring-zinc-100"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as JobStatus | "all")}
        className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-100"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={workModeFilter}
        onChange={(e) => onWorkModeChange(e.target.value as WorkMode | "all")}
        className="h-10 rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-zinc-100"
      >
        {workModeOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
