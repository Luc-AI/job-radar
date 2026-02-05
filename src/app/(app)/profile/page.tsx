import { Card } from "@/components/ui/Card";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-slate-600">
          Manage your job preferences and CV
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-medium text-slate-900">
            Profile Management
          </h2>
          <p className="mt-2 text-slate-600 max-w-sm mx-auto">
            This page will be implemented in Epic 3 (Story 3.1-3.3).
          </p>
        </div>
      </Card>
    </div>
  );
}
