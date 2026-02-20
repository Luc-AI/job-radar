"use client";

import { useState } from "react";
import { ChevronDown } from "react-feather";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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

  const getScoreTextColor = (score: number) => {
    if (score >= 9) return "text-green-700";
    if (score >= 8) return "text-blue-700";
    if (score >= 7) return "text-sky-700";
    if (score >= 6) return "text-amber-700";
    return "text-muted-foreground";
  };

  const getProgressColor = (score: number) => {
    if (score >= 9) return "[&>div]:bg-green-500";
    if (score >= 8) return "[&>div]:bg-blue-500";
    if (score >= 7) return "[&>div]:bg-sky-500";
    if (score >= 6) return "[&>div]:bg-amber-500";
    return "[&>div]:bg-muted-foreground";
  };

  return (
    <Card className="p-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between text-left lg:pointer-events-none"
      >
        <h2 className="text-lg font-semibold text-foreground">
          AI Match Breakdown
        </h2>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground transition-transform lg:hidden ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        className={`mt-4 space-y-4 ${
          isExpanded ? "block" : "hidden lg:block"
        }`}
      >
        {/* Overall Summary */}
        {evaluation.reason_overall && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-foreground leading-relaxed">
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
                  <span className="text-sm font-medium text-foreground">
                    {dimension.label}
                  </span>
                  <span
                    className={`text-sm font-semibold ${getScoreTextColor(dimension.score)}`}
                  >
                    {percentage}%
                  </span>
                </div>

                {/* Progress Bar */}
                <Progress
                  value={percentage}
                  className={`h-2 ${getProgressColor(dimension.score)}`}
                />

                {/* Reason */}
                {dimension.reason && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
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
