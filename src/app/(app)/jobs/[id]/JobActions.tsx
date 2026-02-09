"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EvaluationStatus } from "@/types/database";
import { useToast } from "@/components/ui/Toast";
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
  const { showToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (newStatus: EvaluationStatus) => {
    const previousStatus = currentStatus;
    setCurrentStatus(newStatus);
    startTransition(async () => {
      const result = await updateJobStatus(evaluationId, newStatus);
      if (result.success) {
        showToast(STATUS_MESSAGES[newStatus], "success");
      } else {
        setCurrentStatus(previousStatus);
        showToast(result.error || "Failed to update status", "error");
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
        <button
          onClick={handleOpenJob}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
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
        onClick={() => handleStatusChange(isSaved ? "viewed" : "saved")}
        disabled={isPending}
        className={`
          inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors
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

      {/* Applied Button - Toggleable */}
      <button
        onClick={() => handleStatusChange(isApplied ? "viewed" : "applied")}
        disabled={isPending}
        className={`
          inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors
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
        onClick={() => handleStatusChange("hidden")}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-50"
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
  );
}
