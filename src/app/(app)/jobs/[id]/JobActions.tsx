"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { EvaluationStatus } from "@/types/database";
import { updateJobStatus } from "./actions";

interface JobActionsProps {
  evaluationId: string;
  status: EvaluationStatus;
  applyUrl: string | null;
}

export function JobActions({ evaluationId, status, applyUrl }: JobActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentStatus, setCurrentStatus] = useState(status);

  const handleStatusChange = (newStatus: EvaluationStatus) => {
    setCurrentStatus(newStatus);
    startTransition(async () => {
      await updateJobStatus(evaluationId, newStatus);
      router.refresh();
    });
  };

  const handleApply = () => {
    if (applyUrl) {
      window.open(applyUrl, "_blank", "noopener,noreferrer");
      handleStatusChange("applied");
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      {/* Apply Button - Primary */}
      {applyUrl && (
        <Button onClick={handleApply} disabled={isPending}>
          <svg
            className="w-4 h-4 mr-2"
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
          Apply on Company Site
        </Button>
      )}

      {/* Save Button */}
      <Button
        variant={currentStatus === "saved" ? "primary" : "secondary"}
        onClick={() =>
          handleStatusChange(currentStatus === "saved" ? "viewed" : "saved")
        }
        disabled={isPending}
      >
        <svg
          className="w-4 h-4 mr-2"
          fill={currentStatus === "saved" ? "currentColor" : "none"}
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
        {currentStatus === "saved" ? "Saved" : "Save"}
      </Button>

      {/* Mark Applied Button (if not already applied) */}
      {currentStatus !== "applied" && (
        <Button
          variant="secondary"
          onClick={() => handleStatusChange("applied")}
          disabled={isPending}
        >
          <svg
            className="w-4 h-4 mr-2"
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
          Mark Applied
        </Button>
      )}

      {/* Applied Badge (if already applied) */}
      {currentStatus === "applied" && (
        <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg">
          <svg
            className="w-4 h-4 mr-2"
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
        </span>
      )}

      {/* Hide Button */}
      <Button
        variant="ghost"
        onClick={() => handleStatusChange("hidden")}
        disabled={isPending}
        className="text-slate-500 hover:text-slate-700"
      >
        <svg
          className="w-4 h-4 mr-2"
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
      </Button>
    </div>
  );
}
