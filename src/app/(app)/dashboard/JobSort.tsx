"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { SortOption } from "@/types/database";

interface JobSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "score_desc", label: "Score (high to low)" },
  { value: "date_desc", label: "Date (newest first)" },
  { value: "date_asc", label: "Date (oldest first)" },
];

export function JobSort({ value, onChange }: JobSortProps) {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="sort" className="text-sm text-muted-foreground">
        Sort by:
      </Label>
      <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
        <SelectTrigger id="sort" className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
