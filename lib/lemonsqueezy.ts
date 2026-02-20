import { lemonSqueezySetup, createCheckout } from "@lemonsqueezy/lemonsqueezy.js";

export function initLemonSqueezy() {
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;
  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not configured");
  }
  lemonSqueezySetup({ apiKey });
}

export async function createLemonSqueezyCheckout(
  variantId: string,
  userId: string,
  email: string
): Promise<string> {
  initLemonSqueezy();

  const storeId = process.env.LEMONSQUEEZY_STORE_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!storeId) {
    throw new Error("LEMONSQUEEZY_STORE_ID is not configured");
  }

  const checkout = await createCheckout(storeId, variantId, {
    checkoutOptions: {
      embed: false,
      media: false,
      logo: true,
      desc: true,
      discount: true,
      dark: false,
    },
    checkoutData: {
      email,
      custom: {
        user_id: userId,
      },
    },
    productOptions: {
      redirectUrl: `${appUrl}/dashboard?success=true`,
      receiptButtonText: "Back to Dashboard",
      receiptLinkUrl: `${appUrl}/dashboard`,
      receiptThankYouNote: "Thank you for subscribing to OutreachAI!",
    },
  });

  const checkoutUrl = checkout.data?.data?.attributes?.url;
  if (!checkoutUrl) {
    throw new Error("Failed to create LemonSqueezy checkout");
  }

  return checkoutUrl;
}
