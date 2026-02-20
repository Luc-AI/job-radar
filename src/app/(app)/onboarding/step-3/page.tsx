"use client";

import { useActionState } from "react";
import { Loader } from "react-feather";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { saveFinalDetails, FinalDetailsState } from "../actions";

const initialState: FinalDetailsState = {};

// Generate time options for the dropdown (9 AM default)
const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i;
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return {
    value: hour,
    label: `${displayHour}:00 ${ampm}`,
  };
});

export default function OnboardingStep3Page() {
  const [state, formAction, pending] = useActionState(
    saveFinalDetails,
    initialState
  );

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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900">
            Almost there!
          </h1>
          <p className="mt-2 text-slate-600">
            Tell us what you&apos;re looking for and when you&apos;d like to
            hear from us.
          </p>
        </div>

        {state.error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        )}

        <form action={formAction} className="space-y-6">
          {/* Career aspirations */}
          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              What are you looking for in your next role?
            </label>
            <textarea
              id="summary"
              name="summary"
              placeholder="e.g., I'm looking for a leadership role at a mission-driven company where I can build products that make a difference. I value work-life balance and opportunities for growth..."
              rows={5}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                resize-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Optional, but helps our AI find better matches for you.
            </p>
          </div>

          {/* Notification time */}
          <div>
            <label
              htmlFor="notifyTime"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              When would you like to receive your daily digest?
            </label>
            <select
              id="notifyTime"
              name="notifyTime"
              defaultValue={9}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900
                focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent
                bg-white"
            >
              {timeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500">
              We&apos;ll send your matched jobs at this time each day.
            </p>
          </div>

          {/* Reassuring message */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-700 font-medium">
                  We&apos;ve got your back
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Once you click &quot;Start Matching&quot;, our AI will begin
                  scanning job boards for opportunities that match your profile.
                  You&apos;ll only hear from us when we find something worth
                  your time.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-6 border-t border-slate-200">
            <Link href="/onboarding/step-2">
              <Button type="button" variant="secondary" size="lg">
                Back
              </Button>
            </Link>
            <Button type="submit" size="lg" disabled={pending}>
              {pending ? (
                <>
                  <Loader className="animate-spin" />
                  Starting...
                </>
              ) : (
                "Start Matching"
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
