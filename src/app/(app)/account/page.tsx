import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AccountPersonalForm } from "./AccountPersonalForm";
import { AccountSecurityForm } from "./AccountSecurityForm";
import { AccountDangerZone } from "./AccountDangerZone";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: userData, error } = await supabase
    .from("users")
    .select("email, first_name, last_name")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error fetching account data:", error);
  }

  const email = userData?.email || user.email || "";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="mt-1 text-muted-foreground">Verwalte deine persönlichen Angaben und deinen Account.</p>
      </div>

      <div className="space-y-4">
        <AccountPersonalForm
          initialFirstName={userData?.first_name ?? ""}
          initialLastName={userData?.last_name ?? ""}
        />

        <AccountSecurityForm email={email} />

        <AccountDangerZone />
      </div>
    </div>
  );
}
