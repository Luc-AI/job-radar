// Database types for Job Radar

export type EvaluationStatus = 'new' | 'viewed' | 'saved' | 'applied' | 'hidden';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string | null;
  url: string | null;
  apply_url: string | null;
  employment_type: string | null;
  seniority_level: string | null;
  remote_type: string | null;
  ai_salary_min: number | null;
  ai_salary_max: number | null;
  ai_salary_currency: string | null;
  company_industry: string | null;
  company_size: string | null;
  company_website: string | null;
  company_logo_url: string | null;
  source: string | null;
  external_id: string | null;
  posted_at: string | null;
  scraped_at: string;
  created_at: string;
  updated_at: string;
}

export interface Evaluation {
  id: string;
  user_id: string;
  job_id: string;
  score_total: number;
  score_role: number | null;
  score_company: number | null;
  score_location: number | null;
  score_industry: number | null;
  score_growth: number | null;
  reason_overall: string | null;
  reason_role: string | null;
  reason_company: string | null;
  reason_location: string | null;
  reason_industry: string | null;
  reason_growth: string | null;
  status: EvaluationStatus;
  evaluated_at: string;
  created_at: string;
  updated_at: string;
}

// Combined type for job card display (evaluation joined with job)
export interface JobWithEvaluation extends Evaluation {
  job: Job;
}

// Filter types for job dashboard
export type ScoreRange = '90+' | '80-89' | '70-79' | 'below70';
export type DatePosted = 'today' | '7days' | '30days';

export interface JobFilters {
  scoreRanges: ScoreRange[];
  datePosted: DatePosted | null;
  statuses: EvaluationStatus[];
}

// Sort types for job dashboard
export type SortOption = 'score_desc' | 'date_desc' | 'date_asc';
