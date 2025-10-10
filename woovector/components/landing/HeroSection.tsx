import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative pt-20 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5"
      aria-labelledby="hero-title"
    >
      {/* Grid Pattern Background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
        aria-hidden="true"
      />

      {/* Animated Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" aria-hidden="true" />
      <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-primary/10 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-primary/15 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Content */}
          <div className="space-y-6 lg:space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2">
              <Zap className="w-4 h-4 text-primary" strokeWidth={2.5} aria-hidden="true" />
              <span className="text-sm font-medium text-primary">Intelligent & Lightning-Fast for WooCommerce</span>
            </div>

            {/* Main Headline */}
            <h1
              id="hero-title"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
            >
              Intelligent AI Chatbots for{" "}
              <span className="text-primary">WooCommerce</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Increase conversions 20-30% with intelligent product recommendations delivered in under 2 seconds. Your customers get smart answers instantly.
            </p>

            {/* Feature Highlights */}
            <div
              className="flex flex-col gap-3 text-sm sm:text-base"
              role="list"
              aria-label="Key benefits"
            >
              <div
                className="flex items-center gap-3 text-foreground/80"
                role="listitem"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" strokeWidth={2.5} aria-hidden="true" />
                </div>
                <span>Intelligent recommendations that understand customer intent</span>
              </div>
              <div
                className="flex items-center gap-3 text-foreground/80"
                role="listitem"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" strokeWidth={2.5} aria-hidden="true" />
                </div>
                <span>Lightning-fast responses under 2 seconds vs 8+ with competitors</span>
              </div>
              <div
                className="flex items-center gap-3 text-foreground/80"
                role="listitem"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4 text-primary" strokeWidth={2.5} aria-hidden="true" />
                </div>
                <span>Built specifically for WooCommerce product catalogs</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
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
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" strokeWidth={2.5} />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="px-8 py-6 text-base border-2 rounded-xl"
              >
                <Link href="#features">
                  View Features
                </Link>
              </Button>
            </div>
          </div>

          {/* Right: Visual Placeholder for Demo Video */}
          <div className="relative">
            <div className="aspect-video bg-card border-2 border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Placeholder for Demo Video */}
              <div className="w-full h-full bg-gradient-to-br from-primary/10 via-primary/5 to-background flex items-start justify-center pt-8 sm:pt-12">
                <div className="text-center space-y-4 px-6 sm:px-8">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-primary" strokeWidth={2} aria-hidden="true" />
                  </div>
                  <p className="text-base sm:text-lg font-medium text-muted-foreground">
                    Demo Video Coming Soon
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground/70 max-w-sm mx-auto">
                    See WooVector in action with real WooCommerce integration
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" aria-hidden="true" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl -z-10" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}