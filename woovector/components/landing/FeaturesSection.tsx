import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plug,
  Sparkles,
  Search,
  Package,
  Rocket,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

interface WooCommerceFeature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  benefit: string;
}

const woocommerceFeatures: WooCommerceFeature[] = [
  {
    id: "instant-setup",
    icon: Plug,
    title: "Get Started in Minutes",
    description:
      "Connect your WooCommerce store effortlessly. No technical expertise needed—just simple setup and you're live with intelligent recommendations.",
    benefit: "5-minute setup vs hours with generic chatbots",
  },
  {
    id: "smart-understanding",
    icon: Sparkles,
    title: "Truly Understands Your Products",
    description:
      "AI learns your entire catalog to provide intelligent, contextual recommendations. Your customers get exactly what they're looking for.",
    benefit: "30% better product discovery and customer satisfaction",
  },
  {
    id: "instant-answers",
    icon: Search,
    title: "Instant, Intelligent Answers",
    description:
      "Customers get smart product recommendations in under 2 seconds. Natural conversations that understand intent, not just keywords.",
    benefit: "Under 2 seconds vs 8+ seconds with competitors",
  },
  {
    id: "smart-recommendations",
    icon: Package,
    title: "Intelligent Product Recommendations",
    description:
      "AI suggests perfect product combinations and bundles based on what customers actually want. More sales, happier customers.",
    benefit: "20-30% conversion increase with smart recommendations",
  },
  {
    id: "risk-free",
    icon: Rocket,
    title: "Try Risk-Free",
    description:
      "Install with one click, remove anytime. No technical hassles, no broken sites, no commitments. See results before you commit.",
    benefit: "Zero-risk trial—install and uninstall safely",
  },
  {
    id: "see-results",
    icon: BarChart3,
    title: "See Real Results",
    description:
      "Track exactly how intelligent recommendations impact your sales. Clear metrics showing conversion improvements and ROI.",
    benefit: "Real-time visibility into conversion increases",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-muted relative overflow-hidden"
      aria-labelledby="features-title"
    >
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            id="features-title"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4"
          >
            Intelligent & Fast for{" "}
            <span className="text-primary">WooCommerce</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Unlike generic chatbots like Tidio or Gorgias, WooVector combines intelligent recommendations with lightning-fast responses
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {woocommerceFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <Card
                key={feature.id}
                className="group relative bg-card border border-border rounded-lg p-6 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:border-primary/30"
              >
                {/* Icon */}
                <div className="mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <IconComponent
                      className="w-6 h-6 text-primary"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Content */}
                <CardHeader className="p-0 mb-3">
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Benefit highlight */}
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm font-semibold text-primary flex items-start gap-2">
                      <span className="text-primary mt-0.5" aria-hidden="true">✓</span>
                      <span>{feature.benefit}</span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}