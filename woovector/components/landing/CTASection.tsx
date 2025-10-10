import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="text-center space-y-8">
          {/* Headline and Supporting Copy */}
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold">
              Join WooCommerce Vendors Already Increasing Sales
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start your 1-month free trial today and see the 20-30% conversion increase yourself
            </p>
          </div>

          {/* Dual CTA Buttons */}
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Start Free Trial - No Credit Card Required</Link>
            </Button>
            <Button variant="secondary" size="lg" asChild>
              <Link href="/contact">Talk to sales</Link>
            </Button>
          </div>

          {/* Trust Signals */}
          <div className="text-sm text-muted-foreground">
            <p>✓ 1-month free trial ✓ Cancel anytime ✓ Risk-free installation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
