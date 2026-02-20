"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Bookmark, CheckCircle, EyeOff } from "react-feather";
import { Button } from "@/components/ui/button";
import { EvaluationStatus } from "@/types/database";
import { updateJobStatus } from "./actions";

interface JobActionsProps {
  evaluationId: string;
  status: EvaluationStatus;
  applyUrl: string | null;
}

const STATUS_MESSAGES: Record<EvaluationStatus, string> = {
  saved: "Job saved",
  applied: "Marked as applied",
  hidden: "Job hidden",
  viewed: "Job unsaved",
  new: "Status reset",
};

export function JobActions({ evaluationId, status, applyUrl }: JobActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (newStatus: EvaluationStatus) => {
    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    startTransition(async () => {
      const result = await updateJobStatus(evaluationId, newStatus);
      if (result.success) {
        toast.success(STATUS_MESSAGES[newStatus]);
      } else {
        setCurrentStatus(previousStatus);
        toast.error(result.error || "Failed to update status");
      }
      router.refresh();
    });
  };

  const handleOpenJob = () => {
    if (applyUrl) {
      window.open(applyUrl, "_blank", "noopener,noreferrer");
    }
  };

  const isSaved = currentStatus === "saved";
  const isApplied = currentStatus === "applied";

  return (
    <div className="flex flex-wrap gap-3">
      {/* View Job Button - Opens external URL */}
      {applyUrl && (
        <Button onClick={handleOpenJob} disabled={isPending}>
          <ExternalLink className="h-4 w-4" />
          View Job
        </Button>
      )}

      {/* Save Button */}
      <Button
        variant={isSaved ? "secondary" : "outline"}
        onClick={() => handleStatusChange(isSaved ? "viewed" : "saved")}
        disabled={isPending}
      >
        <Bookmark className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
        {isSaved ? "Saved" : "Save"}
      </Button>

      {/* Applied Button - Toggleable */}
      <Button
        variant={isApplied ? "secondary" : "outline"}
        onClick={() => handleStatusChange(isApplied ? "viewed" : "applied")}
        disabled={isPending}
      >
        <CheckCircle className="h-4 w-4" />
        Applied
      </Button>

      {/* Hide Button */}
      <Button
        variant="ghost"
        onClick={() => handleStatusChange("hidden")}
        disabled={isPending}
      >
        <EyeOff className="h-4 w-4" />
        Hide
      </Button>
    </div>
  );
}
