import { mockJobs } from "@/lib/mock-data";
import { JobDashboard } from "@/components/job-dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Job Radar
          </h1>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {mockJobs.length} jobs tracked
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <JobDashboard jobs={mockJobs} />
      </main>
    </div>
  );
}
