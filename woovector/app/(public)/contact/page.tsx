import { ContactForm } from "@/components/contact/ContactForm";
import { ContactInfoPanel } from "@/components/contact/ContactInfoPanel";
import { getCurrentUserId } from "@/lib/auth";
import { getCurrentUserProfile } from "@/lib/supabase/server";

export default async function ContactPage() {
  const userId = await getCurrentUserId();
  const profile = userId
    ? await getCurrentUserProfile(userId).catch(() => null)
    : null;

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <div className="mb-14 max-w-2xl space-y-5">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary dark:bg-primary/10">
            Contact support
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
            Need help with WooVector? We’ll get you answers fast.
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Share what’s happening and our team will respond within 24 hours. The more detail you include, the quicker we can resolve it for you.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <ContactForm
            defaultEmail={profile?.email ?? undefined}
            defaultName={profile?.full_name ?? undefined}
          />
          <ContactInfoPanel />
        </div>
      </div>
    </div>
  );
}

