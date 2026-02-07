import { Job, JobStatus } from "@/lib/types";

const statusConfig: Record<JobStatus, { label: string; className: string }> = {
  saved: { label: "Saved", className: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300" },
  applied: { label: "Applied", className: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" },
  interviewing: { label: "Interviewing", className: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300" },
  offered: { label: "Offered", className: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300" },
};

const workModeLabel: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

export function JobCard({ job }: { job: Job }) {
  const status = statusConfig[job.status];

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {job.title}
          </h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{job.company}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-500 dark:text-zinc-400">
        <span>{job.location}</span>
        <span>{workModeLabel[job.workMode]}</span>
        {job.salary && <span>{job.salary}</span>}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
        {job.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-500">
        Posted {job.postedAt}
      </p>
    </div>
  );
}
