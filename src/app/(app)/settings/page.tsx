import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SearchModeCard } from "./SearchModeCard";
import { NotificationChannelsCard } from "./NotificationChannelsCard";
import { InstantAlertsCard } from "./InstantAlertsCard";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select(
      "notify_enabled, notify_frequency, notify_threshold, notify_time, notify_days, instant_alerts_enabled, instant_alert_threshold, instant_alert_channels"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching user settings:", error);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Benachrichtigungen</h1>
        <p className="mt-1 text-muted-foreground">Steuere wann und wie du über neue Matches informiert wirst.</p>
      </div>

      <div className="space-y-4">
        <SearchModeCard
          initialThreshold={userData?.notify_threshold ?? 75}
        />

        <NotificationChannelsCard
          initialEnabled={userData?.notify_enabled ?? true}
          initialFrequency={userData?.notify_frequency ?? "daily"}
          initialTime={userData?.notify_time ?? 9}
          initialDays={userData?.notify_days ?? ["mon", "tue", "wed", "thu", "fri"]}
        />

        <InstantAlertsCard
          initialEnabled={userData?.instant_alerts_enabled ?? true}
          initialThreshold={userData?.instant_alert_threshold ?? 85}
          initialChannels={userData?.instant_alert_channels ?? ["email"]}
          notifyThreshold={userData?.notify_threshold ?? 75}
        />

        <div className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-3 space-y-1">
          <p className="text-sm font-medium text-foreground">Deine Jobsuche läuft immer weiter</p>
          <p className="text-xs text-muted-foreground">
            Auch wenn Benachrichtigungen pausiert sind – wir scannen weiter nach passenden Stellen. Neue Matches findest du jederzeit im Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
