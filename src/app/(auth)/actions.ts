"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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
