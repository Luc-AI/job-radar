"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type CardState = {
  error?: string;
  success?: boolean;
};

// ── Search Mode ──────────────────────────────────────────────────────────────

export async function saveSearchMode(
  prevState: CardState,
  formData: FormData
): Promise<CardState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const threshold = parseInt(formData.get("notify_threshold") as string, 10);
  if (isNaN(threshold) || threshold < 40 || threshold > 95) {
    return { error: "Schwellenwert muss zwischen 40 und 95 liegen" };
  }

  const { error } = await supabase
    .from("users")
    .update({ notify_threshold: threshold, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") console.error("saveSearchMode:", error);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}

// ── Notification Channels ─────────────────────────────────────────────────────

const VALID_DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export async function saveNotificationChannels(
  prevState: CardState,
  formData: FormData
): Promise<CardState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const notifyEnabled = formData.get("notify_enabled") === "true";
  const notifyFrequency = formData.get("notify_frequency") as string;
  const notifyTime = parseInt(formData.get("notify_time") as string, 10);

  let notifyDays: string[] = [];
  try {
    notifyDays = JSON.parse(formData.get("notify_days") as string);
  } catch {
    return { error: "Ungültige Tagauswahl" };
  }

  if (!["daily", "weekly"].includes(notifyFrequency)) {
    return { error: "Ungültige Frequenz" };
  }
  if (isNaN(notifyTime) || notifyTime < 0 || notifyTime > 23) {
    return { error: "Ungültige Lieferzeit" };
  }
  if (!notifyDays.every((d) => VALID_DAYS.includes(d))) {
    return { error: "Ungültige Tagauswahl" };
  }

  const { error } = await supabase
    .from("users")
    .update({
      notify_enabled: notifyEnabled,
      notify_frequency: notifyFrequency,
      notify_time: notifyTime,
      notify_days: notifyDays,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") console.error("saveNotificationChannels:", error);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/settings");
  return { success: true };
}

// ── Instant Alerts ────────────────────────────────────────────────────────────

const VALID_CHANNELS = ["email", "whatsapp", "ntfy"];

export async function saveInstantAlerts(
  prevState: CardState,
  formData: FormData
): Promise<CardState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const instantEnabled = formData.get("instant_alerts_enabled") === "true";
  const instantThreshold = parseInt(formData.get("instant_alert_threshold") as string, 10);
  const notifyThreshold = parseInt(formData.get("notify_threshold") as string, 10);

  let instantChannels: string[] = [];
  try {
    instantChannels = JSON.parse(formData.get("instant_alert_channels") as string);
  } catch {
    return { error: "Ungültige Kanalauswahl" };
  }

  if (isNaN(instantThreshold) || instantThreshold < 70 || instantThreshold > 98) {
    return { error: "Sofort-Alarm-Schwellenwert muss zwischen 70 und 98 liegen" };
  }
  if (!instantChannels.every((c) => VALID_CHANNELS.includes(c))) {
    return { error: "Ungültige Kanalauswahl" };
  }
  if (instantEnabled && !isNaN(notifyThreshold) && instantThreshold < notifyThreshold) {
    return {
      error: `Sofort-Alarm-Schwellenwert (${instantThreshold}%) muss grösser oder gleich dem Such-Modus-Schwellenwert (${notifyThreshold}%) sein`,
    };
  }

  const { error } = await supabase
    .from("users")
    .update({
      instant_alerts_enabled: instantEnabled,
      instant_alert_threshold: instantThreshold,
      instant_alert_channels: instantChannels,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") console.error("saveInstantAlerts:", error);
    return { error: "Speichern fehlgeschlagen. Bitte erneut versuchen." };
  }

  revalidatePath("/settings");
  return { success: true };
}

// ── Top Pick Threshold (used by dashboard) ────────────────────────────────────

export async function updateTopPickThreshold(
  prevState: CardState,
  formData: FormData
): Promise<CardState> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not authenticated" };

  const threshold = parseInt(formData.get("top_pick_threshold") as string, 10);
  if (isNaN(threshold) || threshold < 70 || threshold > 100) {
    return { error: "Threshold must be between 70 and 100" };
  }

  const { error } = await supabase
    .from("users")
    .update({ top_pick_threshold: threshold, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) {
    if (process.env.NODE_ENV === "development") console.error("updateTopPickThreshold:", error);
    return { error: "Failed to save settings. Please try again." };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  return { success: true };
}
