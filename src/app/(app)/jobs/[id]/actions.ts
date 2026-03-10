"use server";

import { createClient } from "@/lib/supabase/server";
import { EvaluationStatus } from "@/types/database";
import { revalidatePath } from "next/cache";

const VALID_STATUSES: EvaluationStatus[] = ["new", "viewed", "saved", "applied", "hidden"];

export async function updateJobStatus(
  evaluationId: string,
  status: EvaluationStatus
): Promise<{ success: boolean; error?: string }> {
  // Runtime validation — TypeScript types are erased at runtime, server actions are public endpoints
  if (!VALID_STATUSES.includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Not authenticated" };
  }

  const { error } = await supabase
    .from("evaluations")
    .update({ status })
    .eq("uuid_evaluation", evaluationId)
    .eq("user_id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") console.error("Error updating job status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/jobs/${evaluationId}`);

  return { success: true };
}
