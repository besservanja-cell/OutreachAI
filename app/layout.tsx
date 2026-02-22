import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OutreachAI - AI Cold Email Generator | Free to Start",
  description:
    "Generate 3 personalized cold email variants in seconds. AI-powered outreach for founders, sales teams, and freelancers.",
  keywords: ["cold email generator", "AI email writer", "outreach tool"],
  openGraph: {
    title: "OutreachAI - AI Cold Email Generator | Free to Start",
    description:
      "Generate 3 personalized cold email variants in seconds. AI-powered outreach for founders, sales teams, and freelancers.",
    images: [
      {
        url: "/og-image.png",
        alt: "OutreachAI - AI Cold Email Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OutreachAI - AI Cold Email Generator | Free to Start",
    description:
      "Generate 3 personalized cold email variants in seconds. AI-powered outreach for founders, sales teams, and freelancers.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
