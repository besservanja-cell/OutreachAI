"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  portalUrl?: string;
  disabled?: boolean;
}

export default function CancelSubscriptionButton({ portalUrl = "https://app.lemonsqueezy.com/my-orders", disabled = false }: Props) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    const ok = window.confirm("Are you sure you want to cancel your subscription? This will stop future billings.");
    if (!ok) return;
    setLoading(true);
    // Redirect user to LemonSqueezy customer portal where they can manage/cancel
    window.location.href = portalUrl;
  };

  return (
    <Button variant="destructive" onClick={handleCancel} disabled={disabled || loading}>
      {loading ? "Redirecting..." : "Cancel Subscription"}
    </Button>
  );
}
