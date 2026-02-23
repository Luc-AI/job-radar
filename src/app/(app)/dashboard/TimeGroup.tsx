"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "react-feather";
import { JobCard } from "@/components/JobCard";
import { Button } from "@/components/ui/button";
import { JobWithEvaluation, JobTier } from "@/types/database";
import { TieredJobs } from "./dashboardUtils";

interface TimeGroupProps {
  period: string;
  tiered: TieredJobs;
  defaultCollapsed?: boolean;
  id?: string;
}

export function TimeGroup({ period, tiered, defaultCollapsed = false, id }: TimeGroupProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [showBelow, setShowBelow] = useState(false);

  const { top, also, below } = tiered;
  const totalVisible = top.length + also.length;
  const totalAll = totalVisible + below.length;

  // Don't render if no jobs at all
  if (totalAll === 0) return null;

  return (
    <section id={id} className="mb-8">
      {/* Section heading */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-2 mb-4 w-full text-left group"
      >
        {collapsed ? (
          <ChevronRight className="size-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="size-4 text-muted-foreground" />
        )}
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground group-hover:text-foreground transition-colors">
          {period}
        </h2>
        {collapsed && (
          <span className="ml-1 text-xs text-muted-foreground">
            ({totalAll} job{totalAll !== 1 ? "s" : ""})
          </span>
        )}
      </button>

      {!collapsed && (
        <div className="space-y-6">
          {/* Top Picks */}
          {top.length > 0 && (
            <TierSection
              label="Top Picks"
              jobs={top}
              tier="top"
            />
          )}

          {/* Also Worth a Look */}
          {also.length > 0 && (
            <TierSection
              label="Also Worth a Look"
              jobs={also}
              tier="also"
            />
          )}

          {/* Below threshold — toggle */}
          {below.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground mb-3 -ml-2"
                onClick={() => setShowBelow((s) => !s)}
              >
                {showBelow
                  ? `Hide lower matches (${below.length})`
                  : `Show all (${below.length} more)`}
              </Button>

              {showBelow && (
                <div className="flex flex-col gap-4 opacity-60">
                  {below.map((evaluation) => (
                    <JobCard
                      key={evaluation.uuid_evaluation}
                      evaluation={evaluation}
                      tier="below"
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function TierSection({
  label,
  jobs,
  tier,
}: {
  label: string;
  jobs: JobWithEvaluation[];
  tier: JobTier;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-3">
        {label}
      </p>
      <div className="flex flex-col gap-4">
        {jobs.map((evaluation) => (
          <JobCard
            key={evaluation.uuid_evaluation}
            evaluation={evaluation}
            tier={tier}
          />
        ))}
      </div>
    </div>
  );
}
