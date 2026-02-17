import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Evaluation, Job } from "@/types/database";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { JobActions } from "./JobActions";
import { CompanyLogo } from "@/components/CompanyLogo";

interface JobDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch evaluation
  const { data: evaluation, error } = await supabase
    .from("evaluations")
    .select("*")
    .eq("uuid_evaluation", id)
    .eq("user_id", user.id)
    .single();

  if (error || !evaluation) {
    notFound();
  }

  // Fetch job by fingerprint
  const { data: job } = await supabase
    .from("jobs")
    .select("*")
    .eq("fingerprint_job", evaluation.fingerprint_job)
    .single();

  if (!job) {
    notFound();
  }

  // Mark as viewed if currently "new"
  if (evaluation.status === "new") {
    await supabase
      .from("evaluations")
      .update({ status: "viewed" })
      .eq("uuid_evaluation", id);
  }

  // Format salary range
  const formatSalary = () => {
    if (!job.ai_salary_min && !job.ai_salary_max) return null;
    const currency = job.ai_salary_currency || "USD";
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    });
    if (job.ai_salary_min && job.ai_salary_max) {
      return `${formatter.format(job.ai_salary_min)} - ${formatter.format(job.ai_salary_max)}`;
    }
    if (job.ai_salary_min) {
      return `From ${formatter.format(job.ai_salary_min)}`;
    }
    return `Up to ${formatter.format(job.ai_salary_max!)}`;
  };

  const salary = formatSalary();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Navigation */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header Card */}
          <Card>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <CompanyLogo
                  logoUrl={job.company_logo_url}
                  companyName={job.company}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-semibold text-slate-900">
                    {job.title}
                  </h1>
                  <p className="mt-1 text-lg text-slate-600">{job.company}</p>

                {/* Meta info */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {job.location}
                    </span>
                  )}
                  {job.remote_type && job.remote_type !== "onsite" && (
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-xs font-medium">
                      {job.remote_type}
                    </span>
                  )}
                  {job.employment_type && (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {job.employment_type}
                    </span>
                  )}
                  {job.seniority_level && (
                    <span className="flex items-center gap-1.5">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      {job.seniority_level}
                    </span>
                  )}
                </div>

                {salary && (
                  <div className="mt-3 text-base font-medium text-slate-900">
                    {salary}
                  </div>
                )}
                </div>
              </div>

              {/* Score Badge */}
              <div className="flex-shrink-0">
                <ScoreBadge score={evaluation.score_total} size="lg" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <JobActions
                evaluationId={evaluation.uuid_evaluation}
                status={evaluation.status}
                applyUrl={job.apply_url || job.url}
              />
            </div>
          </Card>

          {/* Job Description Card */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Job Description
            </h2>
            {job.description ? (
              <div className="prose prose-slate prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-slate-600 leading-relaxed">
                  {job.description}
                </div>
              </div>
            ) : (
              <p className="text-slate-500 italic">
                No description available.
              </p>
            )}
          </Card>

          {/* AI Match Breakdown - Mobile Only */}
          <div className="lg:hidden">
            <ScoreBreakdown evaluation={evaluation} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Match Breakdown - Desktop */}
          <div className="hidden lg:block">
            <ScoreBreakdown evaluation={evaluation} />
          </div>

          {/* Company Info */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Company Info
            </h2>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <CompanyLogo
                logoUrl={job.company_logo_url}
                companyName={job.company}
                size="md"
              />
              <div>
                <div className="text-sm font-medium text-slate-900">
                  {job.company}
                </div>
                {job.company_industry && (
                  <div className="text-xs text-slate-500">
                    {job.company_industry}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {job.company_size && (
                <div>
                  <dt className="text-sm text-slate-500">Company Size</dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {job.company_size}
                  </dd>
                </div>
              )}
              {job.company_website && (
                <div>
                  <dt className="text-sm text-slate-500">Website</dt>
                  <dd>
                    <a
                      href={job.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {job.company_website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              )}
            </div>
          </Card>

          {/* Posted Info */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Details
            </h2>
            <div className="space-y-3">
              {job.posted_at && (
                <div>
                  <dt className="text-sm text-slate-500">Posted</dt>
                  <dd className="text-sm font-medium text-slate-900">
                    {new Date(job.posted_at).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              )}
              {job.source && (
                <div>
                  <dt className="text-sm text-slate-500">Source</dt>
                  <dd className="text-sm font-medium text-slate-900 capitalize">
                    {job.source}
                  </dd>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Score Badge Component
function ScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "md" | "lg";
}) {
  const percentage = Math.round(score * 10);

  let colorClasses: string;
  if (score >= 9) {
    colorClasses = "bg-green-100 text-green-800 border-green-200";
  } else if (score >= 8) {
    colorClasses = "bg-blue-100 text-blue-800 border-blue-200";
  } else if (score >= 7) {
    colorClasses = "bg-sky-100 text-sky-800 border-sky-200";
  } else if (score >= 6) {
    colorClasses = "bg-amber-100 text-amber-800 border-amber-200";
  } else {
    colorClasses = "bg-slate-100 text-slate-700 border-slate-200";
  }

  const sizeClasses =
    size === "lg"
      ? "px-4 py-2 text-2xl"
      : "px-2.5 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border ${colorClasses} ${sizeClasses}`}
    >
      {percentage}%
    </span>
  );
}
