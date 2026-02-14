/**
 * Test Seed Data Definitions
 *
 * Defines the test data to be seeded for E2E tests.
 * Uses deterministic fingerprints for idempotent seeding.
 */
import type { EvaluationStatus } from "../../../src/types/database";

export interface SeedJobConfig {
  title: string;
  company: string;
  score: number; // 0-100 scale for display
  status: EvaluationStatus;
  remote_type?: "Remote" | "Hybrid" | "On-site";
  seniority?: string;
  salary_min?: number;
  salary_max?: number;
}

/**
 * Test jobs to seed - covers all filter scenarios
 */
export const SEED_JOBS: SeedJobConfig[] = [
  // High scores (90+) - 2 jobs
  {
    title: "Senior Software Engineer",
    company: "TechCorp Inc",
    score: 95,
    status: "new",
    remote_type: "Remote",
    seniority: "Senior level",
    salary_min: 180000,
    salary_max: 220000,
  },
  {
    title: "Staff Backend Developer",
    company: "InnovateTech",
    score: 92,
    status: "new",
    remote_type: "Remote",
    seniority: "Senior level",
    salary_min: 200000,
    salary_max: 250000,
  },

  // Medium-high (80-89) - 3 jobs with different statuses
  {
    title: "Full Stack Engineer",
    company: "CloudBase Systems",
    score: 85,
    status: "saved",
    remote_type: "Hybrid",
    seniority: "Mid-Senior level",
    salary_min: 140000,
    salary_max: 180000,
  },
  {
    title: "Platform Engineer",
    company: "DataFlow Labs",
    score: 82,
    status: "viewed",
    remote_type: "Remote",
    seniority: "Mid-Senior level",
    salary_min: 130000,
    salary_max: 170000,
  },
  {
    title: "DevOps Engineer",
    company: "ScaleCo",
    score: 88,
    status: "applied",
    remote_type: "Hybrid",
    seniority: "Senior level",
    salary_min: 150000,
    salary_max: 190000,
  },

  // Medium (70-79) - 2 jobs
  {
    title: "Backend Developer",
    company: "StartupXYZ",
    score: 75,
    status: "new",
    remote_type: "On-site",
    seniority: "Mid-Senior level",
    salary_min: 100000,
    salary_max: 140000,
  },
  {
    title: "Software Developer",
    company: "MidTech Inc",
    score: 72,
    status: "new",
    remote_type: "Hybrid",
    seniority: "Entry level",
    salary_min: 80000,
    salary_max: 110000,
  },

  // Low (<70) - 2 jobs
  {
    title: "Junior Developer",
    company: "SmallCo",
    score: 65,
    status: "hidden",
    remote_type: "On-site",
    seniority: "Entry level",
    salary_min: 60000,
    salary_max: 80000,
  },
  {
    title: "Entry Level Engineer",
    company: "LearnTech",
    score: 55,
    status: "new",
    remote_type: "On-site",
    seniority: "Entry level",
    salary_min: 55000,
    salary_max: 75000,
  },

  // Remote type variations (for filter testing)
  {
    title: "Remote Senior Engineer",
    company: "DistributedCo",
    score: 90,
    status: "new",
    remote_type: "Remote",
    seniority: "Senior level",
    salary_min: 170000,
    salary_max: 210000,
  },
  {
    title: "Hybrid Tech Lead",
    company: "FlexWork Inc",
    score: 85,
    status: "new",
    remote_type: "Hybrid",
    seniority: "Director",
    salary_min: 190000,
    salary_max: 240000,
  },
  {
    title: "Onsite Developer",
    company: "OfficeCo",
    score: 78,
    status: "new",
    remote_type: "On-site",
    seniority: "Mid-Senior level",
    salary_min: 110000,
    salary_max: 150000,
  },
];

/**
 * Generates a deterministic fingerprint for seeded jobs.
 * Allows cleanup by pattern matching test-seed-* fingerprints.
 */
export function generateSeedFingerprint(index: number): string {
  return `test-seed-${String(index).padStart(3, "0")}`;
}

/**
 * Prefix used for all seeded test data.
 * Used for cleanup: DELETE WHERE fingerprint_job LIKE 'test-seed-%'
 */
export const SEED_FINGERPRINT_PREFIX = "test-seed-";
