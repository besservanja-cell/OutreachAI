"use client";

import Link from "next/link";
import { useState } from "react";
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
  Lock,
  Copy,
} from "lucide-react";

const DEMO_VARIANTS = [
  {
    tone: "Professional",
    subject: "Streamlining operations for teams like TechFlow",
    body: "Hi Sarah Chen,\n\nI’ve been following TechFlow’s growth in the SaaS space and it’s impressive. Most teams we speak with reach a point where manual outreach slows them down and pipeline becomes unpredictable.\n\nOur platform helps SaaS companies like TechFlow automate personalized outreach while keeping messages tightly aligned to each prospect’s context—typically unlocking more replies within the first quarter.\n\nWould you be open to a quick 15-minute chat to see if this could fit your current outbound strategy?\n\nBest regards,\nThe OutreachAI Team",
  },
  {
    tone: "Casual",
    subject: "Quick thought for TechFlow",
    body: "Hey Sarah,\n\nHope you’re doing well! I’ve been watching TechFlow in the SaaS space and love how you’re simplifying workflows for your customers.\n\nWe’ve been helping similar SaaS teams 3x the number of quality cold emails they send—without adding headcount or burning out the team. Thought it might be worth a quick look.\n\nIf you’re open to it, I’d love to share a few examples tailored to TechFlow.\n\nCheers,\nThe OutreachAI Team",
  },
  {
    tone: "Bold",
    subject: "TechFlow could 3x outreach without hiring",
    body: "Hi Sarah,\n\nI’ll keep this short: most SaaS teams are leaving serious revenue on the table by relying on fully manual outreach.\n\nOutreachAI helps companies like TechFlow send highly personalized cold emails at scale—our customers typically see more replies and booked meetings in under 90 days.\n\nIf you’re open to it, I’d love 15 minutes to walk you through what this could look like for TechFlow.\n\nLet’s make it happen,\nThe OutreachAI Team",
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
  {
    icon: Lock,
    title: "No Credit Card",
    description:
      "Start generating emails instantly. No payment required to try OutreachAI.",
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
    a: "We use OpenRouter with Meta's Llama 3.3 70B model for fast, high-quality cold email generation.",
  },
];

function LandingContent() {
  const { user, loading } = useAuth();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyDemo = async (variant: (typeof DEMO_VARIANTS)[number], index: number) => {
    try {
      await navigator.clipboard.writeText(`${variant.subject}\n\n${variant.body}`);
      setCopiedIndex(index);
      setTimeout(() => {
        setCopiedIndex((current) => (current === index ? null : current));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy demo email:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-violet-50 animated-gradient">
      <header className="border-b bg-background/80 backdrop-blur">
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
            <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              ✦ Trusted by 500+ sales teams
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl">
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
            <p className="mt-4 text-xs text-muted-foreground sm:text-sm">
              5,000+ emails generated <span className="mx-2">•</span> 3 tone variants{" "}
              <span className="mx-2">•</span> Free to start
            </p>
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
              {DEMO_VARIANTS.map((v, i) => {
                const toneBorderClass =
                  v.tone === "Professional"
                    ? "border-l-2 border-sky-400"
                    : v.tone === "Casual"
                    ? "border-l-2 border-emerald-400"
                    : "border-l-2 border-orange-400";

                return (
                  <div
                    key={i}
                    className={`relative rounded-lg border bg-card p-6 shadow-sm ${toneBorderClass}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {v.tone}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        type="button"
                        onClick={() => handleCopyDemo(v, i)}
                        aria-label={copiedIndex === i ? "Copied" : "Copy demo email"}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="mt-3 font-medium">{v.subject}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {v.body}
                    </p>
                    {copiedIndex === i && (
                      <p className="mt-2 text-xs font-medium text-emerald-600">
                        Copied to clipboard
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <h2 className="mb-2 text-center text-2xl font-bold">Why OutreachAI</h2>
          <p className="mx-auto mb-12 max-w-xl text-center text-muted-foreground">
            Built for founders, sales teams, and anyone who sends cold outreach.
          </p>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
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
          <div className="mt-4 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground md:flex-row">
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">|</span>
              <Link href="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
            </div>
            <p className="text-center md:text-right">
              Made with ❤️ for sales teams
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function LandingPage() {
  return <LandingContent />;
}
