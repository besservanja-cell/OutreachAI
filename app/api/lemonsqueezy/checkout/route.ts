import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createLemonSqueezyCheckout } from "@/lib/lemonsqueezy";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planId } = body;

    if (!planId || typeof planId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid planId" },
        { status: 400 }
      );
    }

    const starterId = process.env.LEMONSQUEEZY_STARTER_VARIANT_ID;
    const proId = process.env.LEMONSQUEEZY_PRO_VARIANT_ID;

    const variantId =
      planId === "pro" ? proId : planId === "starter" ? starterId : null;

    if (!variantId) {
      return NextResponse.json(
        { error: "Invalid plan" },
        { status: 400 }
      );
    }

    const email = user.email ?? "";
    const checkoutUrl = await createLemonSqueezyCheckout(
      variantId,
      user.id,
      email
    );

    return NextResponse.json({ url: checkoutUrl });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
