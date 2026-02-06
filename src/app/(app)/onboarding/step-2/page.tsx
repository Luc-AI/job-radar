import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function OnboardingStep2Page() {
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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Upload your CV
          </h1>
          <p className="mt-2 text-slate-600">
            Share your experience so we can match you with the right
            opportunities.
          </p>
        </div>

        <div className="py-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-slate-600 max-w-sm mx-auto">
            This step will be implemented in Story 1.4. For now, you can
            complete onboarding by clicking below.
          </p>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-200">
          <Link href="/onboarding/step-1">
            <Button variant="secondary" size="lg">
              Back
            </Button>
          </Link>
          <Link href="/onboarding/complete">
            <Button size="lg">Skip to Complete</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
