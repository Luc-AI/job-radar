"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export type AuthState = {
  error?: string;
  success?: boolean;
};

export async function signup(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate inputs
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    // Handle specific error cases
    if (error.message.includes("already registered")) {
      return { error: "An account with this email already exists" };
    }
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/step-1");
}

export async function login(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Validate inputs
  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // Provide more specific error messages
    if (error.message.includes("Email not confirmed")) {
      return { error: "Please confirm your email before logging in" };
    }
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Invalid email or password" };
    }
    return { error: error.message };
  }

  // Check if user has completed onboarding
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("onboarding_completed")
      .eq("id", user.id)
      .single();

    revalidatePath("/", "layout");

    // If user record doesn't exist (migration not run), create it
    if (userError && userError.code === "PGRST116") {
      // No rows returned - user record doesn't exist, go to onboarding
      redirect("/onboarding/step-1");
    }

    if (userData?.onboarding_completed) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding/step-1");
    }
  }

  revalidatePath("/", "layout");
  redirect("/onboarding/step-1");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function forgotPassword(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get("email") as string;

  if (!email) {
    return { error: "Email is required" };
  }

  // Get origin from request headers (works in both local and production)
  const headersList = await headers();
  const host = headersList.get("x-forwarded-host") || headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });

  if (error) {
    // Don't reveal if email exists or not for security
    console.error("Password reset error:", error.message);
  }

  // Always return success to prevent email enumeration attacks
  return { success: true };
}

export async function resetPassword(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Both password fields are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters" };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    if (error.message.includes("should be different")) {
      return { error: "New password must be different from your current password" };
    }
    return { error: error.message };
  }

  // Sign out after password reset for security
  await supabase.auth.signOut();

  return { success: true };
}
