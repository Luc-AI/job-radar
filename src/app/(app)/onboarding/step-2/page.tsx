"use client";

import { useActionState, useState, useCallback } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileUpload } from "@/components/ui/FileUpload";
import Link from "next/link";
import { saveCV, CVUploadState } from "../actions";

const initialState: CVUploadState = {};

export default function OnboardingStep2Page() {
  const [cvText, setCvText] = useState("");
  const [fileName, setFileName] = useState<string | undefined>();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(saveCV, initialState);

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

  const hasContent = cvText.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Step 2 of 3</span>
          <span>Your CV</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all"
            style={{ width: "66%" }}
          />
        </div>
      </div>

      <Card>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Upload your CV
          </h1>
          <p className="mt-2 text-slate-600">
            Share your experience so we can match you with the right
            opportunities.
          </p>
        </div>

        {state.error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="cvRaw" value={cvText} />

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload a file
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
                or paste your CV text
              </span>
            </div>
          </div>

          {/* Text paste area */}
          <div>
            <label
              htmlFor="cv-text"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              CV content
            </label>
            <textarea
              id="cv-text"
              value={cvText}
              onChange={(e) => {
                setCvText(e.target.value);
                if (e.target.value !== cvText) {
                  setFileName(undefined);
                }
              }}
              placeholder="Paste your CV/resume text here..."
              rows={10}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                resize-none"
            />
            {cvText.length > 0 && (
              <p className="mt-1 text-xs text-slate-500">
                {cvText.length.toLocaleString()} characters
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-slate-200">
            <Link href="/onboarding/step-1">
              <Button type="button" variant="secondary" size="lg">
                Back
              </Button>
            </Link>
            <Button
              type="submit"
              size="lg"
              isLoading={pending}
              disabled={!hasContent || isUploading}
            >
              Next
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
