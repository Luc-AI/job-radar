import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function OnboardingStep1Page() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Step 1 of 3</span>
          <span>Job Preferences</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all"
            style={{ width: "33%" }}
          />
        </div>
      </div>

      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            What jobs are you looking for?
          </h1>
          <p className="mt-2 text-slate-600">
            Tell us about your ideal role so we can find the best matches.
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
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <p className="text-slate-600 max-w-sm mx-auto">
            This step will be implemented in Story 1.3. For now, you can
            complete onboarding by clicking below.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Link href="/onboarding/complete">
            <Button size="lg">Skip to Complete</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
