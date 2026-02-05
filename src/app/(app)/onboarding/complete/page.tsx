import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default async function OnboardingCompletePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Mark onboarding as completed
  await supabase
    .from("users")
    .update({
      onboarding_completed: true,
      is_active: true,
    })
    .eq("id", user.id);

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <div className="text-center py-8">
          {/* Success icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-semibold text-slate-900">
            You&apos;re all set!
          </h1>

          <p className="mt-4 text-slate-600 max-w-md mx-auto">
            We&apos;re on it. Our AI will start scanning for jobs that match
            your profile. Your first matches will arrive in your inbox soon.
          </p>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg max-w-sm mx-auto">
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-900">What happens next:</span>
              <br />
              We scan job boards daily and notify you when we find great matches.
            </p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button size="lg">View Dashboard</Button>
            </Link>
            <Link href="/profile">
              <Button variant="secondary" size="lg">
                Adjust Settings
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
