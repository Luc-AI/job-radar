import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { JobWithEvaluation, EvaluationStatus } from "@/types/database";

interface JobCardProps {
  evaluation: JobWithEvaluation;
}

function ScoreBadge({ score }: { score: number }) {
  // Convert 1-10 scale to percentage for display
  const percentage = Math.round(score * 10);

  // Color coding based on score
  let colorClasses: string;
  if (score >= 9) {
    colorClasses = "bg-green-100 text-green-800 border-green-200";
  } else if (score >= 8) {
    colorClasses = "bg-blue-100 text-blue-800 border-blue-200";
  } else if (score >= 7) {
    colorClasses = "bg-sky-100 text-sky-800 border-sky-200";
  } else if (score >= 6) {
    colorClasses = "bg-amber-100 text-amber-800 border-amber-200";
  } else {
    colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-semibold border ${colorClasses}`}
    >
      {percentage}%
    </span>
  );
}

function StatusChip({ status }: { status: EvaluationStatus }) {
  const statusConfig: Record<
    EvaluationStatus,
    { label: string; classes: string }
  > = {
    new: {
      label: "NEW",
      classes: "bg-emerald-100 text-emerald-700",
    },
    viewed: {
      label: "VIEWED",
      classes: "bg-slate-100 text-slate-600",
    },
    saved: {
      label: "SAVED",
      classes: "bg-blue-100 text-blue-700",
    },
    applied: {
      label: "APPLIED",
      classes: "bg-purple-100 text-purple-700",
    },
    hidden: {
      label: "HIDDEN",
      classes: "bg-gray-100 text-gray-500",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Recently";

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function JobCard({ evaluation }: JobCardProps) {
  const { job } = evaluation;

  return (
    <Link href={`/jobs/${evaluation.id}`}>
      <Card
        padding="none"
        className="hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
      >
        <div className="p-4 sm:p-5">
          {/* Header: Title, Score, Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-semibold text-slate-900 truncate">
                  {job.title}
                </h3>
                {evaluation.status === "new" && (
                  <StatusChip status={evaluation.status} />
                )}
              </div>
              <p className="mt-0.5 text-sm text-slate-600">{job.company}</p>
            </div>
            <ScoreBadge score={evaluation.score_total} />
          </div>

          {/* Meta: Location, Posted Date */}
          <div className="mt-3 flex items-center gap-3 text-sm text-slate-500">
            {job.location && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {job.location}
              </span>
            )}
            {job.remote_type && job.remote_type !== "onsite" && (
              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">
                {job.remote_type}
              </span>
            )}
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formatDate(job.posted_at)}
            </span>
          </div>

          {/* Match Summary */}
          {evaluation.reason_overall && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <p className="text-sm text-slate-600 line-clamp-2">
                <span className="font-medium text-slate-700">Why it matches: </span>
                {evaluation.reason_overall}
              </p>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}
