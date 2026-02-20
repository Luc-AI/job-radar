"use client";

import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const toggleScoreRange = (range: ScoreRange) => {
    const newRanges = filters.scoreRanges.includes(range)
      ? filters.scoreRanges.filter((r) => r !== range)
      : [...filters.scoreRanges, range];
    onFiltersChange({ ...filters, scoreRanges: newRanges });
  };

  const setDatePosted = (date: DatePosted | null) => {
    onFiltersChange({ ...filters, datePosted: date });
    setOpenPopover(null);
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
      <Popover
        open={openPopover === "score"}
        onOpenChange={(open) => setOpenPopover(open ? "score" : null)}
      >
        <PopoverTrigger asChild>
          <Button
            variant={filters.scoreRanges.length > 0 ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            Match Score
            {filters.scoreRanges.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary-foreground text-primary px-1.5 py-0"
              >
                {filters.scoreRanges.length}
              </Badge>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openPopover === "score" ? "rotate-180" : ""
              }`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-2" align="start">
          <div className="space-y-1">
            {SCORE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted"
              >
                <Checkbox
                  checked={filters.scoreRanges.includes(option.value)}
                  onCheckedChange={() => toggleScoreRange(option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Date Filter */}
      <Popover
        open={openPopover === "date"}
        onOpenChange={(open) => setOpenPopover(open ? "date" : null)}
      >
        <PopoverTrigger asChild>
          <Button
            variant={filters.datePosted ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            Date Posted
            {filters.datePosted && (
              <Badge
                variant="secondary"
                className="bg-primary-foreground text-primary px-1.5 py-0"
              >
                1
              </Badge>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openPopover === "date" ? "rotate-180" : ""
              }`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-2" align="start">
          <RadioGroup
            value={filters.datePosted ?? "any"}
            onValueChange={(value) =>
              setDatePosted(value === "any" ? null : (value as DatePosted))
            }
          >
            {DATE_OPTIONS.map((option) => (
              <div
                key={option.value ?? "any"}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted"
              >
                <RadioGroupItem
                  value={option.value ?? "any"}
                  id={`date-${option.value ?? "any"}`}
                />
                <Label
                  htmlFor={`date-${option.value ?? "any"}`}
                  className="text-sm cursor-pointer flex-1"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </PopoverContent>
      </Popover>

      {/* Status Filter */}
      <Popover
        open={openPopover === "status"}
        onOpenChange={(open) => setOpenPopover(open ? "status" : null)}
      >
        <PopoverTrigger asChild>
          <Button
            variant={filters.statuses.length > 0 ? "default" : "outline"}
            size="sm"
            className="gap-2"
          >
            Status
            {filters.statuses.length > 0 && (
              <Badge
                variant="secondary"
                className="bg-primary-foreground text-primary px-1.5 py-0"
              >
                {filters.statuses.length}
              </Badge>
            )}
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                openPopover === "status" ? "rotate-180" : ""
              }`}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-44 p-2" align="start">
          <div className="space-y-1">
            {STATUS_OPTIONS.map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-muted"
              >
                <Checkbox
                  checked={filters.statuses.includes(option.value)}
                  onCheckedChange={() => toggleStatus(option.value)}
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-muted-foreground"
        >
          <X className="h-4 w-4" />
          Clear all
        </Button>
      )}
    </div>
  );
}
