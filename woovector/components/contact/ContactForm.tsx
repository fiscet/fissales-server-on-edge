"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState, useMemo } from "react";
import { Loader2, ShieldCheck, Clock } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  defaultEmail?: string;
  defaultName?: string;
}

const initialState = {
  success: false,
  error: undefined,
  referenceNumber: undefined,
  fieldErrors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full md:w-auto" disabled={pending}>
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Sending...
        </span>
      ) : (
        "Send message"
      )}
    </Button>
  );
}

export function ContactForm({ defaultEmail, defaultName }: ContactFormProps) {
  const [state, formAction] = useFormState(submitContactForm, initialState);
  const [formKey, setFormKey] = useState(() => Date.now());
  const [messageLength, setMessageLength] = useState(0);
  const [subjectLength, setSubjectLength] = useState(0);

  const characterFeedback = useMemo(() => {
    if (messageLength === 0) {
      return "Minimum 10 characters.";
    }
    if (messageLength < 10) {
      return `Add ${10 - messageLength} more characters so we can help faster.`;
    }
    if (messageLength > 1800) {
      return `${2000 - messageLength} characters remaining (max 2000).`;
    }
    return "Looks good — the more detail, the faster we can get you unstuck.";
  }, [messageLength]);

  useEffect(() => {
    if (state.success) {
      setFormKey(Date.now());
      setMessageLength(0);
      setSubjectLength(0);
    }
  }, [state.success]);

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle>Let’s talk</CardTitle>
        <CardDescription>
          Tell us what you need help with and we’ll get back within 24 hours.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {state.success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-200">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 flex-shrink-0" strokeWidth={2.5} />
              <div className="space-y-2">
                <p className="font-semibold">We’ve received your message.</p>
                <p className="text-sm leading-relaxed text-emerald-900/80 dark:text-emerald-100/80">
                  Your reference number is <span className="font-semibold">{state.referenceNumber}</span>. We’ll reply to you at your email within 24 hours. Please include this reference if you follow up.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {state.error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-200">
            {state.error}
          </div>
        ) : null}

        <form key={formKey} action={formAction} className="space-y-5" noValidate>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Your full name"
                defaultValue={defaultName}
                aria-invalid={Boolean(state.fieldErrors?.fullName)}
                aria-describedby={state.fieldErrors?.fullName ? "fullName-error" : undefined}
              />
              {state.fieldErrors?.fullName ? (
                <p className="text-sm text-rose-600" id="fullName-error">
                  {state.fieldErrors.fullName}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email<span className="text-rose-600">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={defaultEmail}
                required
                aria-invalid={Boolean(state.fieldErrors?.email)}
                aria-describedby={state.fieldErrors?.email ? "email-error" : undefined}
              />
              {state.fieldErrors?.email ? (
                <p className="text-sm text-rose-600" id="email-error">
                  {state.fieldErrors.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject<span className="text-rose-600">*</span></Label>
            <Input
              id="subject"
              name="subject"
              placeholder="How can we help?"
              required
              onChange={(event) => setSubjectLength(event.target.value.length)}
              aria-invalid={Boolean(state.fieldErrors?.subject)}
              aria-describedby={state.fieldErrors?.subject ? "subject-error" : undefined}
            />
            <p className="text-xs text-muted-foreground">
              {subjectLength > 110
                ? `${Math.max(0, 120 - subjectLength)} characters remaining.`
                : "Max 120 characters."}
            </p>
            {state.fieldErrors?.subject ? (
              <p className="text-sm text-rose-600" id="subject-error">
                {state.fieldErrors.subject}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message<span className="text-rose-600">*</span></Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Share as much detail as possible so we can help you faster"
              rows={6}
              required
              onChange={(event) => setMessageLength(event.target.value.length)}
              aria-invalid={Boolean(state.fieldErrors?.message)}
              aria-describedby={state.fieldErrors?.message ? "message-error" : undefined}
            />
            <p
              className={cn(
                "text-xs",
                messageLength < 10
                  ? "text-rose-500"
                  : messageLength > 1800
                    ? "text-amber-500"
                    : "text-muted-foreground"
              )}
            >
              {characterFeedback}
            </p>
            {state.fieldErrors?.message ? (
              <p className="text-sm text-rose-600" id="message-error">
                {state.fieldErrors.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2 rounded-lg border border-border px-4 py-4">
            <label className="flex items-start gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="consent"
                className="mt-1 h-4 w-4 rounded border-muted-foreground/30 text-primary focus:ring-2 focus:ring-primary/40"
                required
              />
              <span>
                I agree to the privacy policy and understand my data will be handled according to WooVector’s GDPR-compliant standards.
              </span>
            </label>
            {state.fieldErrors?.consent ? (
              <p className="text-sm text-rose-600">{state.fieldErrors.consent}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SubmitButton />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" strokeWidth={2.5} />
              <span>We reply within 24 hours, Monday–Friday.</span>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

