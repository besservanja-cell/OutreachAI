import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";
import { generateColdEmails } from "@/lib/openrouter";

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
    const { product, prospectName, company, industry, tone } = body;

    if (
      !product ||
      typeof product !== "string" ||
      !prospectName ||
      typeof prospectName !== "string" ||
      !company ||
      typeof company !== "string" ||
      !industry ||
      typeof industry !== "string" ||
      !tone ||
      typeof tone !== "string"
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields: product, prospectName, company, industry, tone" },
        { status: 400 }
      );
    }

    const admin = createAdminClient();

    const { data: userRow, error: userError } = await admin
      .from("users")
      .select("credits_used, credits_limit")
      .eq("id", user.id)
      .single();

    if (userError || !userRow) {
      return NextResponse.json(
        { error: "User record not found" },
        { status: 404 }
      );
    }

    const creditsUsed = userRow.credits_used ?? 0;
    const creditsLimit = userRow.credits_limit ?? 5;

    if (creditsUsed >= creditsLimit) {
      return NextResponse.json(
        { error: "No credits remaining. Please upgrade your plan." },
        { status: 402 }
      );
    }

    const models = [
      "google/gemini-2.0-flash-exp:free",
      "deepseek/deepseek-r1:free",
      "meta-llama/llama-3.3-70b-instruct:free",
    ];

    const input = { product, prospectName, company, industry, tone };
    let variants: Awaited<ReturnType<typeof generateColdEmails>> | null = null;
    let lastError: unknown = null;

    for (const model of models) {
      try {
        variants = await generateColdEmails(input, model);
        break;
      } catch (err) {
        lastError = err;
        continue;
      }
    }

    if (!variants) {
      console.error("All OpenRouter models failed:", lastError);
      return NextResponse.json(
        { error: "AI service is temporarily busy, please try again in a few minutes." },
        { status: 503 }
      );
    }

    const { error: insertError } = await admin.from("emails").insert({
      user_id: user.id,
      prospect_name: prospectName,
      prospect_company: company,
      industry,
      tone,
      variants_json: variants,
    });

    if (insertError) {
      console.error("Failed to save email:", insertError);
      return NextResponse.json(
        { error: "Failed to save email" },
        { status: 500 }
      );
    }

    const { error: updateError } = await admin
      .from("users")
      .update({
        credits_used: creditsUsed + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Failed to decrement credits:", updateError);
    }

    return NextResponse.json({ variants });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
