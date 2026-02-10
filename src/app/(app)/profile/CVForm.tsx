"use client";

import { useActionState, useState, useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import { useToast } from "@/components/ui/Toast";
import { updateCV, CVState } from "./actions";

interface CVFormProps {
  initialCvRaw: string | null;
  lastUpdated: string | null;
}

const initialState: CVState = {};

export function CVForm({ initialCvRaw, lastUpdated }: CVFormProps) {
  const { showToast } = useToast();

  // Form state
  const [cvText, setCvText] = useState(initialCvRaw || "");
  const [fileName, setFileName] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Action state
  const [state, formAction, pending] = useActionState(updateCV, initialState);

  // Track previous state for detecting successful submissions
  const prevStateRef = useRef(state);

  // Handle success/error toasts
  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      showToast("CV updated successfully", "success");
      setFileName(undefined);
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      showToast(state.error, "error");
    }
    prevStateRef.current = state;
  }, [state, showToast]);

  const handleFileSelect = useCallback(async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/parse-cv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        setUploadError(result.error || "Failed to parse file");
        return;
      }

      setCvText(result.text);
      setFileName(result.fileName);
    } catch {
      setUploadError("Failed to process file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, []);

  const formatLastUpdated = (dateStr: string | null): string => {
    if (!dateStr) return "Not uploaded yet";

    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Updated today";
    if (diffDays === 1) return "Updated yesterday";
    if (diffDays < 7) return `Updated ${diffDays} days ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;

    return `Updated on ${date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;
  };

  const getPreviewText = (text: string, maxLength: number = 200): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  const hasContent = cvText.trim().length > 0;
  const hasChanges = cvText !== (initialCvRaw || "");

  return (
    <Card>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">CV / Resume</h2>
        <p className="mt-1 text-sm text-slate-600">
          {initialCvRaw ? formatLastUpdated(lastUpdated) : "Upload your CV to improve job matching."}
        </p>
      </div>

      {state.error && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <input type="hidden" name="cvRaw" value={cvText} />

        {/* Current CV preview (if exists and not editing) */}
        {initialCvRaw && !isExpanded && !hasChanges && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-600 whitespace-pre-wrap break-words">
                  {getPreviewText(initialCvRaw)}
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsExpanded(true)}
              >
                Edit
              </Button>
            </div>
          </div>
        )}

        {/* Expanded edit view */}
        {(isExpanded || hasChanges || !initialCvRaw) && (
          <>
            {/* File upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Upload a new file
              </label>
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isUploading}
                error={uploadError || undefined}
                uploadedFileName={fileName}
              />
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-white text-slate-500">
                  or edit text directly
                </span>
              </div>
            </div>

            {/* Text edit area */}
            <div>
              <label
                htmlFor="cv-text-edit"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                CV content
              </label>
              <textarea
                id="cv-text-edit"
                value={cvText}
                onChange={(e) => {
                  setCvText(e.target.value);
                  if (e.target.value !== cvText) {
                    setFileName(undefined);
                  }
                }}
                placeholder="Paste or type your CV/resume text here..."
                rows={12}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400
                  focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                  resize-none font-mono text-sm"
              />
              {cvText.length > 0 && (
                <p className="mt-1 text-xs text-slate-500">
                  {cvText.length.toLocaleString()} characters
                </p>
              )}
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
          {hasChanges && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setCvText(initialCvRaw || "");
                setFileName(undefined);
                setIsExpanded(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            isLoading={pending}
            disabled={!hasContent || isUploading || !hasChanges}
          >
            Save
          </Button>
        </div>
      </form>
    </Card>
  );
}
