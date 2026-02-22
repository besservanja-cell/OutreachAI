"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    emails: "5 emails",
    emailsNote: "lifetime",
    features: ["5 cold emails total", "All 3 tone variants", "Basic support"],
    cta: "Get Started",
    variantId: null,
    highlighted: false,
  },
  {
    id: "starter",
    name: "Starter",
    price: "$9",
    period: "/month",
    emails: "100 emails",
    emailsNote: "per month",
    features: [
      "100 emails per month",
      "All 3 tone variants",
      "Email history",
      "Priority support",
    ],
    cta: "Start Free Trial",
    variantId: "starter",
    highlighted: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    emails: "Unlimited",
    emailsNote: "emails",
    features: [
      "Unlimited emails",
      "All 3 tone variants",
      "Full email history",
      "Dedicated support",
    ],
    cta: "Go Pro",
    variantId: "pro",
    highlighted: false,
  },
];

interface PricingTableProps {
  authenticated?: boolean;
}

export function PricingTable({ authenticated = false }: PricingTableProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    if (planId === "free") return;

    setLoadingPlan(planId);

    try {
      const res = await fetch("/api/lemonsqueezy/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      setLoadingPlan(null);
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {PLANS.map((plan) => (
        <Card
          key={plan.id}
          className={cn(
            "relative flex flex-col",
            plan.highlighted && "border-emerald-500 shadow-lg ring-2 ring-emerald-200"
          )}
        >
          {plan.highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-medium text-emerald-50">
              Most Popular
            </div>
          )}
          <CardHeader>
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <div className="mt-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-muted-foreground">{plan.period}</span>
            </div>
            <p className="text-sm font-medium text-primary">
              {plan.emails} {plan.emailsNote}
            </p>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col">
            <ul className="mb-6 space-y-3">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              className="mt-auto"
              variant={plan.highlighted ? "default" : "outline"}
              onClick={() => handleCheckout(plan.id)}
              disabled={
                plan.id === "free" ||
                (plan.variantId && !authenticated) ||
                loadingPlan === plan.id
              }
            >
              {loadingPlan === plan.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : plan.id === "free" ? (
                plan.cta
              ) : !authenticated ? (
                "Sign in to subscribe"
              ) : (
                plan.cta
              )}
            </Button>
            {plan.id === "free" && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                No credit card required
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
