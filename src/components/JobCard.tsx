"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { JobWithEvaluation, EvaluationStatus } from "@/types/database";
import { useToast } from "@/components/ui/Toast";
import { updateJobStatus } from "@/app/(app)/jobs/[id]/actions";

interface JobCardProps {
  evaluation: JobWithEvaluation;
}

const STATUS_MESSAGES: Record<EvaluationStatus, string> = {
  saved: "Job saved",
  applied: "Marked as applied",
  hidden: "Job hidden",
  viewed: "Job unsaved",
  new: "Status reset",
};

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
  const router = useRouter();
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(evaluation.status);

  const applyUrl = job.apply_url || job.url;

  const handleStatusChange = (
    e: React.MouseEvent,
    newStatus: EvaluationStatus
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);

    startTransition(async () => {
      const result = await updateJobStatus(evaluation.uuid_evaluation, newStatus);
      if (result.success) {
        showToast(STATUS_MESSAGES[newStatus], "success");
        router.refresh();
      } else {
        setCurrentStatus(previousStatus);
        showToast(result.error || "Failed to update status", "error");
      }
    });
  };

  const handleOpenJob = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (applyUrl) {
      window.open(applyUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isSaved = currentStatus === "saved";
  const isApplied = currentStatus === "applied";

  return (
    <Link href={`/jobs/${evaluation.uuid_evaluation}`}>
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
                {currentStatus === "new" && (
                  <StatusChip status={currentStatus} />
                )}
                {currentStatus === "saved" && (
                  <StatusChip status={currentStatus} />
                )}
                {currentStatus === "applied" && (
                  <StatusChip status={currentStatus} />
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

          {/* Quick Actions */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
            {/* View Job Button - Opens external URL */}
            {applyUrl && (
              <button
                onClick={handleOpenJob}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Job
              </button>
            )}

            {/* Save Button */}
            <button
              onClick={(e) =>
                handleStatusChange(e, isSaved ? "viewed" : "saved")
              }
              disabled={isPending}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors
                ${
                  isSaved
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
                disabled:opacity-50
              `}
            >
              <svg
                className="w-4 h-4"
                fill={isSaved ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              {isSaved ? "Saved" : "Save"}
            </button>

            {/* Apply Button - Marks job as applied */}
            <button
              onClick={(e) =>
                handleStatusChange(e, isApplied ? "viewed" : "applied")
              }
              disabled={isPending}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors
                ${
                  isApplied
                    ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }
                disabled:opacity-50
              `}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Applied
            </button>

            {/* Hide Button */}
            <button
              onClick={(e) => handleStatusChange(e, "hidden")}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50 ml-auto"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
              Hide
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
