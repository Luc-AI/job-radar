/**
 * User Factory for job-radar tests
 *
 * Creates test user data with sensible defaults and explicit overrides.
 * Uses faker for dynamic values to prevent collisions in parallel tests.
 *
 * Usage:
 *   const user = createUser(); // Default user
 *   const admin = createUser({ pref_roles: ['Admin'] }); // With overrides
 */
import { faker } from "@faker-js/faker";

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  pref_roles: string[];
  pref_locations: string[];
  pref_industries: string[];
  pref_excluded_industries: string[];
  pref_remote: string | null;
  cv_raw: string | null;
  career_aspirations: string | null;
  onboarding_completed: boolean;
  notify_enabled: boolean;
  notify_time: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Creates a test user with factory defaults
 * @param overrides - Partial user data to override defaults
 * @returns Complete User object
 */
export function createUser(overrides: Partial<User> = {}): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email().toLowerCase(),
    full_name: faker.person.fullName(),
    pref_roles: [faker.person.jobTitle(), faker.person.jobTitle()],
    pref_locations: [faker.location.city(), faker.location.city()],
    pref_industries: [faker.company.buzzNoun(), faker.company.buzzNoun()],
    pref_excluded_industries: [],
    pref_remote: faker.helpers.arrayElement(["remote", "hybrid", "onsite"]),
    cv_raw: null,
    career_aspirations: faker.lorem.paragraph(),
    onboarding_completed: true,
    notify_enabled: true,
    notify_time: "09:00",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Creates a user who hasn't completed onboarding
 */
export function createNewUser(overrides: Partial<User> = {}): User {
  return createUser({
    onboarding_completed: false,
    pref_roles: [],
    pref_locations: [],
    pref_industries: [],
    career_aspirations: null,
    ...overrides,
  });
}

/**
 * Creates a user with CV data
 */
export function createUserWithCV(overrides: Partial<User> = {}): User {
  return createUser({
    cv_raw: faker.lorem.paragraphs(3),
    ...overrides,
  });
}
