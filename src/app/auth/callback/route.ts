import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const forwardedHost = request.headers.get("x-forwarded-host");
  const origin = forwardedHost
    ? `https://${forwardedHost}`
    : new URL(request.url).origin;
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/onboarding/step-1";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
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
