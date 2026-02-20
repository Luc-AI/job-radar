"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  ExternalLink,
  Bookmark,
  CheckCircle,
  EyeOff,
} from "react-feather";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JobWithEvaluation, EvaluationStatus } from "@/types/database";
import { updateJobStatus } from "@/app/(app)/jobs/[id]/actions";
import { CompanyLogo } from "@/components/CompanyLogo";

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
  const percentage = Math.round(score * 10);

  // Color coding based on score using semantic-friendly classes
  let variant: "default" | "secondary" | "outline" | "destructive" = "secondary";
  let className = "";

  if (score >= 9) {
    className = "bg-green-100 text-green-800 border-green-200 hover:bg-green-100";
  } else if (score >= 8) {
    className = "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100";
  } else if (score >= 7) {
    className = "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100";
  } else if (score >= 6) {
    className = "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100";
  } else {
    className = "bg-muted text-muted-foreground border-border hover:bg-muted";
  }

  return (
    <Badge variant="outline" className={`font-semibold ${className}`}>
      {percentage}%
    </Badge>
  );
}

function StatusChip({ status }: { status: EvaluationStatus }) {
  const statusConfig: Record<
    EvaluationStatus,
    { label: string; className: string }
  > = {
    new: {
      label: "NEW",
      className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    },
    viewed: {
      label: "VIEWED",
      className: "bg-muted text-muted-foreground hover:bg-muted",
    },
    saved: {
      label: "SAVED",
      className: "bg-blue-100 text-blue-700 hover:bg-blue-100",
    },
    applied: {
      label: "APPLIED",
      className: "bg-purple-100 text-purple-700 hover:bg-purple-100",
    },
    hidden: {
      label: "HIDDEN",
      className: "bg-muted text-muted-foreground hover:bg-muted",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant="secondary" className={`text-xs ${config.className}`}>
      {config.label}
    </Badge>
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
        toast.success(STATUS_MESSAGES[newStatus]);
        router.refresh();
      } else {
        setCurrentStatus(previousStatus);
        toast.error(result.error || "Failed to update status");
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
    <Link href={`/jobs/${evaluation.uuid_evaluation}`} data-testid="job-card">
      <Card className="hover:shadow-md hover:border-border transition-all cursor-pointer p-0">
        <div className="p-4 sm:p-5">
          {/* Header: Logo, Title, Score, Status */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-end gap-3 flex-1 min-w-0">
              <CompanyLogo
                logoUrl={job.company_logo_url}
                companyName={job.company}
                size="md"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground truncate">
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
                <p className="mt-0.5 text-sm text-muted-foreground">{job.company}</p>
              </div>
            </div>
            <ScoreBadge score={evaluation.score_total} />
          </div>

          {/* Meta: Location, Posted Date */}
          <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {job.location}
              </span>
            )}
            {job.remote_type && job.remote_type !== "onsite" && (
              <Badge variant="secondary" className="text-xs">
                {job.remote_type}
              </Badge>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(job.posted_at)}
            </span>
          </div>

          {/* Match Summary */}
          {evaluation.reason_overall && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-sm text-muted-foreground line-clamp-2">
                <span className="font-medium text-foreground">Why it matches: </span>
                {evaluation.reason_overall}
              </p>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mt-3 pt-3 border-t border-border flex items-center gap-2">
            {/* View Job Button - Opens external URL */}
            {applyUrl && (
              <Button
                size="sm"
                onClick={handleOpenJob}
                disabled={isPending}
              >
                <ExternalLink className="h-4 w-4" />
                View Job
              </Button>
            )}

            {/* Save Button */}
            <Button
              size="sm"
              variant={isSaved ? "secondary" : "outline"}
              onClick={(e) =>
                handleStatusChange(e, isSaved ? "viewed" : "saved")
              }
              disabled={isPending}
              className={isSaved ? "bg-blue-100 text-blue-700 hover:bg-blue-200" : ""}
            >
              <Bookmark
                className="h-4 w-4"
                fill={isSaved ? "currentColor" : "none"}
              />
              {isSaved ? "Saved" : "Save"}
            </Button>

            {/* Apply Button - Marks job as applied */}
            <Button
              size="sm"
              variant={isApplied ? "secondary" : "outline"}
              onClick={(e) =>
                handleStatusChange(e, isApplied ? "viewed" : "applied")
              }
              disabled={isPending}
              className={isApplied ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : ""}
            >
              <CheckCircle className="h-4 w-4" />
              Applied
            </Button>

            {/* Hide Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => handleStatusChange(e, "hidden")}
              disabled={isPending}
              className="ml-auto text-muted-foreground"
            >
              <EyeOff className="h-4 w-4" />
              Hide
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
