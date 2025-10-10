"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactError({ error, reset }: { error: Error & { digest?: string; }; reset: () => void; }) {
  useEffect(() => {
    console.error("Contact page error:", error);
  }, [error]);

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Something went wrong</CardTitle>
            <CardDescription>We couldn’t load the contact form. You can try again or reach out via email.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                Reference ID (for support): <span className="font-mono text-xs">{error.digest ?? "N/A"}</span>
              </p>
              <p>
                Email us directly at <span className="font-medium text-primary">support@woovector.com</span> and include your reference ID. We’ll get back to you within 24 hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={reset}>Try again</Button>
              <Button variant="outline" asChild>
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

