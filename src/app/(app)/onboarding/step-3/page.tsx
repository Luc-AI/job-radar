import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function OnboardingStep3Page() {
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Step 3 of 3</span>
          <span>Final Details</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 rounded-full transition-all"
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <Card>
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">
            Almost there!
          </h1>
          <p className="mt-2 text-slate-600">
            Tell us a bit more about what you&apos;re looking for.
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
          <p className="text-slate-600 max-w-sm mx-auto">
            This step will be implemented in Story 1.5. For now, you can
            complete onboarding by clicking below.
          </p>
        </div>

        <div className="flex justify-between pt-4 border-t border-slate-200">
          <Link href="/onboarding/step-2">
            <Button variant="secondary" size="lg">
              Back
            </Button>
          </Link>
          <Link href="/onboarding/complete">
            <Button size="lg">Complete Setup</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
