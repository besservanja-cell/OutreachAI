import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const admin = createAdminClient();
  const { data: userRow } = await admin
    .from("users")
    .select("credits_used, credits_limit, plan")
    .eq("id", user.id)
    .single();

  const creditsUsed = userRow?.credits_used ?? 0;
  const creditsLimit = userRow?.credits_limit ?? 5;
  const plan = userRow?.plan ?? "free";

  const { data: emails } = await admin
    .from("emails")
    .select("id, prospect_name, prospect_company, industry, variants_json, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <DashboardClient
      creditsUsed={creditsUsed}
      creditsLimit={creditsLimit}
      plan={plan}
      history={emails ?? []}
    />
  );
}
