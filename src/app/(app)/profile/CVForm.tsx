"use client";

import { useActionState, useState, useCallback, useEffect, useRef } from "react";
import { Loader } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileUpload } from "@/components/ui/FileUpload";
import { updateCV, CVState } from "./actions";

interface CVFormProps {
  initialCvRaw: string | null;
  lastUpdated: string | null;
}

const initialState: CVState = {};

export function CVForm({ initialCvRaw, lastUpdated }: CVFormProps) {
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
      toast.success("CV updated successfully");
      setFileName(undefined);
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

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
      <CardHeader>
        <CardTitle>CV / Resume</CardTitle>
        <CardDescription>
          {initialCvRaw ? formatLastUpdated(lastUpdated) : "Upload your CV to improve job matching."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        {state.error && (
          <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-destructive">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="cvRaw" value={cvText} />

          {/* Current CV preview (if exists and not editing) */}
          {initialCvRaw && !isExpanded && !hasChanges && (
            <div className="p-4 bg-muted rounded-lg border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap break-words">
                    {getPreviewText(initialCvRaw)}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
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
                <Label className="mb-2 block">Upload a new file</Label>
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
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-3 text-muted-foreground">
                    or edit text directly
                  </span>
                </div>
              </div>

              {/* Text edit area */}
              <div>
                <Label htmlFor="cv-text-edit" className="mb-2 block">
                  CV content
                </Label>
                <Textarea
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
                  className="font-mono text-sm resize-none"
                />
                {cvText.length > 0 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {cvText.length.toLocaleString()} characters
                  </p>
                )}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            {hasChanges && (
              <Button
                type="button"
                variant="outline"
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
              disabled={!hasContent || isUploading || !hasChanges || pending}
            >
              {pending ? (
                <>
                  <Loader className="animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
