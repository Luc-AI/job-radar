"use client";

import { useActionState, useState } from "react";
import { Loader, Upload, FileText } from "react-feather";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUpload } from "@/components/ui/FileUpload";
import Link from "next/link";
import { saveOnboardingCv, CvState } from "../actions";
import { cn } from "@/lib/utils";

type Tab = "file" | "paste";

interface CvStepFormProps {
  initialCvText: string;
}

const initialState: CvState = {};

export function CvStepForm({ initialCvText }: CvStepFormProps) {
  const [activeTab, setActiveTab] = useState<Tab>("file");
  const [cvText, setCvText] = useState(initialCvText);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(saveOnboardingCv, initialState);

  const wordCount = cvText.trim() ? cvText.trim().split(/\s+/).length : 0;

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
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>Schritt 3 von 4</span>
          <span>Lebenslauf (optional)</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: "75%" }}
          />
        </div>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Lebenslauf hochladen</CardTitle>
          <CardDescription>
            Dein CV hilft dem KI-Matching, dein Profil besser zu verstehen. Du kannst diesen Schritt auch überspringen.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {state.error && (
            <div className="mb-6 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{state.error}</p>
            </div>
          )}

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
              Text einfügen
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
                    <p className="text-sm font-medium text-muted-foreground">Extrahierter Text (zur Kontrolle):</p>
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
                  placeholder="Füge deinen Lebenslauf hier ein..."
                  rows={12}
                  className="resize-none text-sm"
                />
                <p className="text-xs text-muted-foreground text-right">{wordCount} Wörter</p>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Link href="/onboarding/step-2">
                <Button type="button" variant="outline" size="lg">
                  Zurück
                </Button>
              </Link>
              <div className="flex gap-3">
                <Link href="/onboarding/step-3">
                  <Button type="button" variant="ghost" size="lg">
                    Überspringen
                  </Button>
                </Link>
                <Button
                  type="submit"
                  size="lg"
                  disabled={pending || isExtracting || !cvText.trim()}
                >
                  {pending ? (
                    <>
                      <Loader className="animate-spin" />
                      Speichern...
                    </>
                  ) : (
                    "Weiter"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
