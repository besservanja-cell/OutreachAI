import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase-admin";

function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody);
  const digest = hmac.digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature, "hex"),
    Buffer.from(digest, "hex")
  );
}

function getPlanFromVariantId(variantId: string): "starter" | "pro" {
  const starterId = process.env.LEMONSQUEEZY_STARTER_VARIANT_ID;
  const proId = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;

  if (variantId === proId) return "pro";
  if (variantId === starterId) return "starter";
  return "starter";
}

function getCreditsLimit(plan: string): number {
  switch (plan) {
    case "starter":
      return 100;
    case "pro":
      return 999999;
    default:
      return 5;
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    const signature = request.headers.get("x-signature") ?? "";
    const rawBody = await request.text();

    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as {
      meta?: { event_name?: string };
      data?: {
        id?: string;
        type?: string;
        attributes?: {
          customer_id?: number;
          status?: string;
          variant_id?: number;
          first_order_item?: { variant_id?: number };
        };
      };
      included?: Array<{
        type?: string;
        id?: string;
        attributes?: {
          user_email?: string;
          user_name?: string;
        };
      }>;
    };

    const eventName = payload.meta?.event_name;
    const data = payload.data;

    if (!eventName || !data) {
      return NextResponse.json({ received: true });
    }

    const admin = createAdminClient();

    if (eventName === "subscription_created") {
      const attrs = data.attributes;
      const customerId = String(attrs?.customer_id ?? data.id ?? "");
      const variantId = String(attrs?.variant_id ?? attrs?.first_order_item?.variant_id ?? "");
      const status = attrs?.status ?? "active";

      const customData = (payload as { meta?: { custom_data?: { user_id?: string } } }).meta?.custom_data;
      const userId = customData?.user_id;

      if (!userId) {
        return NextResponse.json({ received: true });
      }

      const plan = getPlanFromVariantId(variantId);
      const creditsLimit = getCreditsLimit(plan);

      await admin
        .from("users")
        .update({
          plan,
          credits_limit: creditsLimit,
          credits_used: 0,
          ls_customer_id: customerId,
          ls_subscription_id: String(data.id ?? ""),
          subscription_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    } else if (eventName === "subscription_updated") {
      const attrs = data.attributes;
      const variantId = String(attrs?.variant_id ?? "");
      const status = attrs?.status ?? "active";

      const { data: userBySub } = await admin
        .from("users")
        .select("id")
        .eq("ls_subscription_id", String(data.id))
        .single();

      if (userBySub) {
        const plan = getPlanFromVariantId(variantId);
        const creditsLimit = getCreditsLimit(plan);

        await admin
          .from("users")
          .update({
            plan,
            credits_limit: creditsLimit,
            subscription_status: status,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userBySub.id);
      }
    } else if (eventName === "subscription_cancelled") {
      const { data: userBySub } = await admin
        .from("users")
        .select("id")
        .eq("ls_subscription_id", String(data.id))
        .single();

      if (userBySub) {
        await admin
          .from("users")
          .update({
            plan: "free",
            credits_limit: 5,
            ls_subscription_id: null,
            subscription_status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", userBySub.id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
