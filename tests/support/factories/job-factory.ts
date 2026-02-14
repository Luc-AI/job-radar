/**
 * Job Factory for job-radar tests
 *
 * Creates test job data with sensible defaults and explicit overrides.
 * Uses faker for dynamic values to prevent collisions in parallel tests.
 *
 * Usage:
 *   const job = createJob(); // Default job
 *   const remoteJob = createJob({ remote_type: 'Remote' }); // With overrides
 */
import { faker } from "@faker-js/faker";
import type { Job } from "@/types/database";

/**
 * Creates a test job with factory defaults
 * @param overrides - Partial job data to override defaults
 * @returns Complete Job object
 */
export function createJob(overrides: Partial<Job> = {}): Job {
  const companyName = faker.company.name();
  const postedDate = faker.date.recent({ days: 30 });

  return {
    uuid_job: faker.string.uuid(),
    fingerprint_job: faker.string.alphanumeric(32),
    title: faker.person.jobTitle(),
    company: companyName,
    location: `${faker.location.city()}, ${faker.location.country()}`,
    description: faker.lorem.paragraphs(3),
    url: faker.internet.url(),
    apply_url: faker.internet.url(),
    employment_type: faker.helpers.arrayElement([
      "Full-time",
      "Part-time",
      "Contract",
    ]),
    seniority_level: faker.helpers.arrayElement([
      "Entry level",
      "Mid-Senior level",
      "Senior level",
      "Director",
    ]),
    remote_type: faker.helpers.arrayElement(["Remote", "Hybrid", "On-site"]),
    ai_salary_min: faker.number.int({ min: 50000, max: 100000 }),
    ai_salary_max: faker.number.int({ min: 100000, max: 200000 }),
    ai_salary_currency: "USD",
    company_industry: faker.company.buzzNoun(),
    company_size: faker.helpers.arrayElement([
      "1-10",
      "11-50",
      "51-200",
      "201-500",
      "501-1000",
      "1001-5000",
      "5001+",
    ]),
    company_website: `https://${faker.internet.domainName()}`,
    company_logo_url: faker.image.url(),
    source: faker.helpers.arrayElement(["LinkedIn", "Indeed", "Glassdoor"]),
    posted_at: postedDate.toISOString(),
    scraped_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    uuid_user: null,
    time_bucket: null,
    "external ID": faker.number.int({ min: 1000, max: 9999 }),
    ...overrides,
  };
}

/**
 * Creates a remote job
 */
export function createRemoteJob(overrides: Partial<Job> = {}): Job {
  return createJob({
    remote_type: "Remote",
    location: "Remote",
    ...overrides,
  });
}

/**
 * Creates a recent job (posted today)
 */
export function createRecentJob(overrides: Partial<Job> = {}): Job {
  return createJob({
    posted_at: new Date().toISOString(),
    ...overrides,
  });
}

/**
 * Creates a high-salary job
 */
export function createHighSalaryJob(overrides: Partial<Job> = {}): Job {
  return createJob({
    ai_salary_min: 150000,
    ai_salary_max: 250000,
    ai_salary_currency: "USD",
    ...overrides,
  });
}

// Re-export type for convenience
export type { Job };
