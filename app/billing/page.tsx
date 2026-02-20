import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Mail, CreditCard, ExternalLink } from "lucide-react";

export default async function BillingPage() {
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
    .select("plan, credits_used, credits_limit, ls_customer_id")
    .eq("id", user.id)
    .single();

  const plan = userRow?.plan ?? "free";
  const creditsUsed = userRow?.credits_used ?? 0;
  const creditsLimit = userRow?.credits_limit ?? 5;
  const hasLSCustomer = !!userRow?.ls_customer_id;

  const planLabel =
    plan === "pro" ? "Pro" : plan === "starter" ? "Starter" : "Free";
  const planDescription =
    plan === "pro"
      ? "Unlimited emails per month"
      : plan === "starter"
        ? "100 emails per month"
        : "5 emails lifetime";


  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mail className="h-6 w-6 text-primary" />
            OutreachAI
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing.
          </p>
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Current Plan</h2>
              <p className="text-sm text-muted-foreground">
                Your subscription and usage details.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{planLabel}</p>
                  <p className="text-sm text-muted-foreground">
                    {planDescription}
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {creditsUsed} / {creditsLimit} used
                </span>
              </div>

              {plan === "free" && (
                <Link href="/#pricing">
                  <Button className="w-full gap-2">
                    <CreditCard className="h-4 w-4" />
                    Upgrade Plan
                  </Button>
                </Link>
              )}

              {plan !== "free" && (
                <div className="flex gap-4">
                  <a
                    href="https://app.lemonsqueezy.com/my-orders"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      LemonSqueezy Customer Portal
                    </Button>
                  </a>
                  {plan !== "pro" && (
                    <Link href="/#pricing" className="flex-1">
                      <Button className="w-full">Upgrade to Pro</Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="font-semibold">Need Help?</h2>
              <p className="text-sm text-muted-foreground">
                Manage your subscription, update payment methods, or cancel from
                the LemonSqueezy customer portal.
              </p>
            </CardHeader>
            <CardContent>
              <a
                href="https://app.lemonsqueezy.com/help"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="ghost" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  LemonSqueezy Help Center
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
