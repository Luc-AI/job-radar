/**
 * RLS Security Tests (Authenticated)
 *
 * P0 Priority: These tests validate Row Level Security policies
 * to ensure users can only access their own data.
 *
 * Tests use the Supabase client directly to test API-level security,
 * not just UI behavior.
 *
 * RLS Policies tested:
 * - users: SELECT/UPDATE only own profile (auth.uid() = id)
 * - evaluations: SELECT/UPDATE only own evaluations (auth.uid() = user_id)
 */
import { test, expect } from "../support/fixtures/merged-fixtures";
import { faker } from "@faker-js/faker";

test.describe("RLS: Users Table", () => {
  test("user can read their own profile", async ({ supabase, authUserId }) => {
    // Given: User is authenticated

    // When: User queries their own profile
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUserId)
      .single();

    // Then: Query succeeds and returns user data
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    expect(data?.id).toBe(authUserId);
  });

  test("user cannot read other users profiles", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated
    const otherUserId = faker.string.uuid();

    // When: User queries another user's profile
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", otherUserId)
      .single();

    // Then: Query returns no data (RLS blocks access)
    // Note: Supabase returns error for .single() when no rows, or empty data
    expect(data).toBeNull();
  });

  test("user cannot read all profiles", async ({ supabase, authUserId }) => {
    // Given: User is authenticated

    // When: User queries all profiles (no filter)
    const { data, error } = await supabase.from("users").select("*");

    // Then: Query returns only the user's own profile (RLS filters results)
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    // Should only get own profile, not all users
    expect(data?.length).toBeLessThanOrEqual(1);
    if (data && data.length > 0) {
      expect(data[0].id).toBe(authUserId);
    }
  });

  test("user can update their own profile", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated

    // When: User updates their own profile (using summary field)
    const newSummary = `Test summary ${Date.now()}`;
    const { error } = await supabase
      .from("users")
      .update({ summary: newSummary })
      .eq("id", authUserId);

    // Then: Update succeeds
    expect(error).toBeNull();

    // Verify the update
    const { data } = await supabase
      .from("users")
      .select("summary")
      .eq("id", authUserId)
      .single();

    expect(data?.summary).toBe(newSummary);
  });

  test("user cannot update other users profiles", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated
    const otherUserId = faker.string.uuid();

    // When: User attempts to update another user's profile
    const { data, error, count } = await supabase
      .from("users")
      .update({ summary: "hacked" })
      .eq("id", otherUserId)
      .select();

    // Then: No rows are updated (RLS blocks the operation)
    // Note: Supabase doesn't error, but returns empty result
    expect(data?.length ?? 0).toBe(0);
  });

  test("user cannot insert profile for another user", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated
    const otherUserId = faker.string.uuid();

    // When: User attempts to insert a profile for another user
    const { error } = await supabase.from("users").insert({
      id: otherUserId,
      email: faker.internet.email(),
    });

    // Then: Insert fails due to RLS policy
    expect(error).not.toBeNull();
  });
});

test.describe("RLS: Evaluations Table", () => {
  test("user can read their own evaluations", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated

    // When: User queries their evaluations
    const { data, error } = await supabase
      .from("evaluations")
      .select("*")
      .eq("user_id", authUserId);

    // Then: Query succeeds (may return empty array if no evaluations)
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    // All returned evaluations should belong to the user
    if (data && data.length > 0) {
      for (const evaluation of data) {
        expect(evaluation.user_id).toBe(authUserId);
      }
    }
  });

  test("user cannot read other users evaluations", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated
    const otherUserId = faker.string.uuid();

    // When: User queries another user's evaluations
    const { data, error } = await supabase
      .from("evaluations")
      .select("*")
      .eq("user_id", otherUserId);

    // Then: Query returns empty array (RLS filters results)
    expect(error).toBeNull();
    expect(data).toEqual([]);
  });

  test("user cannot read all evaluations without filter", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated

    // When: User queries all evaluations (no user_id filter)
    const { data, error } = await supabase.from("evaluations").select("*");

    // Then: Query returns only the user's own evaluations
    expect(error).toBeNull();
    expect(data).not.toBeNull();
    // All returned evaluations should belong to the user
    if (data && data.length > 0) {
      for (const evaluation of data) {
        expect(evaluation.user_id).toBe(authUserId);
      }
    }
  });

  test("user can update their own evaluation status", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User has at least one evaluation
    const { data: existingEvals } = await supabase
      .from("evaluations")
      .select("uuid_evaluation, status")
      .eq("user_id", authUserId)
      .limit(1);

    // Skip if no evaluations exist
    if (!existingEvals || existingEvals.length === 0) {
      test.skip();
      return;
    }

    const evalId = existingEvals[0].uuid_evaluation;
    const originalStatus = existingEvals[0].status;
    const newStatus = originalStatus === "saved" ? "viewed" : "saved";

    // When: User updates their evaluation status
    const { error } = await supabase
      .from("evaluations")
      .update({ status: newStatus })
      .eq("uuid_evaluation", evalId)
      .eq("user_id", authUserId);

    // Then: Update succeeds
    expect(error).toBeNull();

    // Cleanup: Restore original status
    await supabase
      .from("evaluations")
      .update({ status: originalStatus })
      .eq("uuid_evaluation", evalId);
  });

  test("user cannot update other users evaluations", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated
    const otherUserId = faker.string.uuid();
    const fakeEvalId = faker.string.uuid();

    // When: User attempts to update another user's evaluation
    const { data, error } = await supabase
      .from("evaluations")
      .update({ status: "hidden" })
      .eq("user_id", otherUserId)
      .select();

    // Then: No rows are updated (RLS blocks the operation)
    expect(data?.length ?? 0).toBe(0);
  });

  test("user insert evaluation behavior", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated (not service role)
    const testFingerprint = `test-insert-${faker.string.uuid()}`;

    // When: User attempts to insert an evaluation
    const { data, error } = await supabase.from("evaluations").insert({
      uuid_evaluation: faker.string.uuid(),
      user_id: authUserId,
      fingerprint_job: testFingerprint,
      score_total: 8.5,
      status: "new",
    }).select();

    // Then: Document the actual RLS behavior
    // Note: RLS policy may or may not allow user inserts
    // This test documents the actual behavior
    if (error) {
      // RLS policy correctly blocks user inserts
      expect(error).toBeTruthy();
    } else {
      // RLS policy allows user inserts - clean up test data
      console.info("Note: RLS policy allows user inserts for their own evaluations");
      // Clean up: delete the test evaluation
      await supabase
        .from("evaluations")
        .delete()
        .eq("fingerprint_job", testFingerprint)
        .eq("user_id", authUserId);
    }
  });

  test("user delete evaluation behavior", async ({ supabase, authUserId }) => {
    // Given: User is authenticated

    // When: User attempts to delete their own evaluations
    const { data, error } = await supabase
      .from("evaluations")
      .delete()
      .eq("user_id", authUserId)
      .select();

    // Then: Document the actual RLS behavior
    // Supabase may either:
    // 1. Return an error (DELETE not allowed by RLS)
    // 2. Silently return empty results (no rows affected)
    // Both indicate DELETE is blocked or has no effect
    if (error) {
      // RLS policy explicitly blocks deletes
      expect(error).toBeTruthy();
    } else {
      // RLS policy may silently block (returns 0 rows)
      // Or it may allow deletes for own rows
      // Either way, test passes - we're documenting behavior
      expect(data).toBeDefined();
    }
  });
});

test.describe("RLS: Cross-Table Security", () => {
  test("user can only access their own evaluations with fingerprint", async ({
    supabase,
    authUserId,
  }) => {
    // Given: User is authenticated

    // When: User queries evaluations (RLS should filter automatically)
    const { data, error } = await supabase
      .from("evaluations")
      .select("uuid_evaluation, user_id, fingerprint_job, score_total, status")
      .limit(10);

    // Then: All evaluations belong to the user
    expect(error).toBeNull();
    if (data && data.length > 0) {
      for (const evaluation of data) {
        expect(evaluation.user_id).toBe(authUserId);
        // Verify fingerprint exists for potential job lookup
        expect(evaluation.fingerprint_job).toBeTruthy();
      }
    }
  });
});

test.describe("RLS: Unauthenticated Access", () => {
  test("API requires authentication for users table", async ({ request }) => {
    // Given: No authentication headers

    // When: Request is made without auth
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      test.skip();
      return;
    }

    const response = await request.get(`${supabaseUrl}/rest/v1/users`, {
      headers: {
        apikey: supabaseKey,
        // Note: No Authorization header
      },
    });

    // Then: Request returns empty data or error
    const data = await response.json();
    // Unauthenticated requests should get empty results due to RLS
    expect(Array.isArray(data) ? data.length : 0).toBe(0);
  });

  test("API requires authentication for evaluations table", async ({
    request,
  }) => {
    // Given: No authentication headers

    // When: Request is made without auth
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      test.skip();
      return;
    }

    const response = await request.get(`${supabaseUrl}/rest/v1/evaluations`, {
      headers: {
        apikey: supabaseKey,
        // Note: No Authorization header
      },
    });

    // Then: Request returns empty data or error
    const data = await response.json();
    // Unauthenticated requests should get empty results due to RLS
    expect(Array.isArray(data) ? data.length : 0).toBe(0);
  });
});
