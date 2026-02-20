"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Copy, Loader2, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const INDUSTRIES = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Education",
  "Manufacturing",
  "Real Estate",
  "Marketing",
  "Legal",
  "Consulting",
  "Retail",
  "Hospitality",
  "Media",
  "Non-profit",
  "Construction",
  "Logistics",
  "Insurance",
  "Energy",
  "Agriculture",
  "Other",
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "bold", label: "Bold" },
];

export interface EmailVariant {
  subject: string;
  body: string;
  tone: string;
}

interface EmailGeneratorProps {
  onGenerated?: (variants: EmailVariant[]) => void;
  disabled?: boolean;
}

export function EmailGenerator({
  onGenerated,
  disabled = false,
}: EmailGeneratorProps) {
  const [product, setProduct] = useState("");
  const [prospectName, setProspectName] = useState("");
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState(INDUSTRIES[0]);
  const [tone, setTone] = useState("professional");
  const [variants, setVariants] = useState<EmailVariant[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (index: number, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setVariants(null);
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product,
          prospectName,
          company,
          industry,
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate emails");
      }

      setVariants(data.variants);
      onGenerated?.(data.variants);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="product">Product / Service</Label>
          <Textarea
            id="product"
            placeholder="Describe your product or service in 1-2 sentences..."
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            required
            className="mt-1.5"
            rows={3}
            disabled={disabled}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="prospectName">Prospect Name</Label>
            <Input
              id="prospectName"
              placeholder="John Smith"
              value={prospectName}
              onChange={(e) => setProspectName(e.target.value)}
              required
              className="mt-1.5"
              disabled={disabled}
            />
          </div>
          <div>
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              placeholder="Acme Inc"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
              className="mt-1.5"
              disabled={disabled}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1.5"
              disabled={disabled}
            >
              {INDUSTRIES.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="tone">Preferred Tone</Label>
            <Select
              id="tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="mt-1.5"
              disabled={disabled}
            >
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <Button type="submit" disabled={loading || disabled} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Generate Emails
            </>
          )}
        </Button>
      </form>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {variants && variants.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {variants.map((v, i) => (
            <Card
              key={i}
              className={cn(
                "overflow-hidden transition-all duration-300",
                "animate-in fade-in slide-in-from-bottom-4",
                `animation-delay-${i * 100}`
              )}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium capitalize text-primary">
                    {v.tone}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      handleCopy(i, `${v.subject}\n\n${v.body}`)
                    }
                  >
                    {copiedIndex === i ? (
                      <span className="text-xs text-green-600">Copied!</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-sm font-medium leading-tight">{v.subject}</p>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                  {v.body}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopy(i, v.subject)}
                  >
                    Copy Subject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopy(i, v.body)}
                  >
                    Copy Body
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
