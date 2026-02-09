"use server";

import { createClient } from "@/lib/supabase/server";
import { EvaluationStatus } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function updateJobStatus(
  evaluationId: string,
  status: EvaluationStatus
): Promise<{ success: boolean; error?: string }> {
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
    .eq("id", evaluationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error updating job status:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath(`/jobs/${evaluationId}`);

  return { success: true };
}
