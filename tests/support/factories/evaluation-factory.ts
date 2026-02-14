/**
 * Evaluation Factory for job-radar tests
 *
 * Creates test evaluation data with sensible defaults and explicit overrides.
 * Uses faker for dynamic values to prevent collisions in parallel tests.
 *
 * Usage:
 *   const evaluation = createEvaluation(); // Default evaluation
 *   const highScore = createEvaluation({ score_total: 95 }); // With overrides
 */
import { faker } from "@faker-js/faker";
import type { Evaluation, EvaluationStatus } from "@/types/database";

/**
 * Creates a test evaluation with factory defaults
 * @param overrides - Partial evaluation data to override defaults
 * @returns Complete Evaluation object
 */
export function createEvaluation(
  overrides: Partial<Evaluation> = {}
): Evaluation {
  const score_role = faker.number.float({ min: 5, max: 10, fractionDigits: 1 });
  const score_company = faker.number.float({
    min: 5,
    max: 10,
    fractionDigits: 1,
  });
  const score_location = faker.number.float({
    min: 5,
    max: 10,
    fractionDigits: 1,
  });
  const score_industry = faker.number.float({
    min: 5,
    max: 10,
    fractionDigits: 1,
  });
  const score_growth = faker.number.float({
    min: 5,
    max: 10,
    fractionDigits: 1,
  });

  // Calculate weighted total (simplified)
  const score_total = Math.round(
    (score_role * 0.3 +
      score_company * 0.2 +
      score_location * 0.2 +
      score_industry * 0.15 +
      score_growth * 0.15) *
      10
  );

  return {
    uuid_evaluation: faker.string.uuid(),
    user_id: faker.string.uuid(),
    fingerprint_job: faker.string.alphanumeric(32),
    score_total,
    score_role,
    score_company,
    score_location,
    score_industry,
    score_growth,
    reason_overall: faker.lorem.sentence(),
    reason_role: faker.lorem.sentence(),
    reason_company: faker.lorem.sentence(),
    reason_location: faker.lorem.sentence(),
    reason_industry: faker.lorem.sentence(),
    reason_growth: faker.lorem.sentence(),
    status: "new" as EvaluationStatus,
    evaluated_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}

/**
 * Creates a high-scoring evaluation (90+)
 */
export function createHighScoreEvaluation(
  overrides: Partial<Evaluation> = {}
): Evaluation {
  return createEvaluation({
    score_total: faker.number.int({ min: 90, max: 100 }),
    score_role: faker.number.float({ min: 9, max: 10, fractionDigits: 1 }),
    score_company: faker.number.float({ min: 9, max: 10, fractionDigits: 1 }),
    score_location: faker.number.float({ min: 9, max: 10, fractionDigits: 1 }),
    score_industry: faker.number.float({ min: 9, max: 10, fractionDigits: 1 }),
    score_growth: faker.number.float({ min: 9, max: 10, fractionDigits: 1 }),
    ...overrides,
  });
}

/**
 * Creates a saved evaluation
 */
export function createSavedEvaluation(
  overrides: Partial<Evaluation> = {}
): Evaluation {
  return createEvaluation({
    status: "saved",
    ...overrides,
  });
}

/**
 * Creates an applied evaluation
 */
export function createAppliedEvaluation(
  overrides: Partial<Evaluation> = {}
): Evaluation {
  return createEvaluation({
    status: "applied",
    ...overrides,
  });
}

/**
 * Creates a hidden evaluation
 */
export function createHiddenEvaluation(
  overrides: Partial<Evaluation> = {}
): Evaluation {
  return createEvaluation({
    status: "hidden",
    ...overrides,
  });
}

// Re-export type for convenience
export type { Evaluation };
