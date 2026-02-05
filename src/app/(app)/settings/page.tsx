import { Card } from "@/components/ui/Card";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">
          Notification Settings
        </h1>
        <p className="mt-1 text-slate-600">
          Control when and how you receive job alerts
        </p>
      </div>

      <Card>
        <div className="text-center py-12">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-slate-900">
            Notification Preferences
          </h2>
          <p className="mt-2 text-slate-600 max-w-sm mx-auto">
            This page will be implemented in Epic 3 (Story 3.4).
          </p>
        </div>
      </Card>
    </div>
  );
}
