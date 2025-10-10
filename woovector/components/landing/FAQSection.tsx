import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  links?: Array<{ text: string; href: string; }>;
}

const woocommerceFAQs: FAQItem[] = [
  {
    id: "faq-1",
    question: "Will installing WooVector break my WooCommerce site?",
    answer:
      "No, WooVector is designed for risk-free installation. It's a standard WordPress plugin that follows WordPress coding best practices and doesn't modify your existing WooCommerce setup, database, or product data. If you ever want to remove it, simply deactivate and uninstall the plugin through your WordPress dashboard—your site will remain exactly as it was before. We've tested WooVector with thousands of WooCommerce stores to ensure seamless integration.",
  },
  {
    id: "faq-2",
    question: "How does WooVector connect to my WooCommerce store?",
    answer:
      "WooVector uses the secure WooCommerce REST API with read-only access to retrieve your product information. During setup, you'll generate API credentials directly from your WordPress dashboard, giving you full control over access permissions. WooVector never stores your product data on our servers—we only access it in real-time when a customer asks a question. Your WooCommerce store remains the single source of truth for all product information.",
  },
  {
    id: "faq-3",
    question: "How long does setup take?",
    answer:
      "Setup takes approximately 5 minutes and involves three simple steps: (1) Connect your WooCommerce API by generating read-only API keys in WordPress, (2) Import your product catalog so WooVector can understand your inventory, and (3) Install the lightweight WooVector plugin on your WordPress site. That's it! Once complete, your AI chatbot is live and ready to assist customers with intelligent, product-specific answers.",
  },
  {
    id: "faq-4",
    question: "How are responses really sub-2-seconds?",
    answer:
      "WooVector achieves lightning-fast responses through advanced vector database technology. When you import your products, we pre-process and index all your product metadata, descriptions, specifications, and pricing information. This allows the AI to instantly retrieve relevant product details and generate accurate, contextual responses in under 2 seconds—even for complex questions about multiple products or detailed specifications.",
  },
  {
    id: "faq-5",
    question: "Will this slow down my website?",
    answer:
      "No, WooVector won't affect your site speed at all. The plugin is extremely lightweight (under 50KB) and loads asynchronously, meaning it doesn't block your page rendering. All AI processing happens on our optimized infrastructure, not on your hosting server, so there's zero impact on your WooCommerce store's performance, load times, or server resources.",
  },
  {
    id: "faq-6",
    question: "How is WooVector different from Tidio or Gorgias?",
    answer:
      "Tidio and Gorgias are generic chatbot platforms designed for any website, requiring manual setup of responses and lacking deep product knowledge. WooVector is purpose-built exclusively for WooCommerce stores, with native API integration that automatically understands your entire product catalog. Our AI provides intelligent, product-specific answers based on your actual inventory, pricing, and specifications—no manual configuration or canned responses needed. While generic platforms bolt on basic chat functionality, WooVector delivers WooCommerce-native intelligence that actually helps customers find and buy products.",
  },
  {
    id: "faq-7",
    question: "Why not use ChatGPT or other AI tools directly?",
    answer:
      "Generic AI tools like ChatGPT have no access to your WooCommerce product data and can't provide accurate answers about your inventory, pricing, or specifications. They require manual integration work, lack real-time product knowledge, often give slow responses (10+ seconds), and can hallucinate incorrect information about your products. WooVector is specifically engineered for WooCommerce with native API integration, instant access to your product catalog, sub-2-second response times, and guaranteed accuracy based on your actual store data.",
  },
  {
    id: "faq-8",
    question: "What happens if I exceed my conversation limits?",
    answer:
      "You have full control when you approach your monthly conversation limit. WooVector's dashboard shows your usage in real-time, and you'll receive notifications as you approach your plan's limit. At that point, you can choose to either stop the chatbot temporarily until your next billing cycle, upgrade to a higher-tier plan, or pay for additional conversations on-demand. You maintain complete control—the chatbot never stops unexpectedly, and you decide what works best for your business.",
  },
  {
    id: "faq-9",
    question: "Can I cancel anytime?",
    answer:
      "Yes, absolutely. WooVector operates on a flexible month-to-month subscription with no long-term contracts or cancellation fees. You can cancel your subscription at any time directly from your dashboard, and your cancellation takes effect at the end of your current billing period. When you cancel, we'll provide clear instructions for safely removing the plugin from your WordPress site. Your WooCommerce store remains completely unchanged after removal.",
  },
];

export default function FAQSection() {
  return (
    <section
      id="faq"
      className="py-32 px-4 bg-background relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02]" aria-hidden="true" />
      <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-20 right-10 w-48 h-48 sm:w-72 sm:h-72 bg-primary/5 rounded-full blur-3xl" aria-hidden="true" />

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {"Everything WooCommerce Vendors "}
            <span className="text-primary">
              {"Need to Know"}
            </span>
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {"Common questions about WooVector integration and setup"}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 mb-20">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {woocommerceFAQs.map((faq) => (
              <div
                key={faq.id}
                className="group bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl px-6 py-1 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-lg"
              >
                <AccordionItem
                  value={faq.id}
                  className="border-none"
                >
                  <AccordionTrigger className="text-left group-hover:text-primary text-base md:text-lg font-bold text-card-foreground hover:text-primary transition-colors duration-300 py-5 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-base pb-5">
                    {faq.answer}
                    {faq.links && faq.links.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {faq.links.map((link, index) => (
                          <Link
                            key={index}
                            href={link.href}
                            className="text-primary hover:underline font-medium text-sm inline-flex items-center gap-1"
                          >
                            {link.text}
                            <span aria-hidden="true">→</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </div>
            ))}
          </Accordion>
        </div>

        {/* Still have questions CTA */}
        <div className="text-center">
          <p className="text-muted-foreground text-lg">
            {"Still have questions? "}
            <Link
              href="/contact"
              className="text-primary hover:underline font-medium"
            >
              Contact us
            </Link>
            {" and we'll get back to you within 24 hours."}
          </p>
        </div>
      </div>
    </section>
  );
}
