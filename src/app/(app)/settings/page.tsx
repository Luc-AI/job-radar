import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NotificationSettingsPageForm } from "./NotificationSettingsPageForm";
import { AccountSettingsForm } from "./AccountSettingsForm";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch current user settings
  const { data: userData, error } = await supabase
    .from("users")
    .select(
      "email, notify_enabled, notify_frequency, notify_threshold, notify_time, notify_days, instant_alerts_enabled, instant_alert_threshold, instant_alert_channels"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user data:", error);
  }

  const email = userData?.email || user.email || "";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900">Einstellungen</h1>
        <p className="mt-1 text-slate-600">Verwalte deine Benachrichtigungen und deinen Account</p>
      </div>

      <div className="space-y-8">
        <NotificationSettingsPageForm
          initialNotifyEnabled={userData?.notify_enabled ?? true}
          initialNotifyFrequency={userData?.notify_frequency ?? "daily"}
          initialNotifyThreshold={userData?.notify_threshold ?? 75}
          initialNotifyTime={userData?.notify_time ?? 9}
          initialNotifyDays={userData?.notify_days ?? ["mon", "tue", "wed", "thu", "fri"]}
          initialInstantEnabled={userData?.instant_alerts_enabled ?? true}
          initialInstantThreshold={userData?.instant_alert_threshold ?? 85}
          initialInstantChannels={userData?.instant_alert_channels ?? ["email"]}
        />

        <AccountSettingsForm email={email} />
      </div>
    </div>
  );
}
