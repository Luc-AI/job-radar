"use client";

import { useState, useRef, useEffect } from "react";
import {
  JobFilters as JobFiltersType,
  ScoreRange,
  DatePosted,
  EvaluationStatus,
} from "@/types/database";

interface JobFiltersProps {
  filters: JobFiltersType;
  onFiltersChange: (filters: JobFiltersType) => void;
}

const SCORE_OPTIONS: { value: ScoreRange; label: string }[] = [
  { value: "90+", label: "90%+" },
  { value: "80-89", label: "80-89%" },
  { value: "70-79", label: "70-79%" },
  { value: "below70", label: "Below 70%" },
];

const DATE_OPTIONS: { value: DatePosted | null; label: string }[] = [
  { value: null, label: "Any time" },
  { value: "today", label: "Today" },
  { value: "7days", label: "Last 7 days" },
  { value: "30days", label: "Last 30 days" },
];

const STATUS_OPTIONS: { value: EvaluationStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "viewed", label: "Viewed" },
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "hidden", label: "Hidden" },
];

function FilterDropdown({
  label,
  isOpen,
  onToggle,
  selectedCount,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  selectedCount: number;
  children: React.ReactNode;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        if (isOpen) onToggle();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className={`
          flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors
          ${
            selectedCount > 0
              ? "bg-slate-900 text-white border-slate-900"
              : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
          }
        `}
      >
        {label}
        {selectedCount > 0 && (
          <span className="bg-white text-slate-900 text-xs px-1.5 py-0.5 rounded-full font-medium">
            {selectedCount}
          </span>
        )}
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
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

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-2 min-w-[160px] z-20">
          {children}
        </div>
      )}
    </div>
  );
}

function CheckboxOption({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-50">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-2 focus:ring-slate-500 focus:ring-offset-0"
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function RadioOption({
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
    <label className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-slate-50">
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

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const toggleScoreRange = (range: ScoreRange) => {
    const newRanges = filters.scoreRanges.includes(range)
      ? filters.scoreRanges.filter((r) => r !== range)
      : [...filters.scoreRanges, range];
    onFiltersChange({ ...filters, scoreRanges: newRanges });
  };

  const setDatePosted = (date: DatePosted | null) => {
    onFiltersChange({ ...filters, datePosted: date });
    setOpenDropdown(null);
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
    <div className="flex flex-wrap items-center gap-2">
      {/* Score Filter */}
      <FilterDropdown
        label="Match Score"
        isOpen={openDropdown === "score"}
        onToggle={() => toggleDropdown("score")}
        selectedCount={filters.scoreRanges.length}
      >
        {SCORE_OPTIONS.map((option) => (
          <CheckboxOption
            key={option.value}
            checked={filters.scoreRanges.includes(option.value)}
            onChange={() => toggleScoreRange(option.value)}
            label={option.label}
          />
        ))}
      </FilterDropdown>

      {/* Date Filter */}
      <FilterDropdown
        label="Date Posted"
        isOpen={openDropdown === "date"}
        onToggle={() => toggleDropdown("date")}
        selectedCount={filters.datePosted ? 1 : 0}
      >
        {DATE_OPTIONS.map((option) => (
          <RadioOption
            key={option.value ?? "any"}
            name="datePosted"
            checked={filters.datePosted === option.value}
            onChange={() => setDatePosted(option.value)}
            label={option.label}
          />
        ))}
      </FilterDropdown>

      {/* Status Filter */}
      <FilterDropdown
        label="Status"
        isOpen={openDropdown === "status"}
        onToggle={() => toggleDropdown("status")}
        selectedCount={filters.statuses.length}
      >
        {STATUS_OPTIONS.map((option) => (
          <CheckboxOption
            key={option.value}
            checked={filters.statuses.includes(option.value)}
            onChange={() => toggleStatus(option.value)}
            label={option.label}
          />
        ))}
      </FilterDropdown>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-slate-500 hover:text-slate-700 px-2 py-2"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
