"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { EmailGenerator } from "@/components/EmailGenerator";
import { Mail, LogOut, CreditCard, Copy } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  prospect_name: string;
  prospect_company: string;
  industry: string;
  variants_json: unknown;
  created_at: string;
}

interface DashboardClientProps {
  creditsUsed: number;
  creditsLimit: number;
  plan: string;
  history: HistoryItem[];
}

export function DashboardClient({
  creditsUsed,
  creditsLimit,
  plan,
  history,
}: DashboardClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"generator" | "history">("generator");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const usagePercent = creditsLimit > 0 ? (creditsUsed / creditsLimit) * 100 : 0;
  const remaining = Math.max(0, (creditsLimit ?? 0) - (creditsUsed ?? 0));

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleGenerated = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mail className="h-6 w-6 text-primary" />
            OutreachAI
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/billing">
              <Button variant="ghost" size="sm" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Generate AI cold emails and manage your history.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Usage</h2>
              <span className="text-sm text-muted-foreground">
                {creditsUsed} / {creditsLimit} emails
                {plan !== "free" && (
                  <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    {plan}
                  </span>
                )}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={usagePercent} className="h-2" />
            <p className="mt-2 text-sm text-muted-foreground">
              You have <span className="font-medium">{remaining}</span> emails remaining
            </p>

            {remaining <= 0 && (
              <div className="mt-3 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
                <Link href="/billing" className="underline">
                  You&apos;ve used all free emails. Upgrade to continue →
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mb-4 flex gap-2 border-b">
          <button
            onClick={() => setActiveTab("generator")}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "generator"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              activeTab === "history"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            History
          </button>
        </div>

        {activeTab === "generator" && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Generate Cold Emails</h2>
              <p className="text-sm text-muted-foreground">
                Enter your product, prospect details, and preferred tone.
              </p>
            </CardHeader>
            <CardContent>
              <EmailGenerator
                onGenerated={handleGenerated}
                disabled={creditsUsed >= creditsLimit}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === "history" && (
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Last 20 Emails</h2>
              <p className="text-sm text-muted-foreground">
                Your recent cold email generations.
              </p>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/40">
                    <Mail className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm">No emails generated yet. Generate your first email above!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => {
                    const raw = item.variants_json;
                    const variants = Array.isArray(raw)
                      ? raw
                      : raw &&
                          typeof raw === "object" &&
                          "variants" in raw
                        ? (raw as { variants: unknown[] }).variants ?? []
                        : [];
                    const isExpanded = expandedId === item.id;
                    return (
                      <div
                        key={item.id}
                        className="rounded-lg border p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium">
                              {item.prospect_name || "Unknown"} @ {item.prospect_company || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.industry} • {new Date(item.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedId(isExpanded ? null : item.id)}
                            >
                              {isExpanded ? "Collapse" : "Expand"}
                            </Button>
                          </div>
                        </div>

                        {isExpanded && Array.isArray(variants) && variants.length > 0 && (
                          <div className="mt-4 grid gap-2 sm:grid-cols-3">
                            {variants.slice(0, 3).map((v: { subject?: string; body?: string; tone?: string }, i: number) => (
                              <div
                                key={i}
                                className="rounded border bg-muted/50 p-3 text-sm"
                              >
                                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                                  {v.tone ?? "professional"}
                                </span>
                                <p className="mt-2 font-medium">{v.subject}</p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                  {v.body}
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 h-8 gap-1"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      `${v.subject}\n\n${v.body}`
                                    )
                                  }
                                >
                                  <Copy className="h-3 w-3" />
                                  Copy
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
