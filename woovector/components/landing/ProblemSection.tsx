import { AlertTriangle, CheckCircle } from "lucide-react";

interface ProblemPoint {
  id: string;
  text: string;
}

interface SolutionBenefit {
  id: string;
  text: string;
}

const problemPoints: ProblemPoint[] = [
  {
    id: "slow-responses",
    text: "Slow response times frustrate customers (3+ seconds)",
  },
  {
    id: "generic-answers",
    text: "Generic answers don&rsquo;t understand your products",
  },
  {
    id: "no-integration",
    text: "No WooCommerce integration = missed opportunities",
  },
  {
    id: "complex-setup",
    text: "Complex setup breaks sites or requires developer help",
  },
  {
    id: "no-data-access",
    text: "Generic chatbots can&rsquo;t access WooCommerce data",
  },
];

const solutionBenefits: SolutionBenefit[] = [
  {
    id: "fast-responses",
    text: "Sub-2-second responses keep customers engaged",
  },
  {
    id: "intelligent-metadata",
    text: "Understands your products with intelligent metadata",
  },
  {
    id: "native-integration",
    text: "Native WooCommerce API integration",
  },
  {
    id: "easy-install",
    text: "Risk-free WordPress plugin installation",
  },
  {
    id: "real-data",
    text: "Accesses real WooCommerce product data",
  },
];

export default function ProblemSection() {
  return (
    <section
      className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden"
      aria-labelledby="problem-section-title"
    >
      {/* Decorative background elements */}
      <div
        className="absolute top-20 left-10 w-64 h-64 bg-destructive/5 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-64 h-64 bg-success/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Split Problem-Solution Layout */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Problem Side */}
          <div className="space-y-6">
            {/* Problem Badge */}
            <div className="text-destructive text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
              <span>The Hidden Cost of Generic Chatbots</span>
            </div>

            {/* Problem Headline */}
            <h2
              id="problem-section-title"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight"
            >
              WooCommerce Vendors Lose 30% of Potential Sales
            </h2>

            {/* Problem Points List */}
            <div className="space-y-4 pt-2" role="list" aria-label="Problems with generic chatbots">
              {problemPoints.map((point) => (
                <div
                  key={point.id}
                  className="flex items-start gap-3 text-foreground/80"
                  role="listitem"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 bg-destructive/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle
                        className="w-4 h-4 text-destructive"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <span className="text-base leading-relaxed">{point.text}</span>
                </div>
              ))}
            </div>

            {/* Problem Impact */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-3 bg-destructive/10 rounded-xl px-4 py-3 border border-destructive/20">
                <div className="w-8 h-8 bg-destructive rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 text-destructive-foreground" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-destructive">
                  Result: 30% sales loss from slow, generic responses
                </span>
              </div>
            </div>
          </div>

          {/* Right: Solution Side */}
          <div className="space-y-6">
            {/* Solution Badge */}
            <div className="text-success text-lg font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
              <span>The WooVector Solution</span>
            </div>

            {/* Solution Headline */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Ultra-Fast AI Built for WooCommerce
            </h2>

            {/* Solution Benefits List */}
            <div className="space-y-4 pt-2" role="list" aria-label="WooVector solution benefits">
              {solutionBenefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className="flex items-start gap-3 text-foreground/80"
                  role="listitem"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-6 h-6 bg-success/10 rounded-lg flex items-center justify-center">
                      <CheckCircle
                        className="w-4 h-4 text-success"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </div>
                  </div>
                  <span className="text-base leading-relaxed">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* Solution Impact */}
            <div className="pt-4">
              <div className="inline-flex items-center gap-3 bg-success/10 rounded-xl px-4 py-3 border border-success/20">
                <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-success-foreground" aria-hidden="true" />
                </div>
                <span className="text-sm font-semibold text-success">
                  Result: 20-30% conversion increase with intelligent AI
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
