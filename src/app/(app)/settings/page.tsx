import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotificationSettingsForm } from "./NotificationSettingsForm";
import { AccountSettingsForm } from "./AccountSettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current user notification settings
  const { data: userData, error } = await supabase
    .from("users")
    .select("email, notify_enabled, notify_frequency, notify_threshold")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
  }

  // Default values
  const email = userData?.email || user.email || "";
  const notifyEnabled = userData?.notify_enabled ?? true;
  const notifyFrequency = userData?.notify_frequency ?? "daily";
  const notifyThreshold = userData?.notify_threshold ?? 7.0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-600">
          Manage your notifications and account
        </p>
      </div>

      <div className="space-y-8">
        <NotificationSettingsForm
          email={email}
          initialNotifyEnabled={notifyEnabled}
          initialNotifyFrequency={notifyFrequency}
          initialNotifyThreshold={notifyThreshold}
        />

        <AccountSettingsForm email={email} />
      </div>
    </div>
  );
}
