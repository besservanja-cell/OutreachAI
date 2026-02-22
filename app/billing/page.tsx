import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CancelSubscriptionButton from "@/components/CancelSubscriptionButton";
import { Mail } from "lucide-react";

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

        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                id: "free",
                title: "Free",
                price: "$0",
                desc: "5 emails lifetime",
                included: ["5 generated emails", "Basic templates", "Community support"],
              },
              {
                id: "starter",
                title: "Starter",
                price: "$9/mo",
                desc: "100 emails per month",
                included: ["100 emails / month", "Custom tones", "Priority support"],
              },
              {
                id: "pro",
                title: "Pro",
                price: "$29/mo",
                desc: "Unlimited emails per month",
                included: ["Unlimited emails", "Team seats", "SLA support"],
              },
            ].map((p) => {
              const isCurrent = p.id === plan;
              return (
                <Card key={p.id} className={isCurrent ? "border-primary/50 bg-primary/5" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{p.title}</h3>
                        <p className="text-sm text-muted-foreground">{p.desc}</p>
                      </div>
                      <div className={isCurrent ? "text-primary font-bold" : "font-semibold"}>{p.price}</div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="mb-4 space-y-2">
                      {p.included.map((it) => (
                        <li key={it} className="text-sm">• {it}</li>
                      ))}
                    </ul>
                    <div className="flex flex-col gap-2">
                      {isCurrent ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Current plan</span>
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{p.title}</span>
                        </div>
                      ) : (
                        <Link href="/#pricing">
                          <Button className="w-full">Upgrade Plan</Button>
                        </Link>
                      )}

                      {p.id !== "free" && isCurrent && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          Next billing date: <span className="font-medium">Not available — check your LemonSqueezy portal</span>
                        </div>
                      )}

                      {p.id !== "free" && isCurrent && (
                        <div className="mt-3">
                          <a href="https://app.lemonsqueezy.com/my-orders" target="_blank" rel="noreferrer">
                            <Button variant="outline" className="w-full mb-2">LemonSqueezy Customer Portal</Button>
                          </a>
                          <CancelSubscriptionButton />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
