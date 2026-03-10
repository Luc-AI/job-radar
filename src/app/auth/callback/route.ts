import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Allowlist of valid post-auth redirect destinations
const ALLOWED_NEXT_PATHS = ["/reset-password", "/dashboard", "/onboarding/step-1"];

function getSafeRedirectPath(next: string | null): string {
  if (!next) return "/onboarding/step-1";
  // Must start with / and not contain a protocol or double-slash (open redirect guard)
  if (!next.startsWith("/") || next.startsWith("//") || next.includes(":")) {
    return "/onboarding/step-1";
  }
  // Only allow known destinations
  const isAllowed = ALLOWED_NEXT_PATHS.some((p) => next === p || next.startsWith(`${p}?`));
  return isAllowed ? next : "/onboarding/step-1";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // Use NEXT_PUBLIC_SITE_URL env var for the canonical origin, never trust x-forwarded-host
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const requestUrl = new URL(request.url);
  const origin = siteUrl || `${requestUrl.protocol}//${requestUrl.host}`;
  const code = searchParams.get("code");
  const next = getSafeRedirectPath(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // If a specific next path is requested (e.g., password reset), use it directly
      if (next && next !== "/onboarding/step-1") {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // Check if user has completed onboarding
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: userData } = await supabase
          .from("users")
          .select("onboarding_completed")
          .eq("id", user.id)
          .single();

        // Redirect based on onboarding status
        if (userData?.onboarding_completed) {
          return NextResponse.redirect(`${origin}/dashboard`);
        }
      }

      // New user or onboarding not completed - go to onboarding
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Auth code exchange failed - redirect to error page or login
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}
