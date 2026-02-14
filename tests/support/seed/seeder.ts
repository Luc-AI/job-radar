/**
 * Test Data Seeder
 *
 * Creates jobs and evaluations in the database for E2E tests.
 * Uses service role client to bypass RLS.
 */
import { faker } from "@faker-js/faker";
import { getSeedClient } from "./seed-client";
import {
  SEED_JOBS,
  SEED_FINGERPRINT_PREFIX,
  generateSeedFingerprint,
} from "./seed-data";
import type { Job, Evaluation } from "../../../src/types/database";

export interface SeedResult {
  jobsCreated: number;
  evaluationsCreated: number;
  errors: string[];
}

/**
 * Seeds test data for the specified user.
 * Cleans up existing test data first, then inserts fresh data.
 */
export async function seedTestData(userId: string): Promise<SeedResult> {
  const client = getSeedClient();
  const result: SeedResult = {
    jobsCreated: 0,
    evaluationsCreated: 0,
    errors: [],
  };

  // Clean up existing test data first
  await cleanupTestData(userId);

  for (let i = 0; i < SEED_JOBS.length; i++) {
    const config = SEED_JOBS[i];
    const fingerprint = generateSeedFingerprint(i);

    try {
      // Create job data
      const job: Job = {
        uuid_job: faker.string.uuid(),
        fingerprint_job: fingerprint,
        title: config.title,
        company: config.company,
        location: config.remote_type === "Remote" ? "Remote" : `${faker.location.city()}, USA`,
        description: `Join ${config.company} as a ${config.title}. ${faker.lorem.paragraphs(2)}`,
        url: `https://careers.${config.company.toLowerCase().replace(/\s+/g, "")}.com/jobs/${fingerprint}`,
        apply_url: `https://careers.${config.company.toLowerCase().replace(/\s+/g, "")}.com/apply/${fingerprint}`,
        employment_type: "Full-time",
        seniority_level: config.seniority || "Mid-Senior level",
        remote_type: config.remote_type || "Remote",
        ai_salary_min: config.salary_min || 100000,
        ai_salary_max: config.salary_max || 150000,
        ai_salary_currency: "USD",
        company_industry: "Technology",
        company_size: faker.helpers.arrayElement(["51-200", "201-500", "501-1000"]),
        company_website: `https://${config.company.toLowerCase().replace(/\s+/g, "")}.com`,
        company_logo_url: `https://logo.clearbit.com/${config.company.toLowerCase().replace(/\s+/g, "")}.com`,
        source: faker.helpers.arrayElement(["LinkedIn", "Indeed"]),
        posted_at: faker.date.recent({ days: 14 }).toISOString(),
        scraped_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        uuid_user: null,
        time_bucket: null,
        "external ID": faker.number.int({ min: 10000, max: 99999 }),
      };

      // Insert job
      const { error: jobError } = await client
        .from("jobs")
        .upsert(job, { onConflict: "fingerprint_job" });

      if (jobError) {
        result.errors.push(`Job ${i} (${config.title}): ${jobError.message}`);
        continue;
      }
      result.jobsCreated++;

      // Calculate component scores (database uses 1-10 scale)
      const baseScore = config.score / 10; // Convert 0-100 to 1-10 scale
      const variance = 0.5;

      const evaluation: Evaluation = {
        uuid_evaluation: faker.string.uuid(),
        user_id: userId,
        fingerprint_job: fingerprint,
        score_total: baseScore, // 1-10 scale
        score_role: Math.min(10, Math.max(1, baseScore + faker.number.float({ min: -variance, max: variance }))),
        score_company: Math.min(10, Math.max(1, baseScore + faker.number.float({ min: -variance, max: variance }))),
        score_location: Math.min(10, Math.max(1, baseScore + faker.number.float({ min: -variance, max: variance }))),
        score_industry: Math.min(10, Math.max(1, baseScore + faker.number.float({ min: -variance, max: variance }))),
        score_growth: Math.min(10, Math.max(1, baseScore + faker.number.float({ min: -variance, max: variance }))),
        reason_overall: generateReason("overall", config.title, config.company, config.score),
        reason_role: generateReason("role", config.title, config.company, config.score),
        reason_company: generateReason("company", config.title, config.company, config.score),
        reason_location: generateReason("location", config.title, config.company, config.score),
        reason_industry: generateReason("industry", config.title, config.company, config.score),
        reason_growth: generateReason("growth", config.title, config.company, config.score),
        status: config.status,
        evaluated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Insert evaluation
      const { error: evalError } = await client
        .from("evaluations")
        .upsert(evaluation, { onConflict: "uuid_evaluation" });

      if (evalError) {
        result.errors.push(`Evaluation ${i} (${config.title}): ${evalError.message}`);
        continue;
      }
      result.evaluationsCreated++;
    } catch (err) {
      result.errors.push(`Seed ${i}: ${String(err)}`);
    }
  }

  return result;
}

/**
 * Removes all test-seeded data for the user.
 */
export async function cleanupTestData(userId: string): Promise<void> {
  const client = getSeedClient();

  // Delete evaluations for test user with test fingerprints
  const { error: evalError } = await client
    .from("evaluations")
    .delete()
    .eq("user_id", userId)
    .like("fingerprint_job", `${SEED_FINGERPRINT_PREFIX}%`);

  if (evalError) {
    console.warn(`Cleanup evaluations warning: ${evalError.message}`);
  }

  // Delete test jobs (they may be used by other users, so be careful)
  const { error: jobError } = await client
    .from("jobs")
    .delete()
    .like("fingerprint_job", `${SEED_FINGERPRINT_PREFIX}%`);

  if (jobError) {
    console.warn(`Cleanup jobs warning: ${jobError.message}`);
  }
}

/**
 * Ensures the user profile exists in the users table.
 * Creates with default preferences if missing.
 */
export async function ensureUserProfile(
  userId: string,
  email: string
): Promise<void> {
  const client = getSeedClient();

  const { error } = await client.from("users").upsert(
    {
      id: userId,
      email: email,
      onboarding_completed: true,
      is_active: true,
      pref_roles: ["Software Engineer", "Backend Developer", "Full Stack Developer"],
      pref_locations: ["San Francisco", "New York", "Remote"],
      pref_industries: ["Technology", "Software", "SaaS"],
      pref_excluded_companies: [],
      pref_remote: true,
      notify_enabled: true,
      notify_threshold: 7.0,
      notify_frequency: "daily",
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(`Failed to ensure user profile: ${error.message}`);
  }
}

/**
 * Generates realistic AI reasoning text.
 */
function generateReason(
  dimension: string,
  title: string,
  company: string,
  score: number
): string {
  const quality = score >= 90 ? "excellent" : score >= 80 ? "strong" : score >= 70 ? "good" : "moderate";

  const reasons: Record<string, string[]> = {
    overall: [
      `This ${title} role at ${company} shows ${quality} alignment with your profile.`,
      `The position offers ${quality} match across multiple dimensions.`,
    ],
    role: [
      `Your experience directly matches the ${title} requirements.`,
      `The role responsibilities align well with your background.`,
    ],
    company: [
      `${company} has a ${quality} reputation in the industry.`,
      `The company culture appears to match your preferences.`,
    ],
    location: [
      `The location/remote options fit your preferences well.`,
      `Work arrangement offers the flexibility you're looking for.`,
    ],
    industry: [
      `The industry sector aligns with your career interests.`,
      `Strong industry match based on your stated preferences.`,
    ],
    growth: [
      `${quality} growth potential based on company trajectory.`,
      `Career advancement opportunities appear promising.`,
    ],
  };

  const options = reasons[dimension] || reasons.overall;
  return faker.helpers.arrayElement(options);
}
