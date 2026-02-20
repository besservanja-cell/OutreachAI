"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PricingTable } from "@/components/PricingTable";
import { AuthButtons } from "@/components/AuthButtons";
import { useAuth } from "@/components/AuthProvider";
import {
  Zap,
  Mail,
  BarChart3,
  Shield,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const DEMO_VARIANTS = [
  {
    tone: "Professional",
    subject: "Streamlining operations for companies like [Company]",
    body: "Hi [Name],\n\nI noticed [Company] has been scaling rapidly in the [Industry] space. Many teams we work with face similar challenges around [pain point].\n\nOur platform helps companies like yours [value prop]—typically seeing [result] within the first quarter.\n\nWould you be open to a brief 15-minute call to explore if this could be relevant for [Company]?\n\nBest regards",
  },
  {
    tone: "Casual",
    subject: "Quick thought for [Company]",
    body: "Hey [Name],\n\nHope you're doing well! I've been following [Company]'s growth in [Industry] and it's impressive.\n\nWe've been helping similar teams [value prop] without the usual headaches. Thought it might be worth a quick chat?\n\nNo pressure—just wanted to reach out. Let me know if you'd like to connect!\n\nCheers",
  },
  {
    tone: "Bold",
    subject: "[Company] could 3x outreach without hiring",
    body: "Hi [Name],\n\nStraight to the point: most [Industry] companies are leaving serious revenue on the table with manual outreach.\n\nWe help teams like [Company] [value prop]—our customers typically see [result] in under 90 days.\n\nI'd love to show you how. 15 minutes, no commitment. When works this week?\n\nLet's make it happen.",
  },
];

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Generation",
    description:
      "Get 3 personalized cold email variants in seconds. Professional, casual, or bold—pick your style.",
  },
  {
    icon: BarChart3,
    title: "Higher Response Rates",
    description:
      "AI-crafted emails that speak to industry pain points and include soft CTAs for better engagement.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your data stays yours. We never share prospect information or use it for training.",
  },
];

const FAQ = [
  {
    q: "How does the free tier work?",
    a: "You get 5 cold emails total, lifetime. No credit card required. Perfect for trying out OutreachAI.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "You'll need to upgrade to Starter ($9/mo for 100 emails) or Pro ($29/mo for unlimited) to continue generating.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel your subscription anytime from the billing page. You'll keep access until the end of your billing period.",
  },
  {
    q: "Which AI model do you use?",
    a: "We use OpenRouter with Meta's Llama 4 Scout model for fast, high-quality cold email generation.",
  },
];

function LandingContent() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Mail className="h-6 w-6 text-primary" />
            OutreachAI
          </Link>
          <nav className="flex items-center gap-4">
            {!loading &&
              (user ? (
                <Link href="/dashboard">
                  <Button>Dashboard</Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="#pricing">
                    <Button variant="ghost">Pricing</Button>
                  </Link>
                  <Link href="#demo">
                    <Button variant="outline">See Demo</Button>
                  </Link>
                  <Link href="#signin">
                    <Button>Sign In</Button>
                  </Link>
                </div>
              ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              AI Cold Emails That{" "}
              <span className="text-primary">Actually Get Replies</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Generate 3 personalized cold email variants in seconds. Professional,
              casual, or bold—optimized for your prospect and industry.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href={user ? "/dashboard" : "#signin"}>
                <Button size="lg" className="gap-2">
                  {user ? "Go to Dashboard" : "Get Started Free"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#demo">
                <Button size="lg" variant="outline" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  See Live Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="demo" className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Live Demo Output
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
              Example output for a SaaS product reaching out to a tech company.
              Sign up to generate your own.
            </p>
            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              {DEMO_VARIANTS.map((v, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card p-6 shadow-sm"
                >
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {v.tone}
                  </span>
                  <p className="mt-3 font-medium">{v.subject}</p>
                  <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                    {v.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="mb-2 text-center text-2xl font-bold">Why OutreachAI</h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Built for founders, sales teams, and anyone who sends cold outreach.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-2 text-center text-2xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
              Start free. Upgrade when you need more.
            </p>
            <PricingTable authenticated={!!user} />
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="mb-12 text-center text-2xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-2xl space-y-6">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-lg border p-6">
                <h3 className="font-semibold">{item.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="signin" className="border-t bg-muted/30 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-md">
              <h2 className="mb-6 text-center text-2xl font-bold">
                {user ? "You're signed in" : "Sign in or create an account"}
              </h2>
              {!user && <AuthButtons />}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Mail className="h-5 w-5 text-primary" />
              OutreachAI
            </Link>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/dashboard" className="hover:text-foreground">
                Dashboard
              </Link>
              <Link href="/billing" className="hover:text-foreground">
                Billing
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} OutreachAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return <LandingContent />;
}
