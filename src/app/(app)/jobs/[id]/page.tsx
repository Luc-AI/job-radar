import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, TrendingUp } from "react-feather";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-4 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header Card */}
          <Card className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 flex-1 min-w-0">
                <CompanyLogo
                  logoUrl={job.company_logo_url}
                  companyName={job.company}
                  size="lg"
                />
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl font-semibold text-foreground">
                    {job.title}
                  </h1>
                  <p className="mt-1 text-lg text-muted-foreground">{job.company}</p>

                {/* Meta info */}
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  {job.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </span>
                  )}
                  {job.remote_type && job.remote_type !== "onsite" && (
                    <Badge variant="secondary" className="text-xs">
                      {job.remote_type}
                    </Badge>
                  )}
                  {job.employment_type && (
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4" />
                      {job.employment_type}
                    </span>
                  )}
                  {job.seniority_level && (
                    <span className="flex items-center gap-1.5">
                      <TrendingUp className="h-4 w-4" />
                      {job.seniority_level}
                    </span>
                  )}
                </div>

                {salary && (
                  <div className="mt-3 text-base font-medium text-foreground">
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
            <div className="mt-6 pt-6 border-t border-border">
              <JobActions
                evaluationId={evaluation.uuid_evaluation}
                status={evaluation.status}
                applyUrl={job.apply_url || job.url}
              />
            </div>
          </Card>

          {/* Job Description Card */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Job Description
            </h2>
            {job.description ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {job.description}
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic">
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
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Company Info
            </h2>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
              <CompanyLogo
                logoUrl={job.company_logo_url}
                companyName={job.company}
                size="md"
              />
              <div>
                <div className="text-sm font-medium text-foreground">
                  {job.company}
                </div>
                {job.company_industry && (
                  <div className="text-xs text-muted-foreground">
                    {job.company_industry}
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-3">
              {job.company_size && (
                <div>
                  <dt className="text-sm text-muted-foreground">Company Size</dt>
                  <dd className="text-sm font-medium text-foreground">
                    {job.company_size}
                  </dd>
                </div>
              )}
              {job.company_website && (
                <div>
                  <dt className="text-sm text-muted-foreground">Website</dt>
                  <dd>
                    <a
                      href={job.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {job.company_website.replace(/^https?:\/\//, "")}
                    </a>
                  </dd>
                </div>
              )}
            </div>
          </Card>

          {/* Posted Info */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Details
            </h2>
            <div className="space-y-3">
              {job.posted_at && (
                <div>
                  <dt className="text-sm text-muted-foreground">Posted</dt>
                  <dd className="text-sm font-medium text-foreground">
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
                  <dt className="text-sm text-muted-foreground">Source</dt>
                  <dd className="text-sm font-medium text-foreground capitalize">
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
    colorClasses = "bg-muted text-muted-foreground border-border";
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
