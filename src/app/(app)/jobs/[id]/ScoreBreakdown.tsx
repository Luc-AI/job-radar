"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Evaluation } from "@/types/database";

interface ScoreBreakdownProps {
  evaluation: Evaluation;
}

interface ScoreDimension {
  key: string;
  label: string;
  score: number | null;
  reason: string | null;
}

export function ScoreBreakdown({ evaluation }: ScoreBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const dimensions: ScoreDimension[] = [
    {
      key: "role",
      label: "Role Fit",
      score: evaluation.score_role,
      reason: evaluation.reason_role,
    },
    {
      key: "company",
      label: "Company",
      score: evaluation.score_company,
      reason: evaluation.reason_company,
    },
    {
      key: "location",
      label: "Location",
      score: evaluation.score_location,
      reason: evaluation.reason_location,
    },
    {
      key: "industry",
      label: "Industry",
      score: evaluation.score_industry,
      reason: evaluation.reason_industry,
    },
    {
      key: "growth",
      label: "Growth",
      score: evaluation.score_growth,
      reason: evaluation.reason_growth,
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-green-500";
    if (score >= 8) return "bg-blue-500";
    if (score >= 7) return "bg-sky-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-slate-400";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 9) return "text-green-700";
    if (score >= 8) return "text-blue-700";
    if (score >= 7) return "text-sky-700";
    if (score >= 6) return "text-amber-700";
    return "text-slate-600";
  };

  return (
    <Card>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left lg:pointer-events-none"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          AI Match Breakdown
        </h2>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform lg:hidden ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`mt-4 space-y-4 ${
          isExpanded ? "block" : "hidden lg:block"
        }`}
      >
        {/* Overall Summary */}
        {evaluation.reason_overall && (
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-700 leading-relaxed">
              {evaluation.reason_overall}
            </p>
          </div>
        )}

        {/* Score Dimensions */}
        <div className="space-y-3">
          {dimensions.map((dimension) => {
            if (dimension.score === null) return null;
            const percentage = Math.round(dimension.score * 10);

            return (
              <div key={dimension.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {dimension.label}
                  </span>
                  <span
                    className={`text-sm font-semibold ${getScoreTextColor(dimension.score)}`}
                  >
                    {percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getScoreColor(dimension.score)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Reason */}
                {dimension.reason && (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {dimension.reason}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
