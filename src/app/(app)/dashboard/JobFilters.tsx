"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  JobFilters as JobFiltersType,
  ScoreRange,
  DatePosted,
  EvaluationStatus,
} from "@/types/database";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  filteredCount: number;
  totalCount: number;
}

const SCORE_OPTIONS: { value: ScoreRange; label: string }[] = [
  { value: "90+", label: "90%+" },
  { value: "80-89", label: "80-89%" },
  { value: "70-79", label: "70-79%" },
  { value: "below70", label: "Below 70%" },
];

const DATE_OPTIONS: { value: DatePosted; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 days" },
  { value: "30days", label: "Last 30 days" },
];

const STATUS_OPTIONS: { value: EvaluationStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "viewed", label: "Viewed" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
];

function FilterCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer py-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-0"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function FilterRadio({
  checked,
  onChange,
  label,
  name,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  name: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer py-1">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-0"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-slate-900">{title}</h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function FilterContent({
  filters,
  onFiltersChange,
}: {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
}) {
  const toggleScoreRange = (range: ScoreRange) => {
    const newRanges = filters.scoreRanges.includes(range)
      ? filters.scoreRanges.filter((r) => r !== range)
      : [...filters.scoreRanges, range];
    onFiltersChange({ ...filters, scoreRanges: newRanges });
  };

  const setDatePosted = (date: DatePosted | null) => {
    onFiltersChange({ ...filters, datePosted: date });
  };

  const toggleStatus = (status: EvaluationStatus) => {
    const newStatuses = filters.statuses.includes(status)
      ? filters.statuses.filter((s) => s !== status)
      : [...filters.statuses, status];
    onFiltersChange({ ...filters, statuses: newStatuses });
  };

  const hasActiveFilters =
    filters.scoreRanges.length > 0 ||
    filters.datePosted !== null ||
    filters.statuses.length > 0;

  const clearFilters = () => {
    onFiltersChange({
      scoreRanges: [],
      datePosted: null,
      statuses: [],
    });
  };

  return (
    <div className="space-y-5">
      {/* Score Range */}
      <FilterSection title="Match Score">
        {SCORE_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.scoreRanges.includes(option.value)}
            onChange={() => toggleScoreRange(option.value)}
            label={option.label}
          />
        ))}
      </FilterSection>

      {/* Date Posted */}
      <FilterSection title="Date Posted">
        <FilterRadio
          name="datePosted"
          checked={filters.datePosted === null}
          onChange={() => setDatePosted(null)}
          label="Any time"
        />
        {DATE_OPTIONS.map((option) => (
          <FilterRadio
            key={option.value}
            name="datePosted"
            checked={filters.datePosted === option.value}
            onChange={() => setDatePosted(option.value)}
            label={option.label}
          />
        ))}
      </FilterSection>

      {/* Status */}
      <FilterSection title="Status">
        {STATUS_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            checked={filters.statuses.includes(option.value)}
            onChange={() => toggleStatus(option.value)}
            label={option.label}
          />
        ))}
      </FilterSection>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-slate-600 hover:text-slate-900 underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

// Mobile filter drawer
function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  filteredCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
  filteredCount: number;
}) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-xl max-h-[80vh] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-slate-500 hover:text-slate-700"
            aria-label="Close filters"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
          <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
        </div>

        <div className="p-4 border-t border-slate-200 bg-white">
          <Button onClick={onClose} className="w-full">
            Show {filteredCount} jobs
          </Button>
        </div>
      </div>
    </>
  );
}

export function JobFilters({
  filters,
  onFiltersChange,
  filteredCount,
  totalCount,
}: JobFiltersProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const hasActiveFilters =
    filters.scoreRanges.length > 0 ||
    filters.datePosted !== null ||
    filters.statuses.length > 0;

  const activeFilterCount =
    filters.scoreRanges.length +
    (filters.datePosted ? 1 : 0) +
    filters.statuses.length;

  return (
    <>
      {/* Desktop sidebar - hidden on mobile */}
      <div className="hidden lg:block">
        <Card className="sticky top-4">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">Filters</h2>
              {filteredCount !== totalCount && (
                <span className="text-sm text-slate-500">
                  {filteredCount} of {totalCount}
                </span>
              )}
            </div>
            <FilterContent
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          </div>
        </Card>
      </div>

      {/* Mobile filter button - hidden on desktop */}
      <div className="lg:hidden mb-4">
        <Button
          variant="secondary"
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center gap-2"
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
          {activeFilterCount > 0 && (
            <span className="px-1.5 py-0.5 bg-slate-900 text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Mobile drawer */}
      <MobileFilterDrawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        filters={filters}
        onFiltersChange={onFiltersChange}
        filteredCount={filteredCount}
      />
    </>
  );
}
