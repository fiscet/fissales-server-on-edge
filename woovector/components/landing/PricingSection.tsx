import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ArrowRight, TrendingUp, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface PricingFeature {
  text: string;
  highlight?: boolean;
}

interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceAnnual: string;
  annualSavings: string;
  limits: {
    products: string;
    conversations: string;
  };
  roiMessage: string;
  features: PricingFeature[];
  cta: string;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Perfect for small stores",
    price: "€29",
    priceAnnual: "€290",
    annualSavings: "17% savings",
    limits: {
      products: "Up to 5,000 products",
      conversations: "Up to 500 conversations/month",
    },
    roiMessage: "Pays for itself with 3-5 additional sales per month",
    features: [
      { text: "Full platform access", highlight: true },
      { text: "WooCommerce integration" },
      { text: "Ultra-fast responses under 2 seconds" },
      { text: "Intelligent product recommendations" },
      { text: "Customer conversation analytics" },
      { text: "Email support" },
    ],
    cta: "Start Free Trial",
  },
  {
    id: "professional",
    name: "Professional",
    tagline: "Best for growing stores",
    price: "€59",
    priceAnnual: "€590",
    annualSavings: "17% savings",
    limits: {
      products: "Up to 10,000 products",
      conversations: "Up to 2,000 conversations/month",
    },
    roiMessage: "Pays for itself with 6-10 additional sales per month",
    features: [
      { text: "Everything in Starter", highlight: true },
      { text: "Higher product & conversation limits" },
      { text: "Advanced analytics dashboard" },
      { text: "Priority support" },
      { text: "Custom branding options" },
      { text: "API access" },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
];

interface ROICalculatorProps {
  className?: string;
}

function ROICalculator({ className = "" }: ROICalculatorProps) {
  return (
    <div className={`bg-card border border-border rounded-xl p-6 sm:p-8 ${className}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-primary" strokeWidth={2.5} aria-hidden="true" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground">
          See Your ROI
        </h3>
      </div>

      <div className="space-y-4">
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="text-sm text-muted-foreground mb-2">
            Current monthly store revenue:
          </div>
          <div className="text-2xl font-bold text-foreground">€10,000</div>
        </div>

        <div className="flex items-center gap-4">
          <ArrowRight className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
          <div className="bg-muted/50 rounded-lg p-4 flex-1">
            <div className="text-sm text-muted-foreground mb-2">
              With just 1% conversion increase:
            </div>
            <div className="text-2xl font-bold text-primary">€10,100</div>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Extra revenue per month:
            </span>
            <span className="text-2xl font-bold text-primary">€100</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm font-medium text-foreground">
              WooVector cost:
            </span>
            <span className="text-lg font-bold text-foreground">€29</span>
          </div>
          <div className="border-t border-primary/20 mt-3 pt-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground">
                Net profit increase:
              </span>
              <span className="text-3xl font-bold text-primary">€71</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Most stores see 20-30% conversion improvements, making ROI even higher
        </p>
      </div>
    </div>
  );
}

interface PricingCardProps {
  tier: PricingTier;
}

function PricingCard({ tier }: PricingCardProps) {
  return (
    <Card
      className={`group relative bg-card border rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-xl flex flex-col ${tier.popular
        ? "border-primary/30 shadow-lg"
        : "border-border hover:border-primary/30"
        }`}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground shadow-lg px-3 py-1">
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-6 pt-8">
        <CardTitle className="text-2xl font-bold text-foreground mb-2">
          {tier.name}
        </CardTitle>
        <p className="text-sm text-muted-foreground mb-6">{tier.tagline}</p>

        <div className="space-y-2">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-foreground">{tier.price}</span>
            <span className="text-lg text-muted-foreground">/month</span>
          </div>
          <p className="text-sm text-muted-foreground">
            or {tier.priceAnnual}/year ({tier.annualSavings})
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col flex-grow px-6 pb-8">
        {/* Limits */}
        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="text-xs text-muted-foreground mb-2 font-medium">
            PLAN LIMITS
          </div>
          <div className="space-y-1">
            <p className="text-sm text-foreground font-medium">{tier.limits.products}</p>
            <p className="text-sm text-foreground font-medium">{tier.limits.conversations}</p>
          </div>
        </div>

        {/* ROI Message */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" strokeWidth={2.5} aria-hidden="true" />
            <p className="text-sm font-semibold text-primary leading-relaxed">
              {tier.roiMessage}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6 flex-grow">
          {tier.features.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${feature.highlight
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                <Check className="w-3 h-3" strokeWidth={3} aria-hidden="true" />
              </div>
              <span
                className={`text-sm leading-relaxed ${feature.highlight
                  ? "font-semibold text-foreground"
                  : "text-muted-foreground"
                  }`}
              >
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Button
            asChild
            className={`w-full py-6 text-base font-semibold rounded-xl transition-all duration-200 ${tier.popular
              ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl"
              : "bg-primary/10 hover:bg-primary/20 text-primary"
              }`}
          >
            <Link href="/auth/sign-up" className="flex items-center justify-center gap-2">
              {tier.cta}
              <ArrowRight className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
            </Link>
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-4">
            1-month free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted relative overflow-hidden"
      aria-labelledby="pricing-title"
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            id="pricing-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Pricing That{" "}
            <span className="text-primary">Pays for Itself</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            €29/month easily pays for itself with just 1% conversion improvement—see the math below
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} />
          ))}
        </div>

        {/* ROI Calculator */}
        <ROICalculator className="max-w-2xl mx-auto mb-16" />

        {/* Free Trial CTA */}
        <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-8 h-8 text-primary" strokeWidth={2} aria-hidden="true" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Try WooVector Risk-Free
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your 1-month free trial today and see the 20-30% conversion increase yourself. No credit card required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all duration-200 group rounded-xl"
            >
              <Link
                href="/auth/sign-up"
                className="flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" strokeWidth={3} aria-hidden="true" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" strokeWidth={3} aria-hidden="true" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-primary" strokeWidth={3} aria-hidden="true" />
              <span>Full feature access</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
