"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { Loader, Upload, FileText } from "react-feather";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import { updateCV, CvState } from "./actions";
import { cn } from "@/lib/utils";

type Tab = "file" | "paste";

interface CvFormProps {
  initialCvText: string;
}

const initialState: CvState = {};

export function CvForm({ initialCvText }: CvFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialCvText ? "paste" : "file");
  const [cvText, setCvText] = useState(initialCvText);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(updateCV, initialState);
  const prevStateRef = useRef(state);

  const wordCount = cvText.trim() ? cvText.trim().split(/\s+/).length : 0;
  const hasChanges = cvText !== initialCvText;

  useEffect(() => {
    if (state.success && !prevStateRef.current.success) {
      toast.success("Lebenslauf gespeichert");
    }
    if (state.error && state.error !== prevStateRef.current.error) {
      toast.error(state.error);
    }
    prevStateRef.current = state;
  }, [state]);

  async function handleFileSelect(file: File) {
    setIsExtracting(true);
    setExtractError(null);
    setUploadedFileName(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        setExtractError(data.error ?? "Fehler beim Verarbeiten der Datei.");
        return;
      }

      setCvText(data.text ?? "");
      setUploadedFileName(data.fileName ?? file.name);
    } catch {
      setExtractError("Verbindungsfehler. Bitte erneut versuchen.");
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lebenslauf</CardTitle>
        <CardDescription>
          Dein CV wird für das KI-Matching verwendet. Je vollständiger, desto besser die Ergebnisse.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* Tab switcher */}
        <div className="flex rounded-lg border p-1 mb-6 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("file")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeTab === "file"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Upload className="size-4" />
            Datei hochladen
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("paste")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activeTab === "paste"
                ? "bg-background shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="size-4" />
            Text bearbeiten
          </button>
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="cvText" value={cvText} />

          {activeTab === "file" && (
            <div className="space-y-4">
              <FileUpload
                onFileSelect={handleFileSelect}
                isLoading={isExtracting}
                error={extractError ?? undefined}
                uploadedFileName={uploadedFileName ?? undefined}
              />
              {cvText && !isExtracting && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Extrahierter Text (bearbeitbar):</p>
                  <Textarea
                    value={cvText}
                    onChange={(e) => setCvText(e.target.value)}
                    rows={8}
                    className="resize-none text-sm font-mono"
                  />
                  <p className="text-xs text-muted-foreground text-right">{wordCount} Wörter</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "paste" && (
            <div className="space-y-2">
              <Textarea
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                placeholder="Füge deinen Lebenslauf hier ein oder bearbeite den gespeicherten Text..."
                rows={12}
                className="resize-none text-sm"
              />
              <p className="text-xs text-muted-foreground text-right">{wordCount} Wörter</p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {hasChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCvText(initialCvText);
                  setUploadedFileName(null);
                  setExtractError(null);
                }}
              >
                Abbrechen
              </Button>
            )}
            <Button
              type="submit"
              disabled={pending || isExtracting || !hasChanges || !cvText.trim()}
            >
              {pending ? (
                <>
                  <Loader className="animate-spin" />
                  Speichern...
                </>
              ) : (
                "Speichern"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
